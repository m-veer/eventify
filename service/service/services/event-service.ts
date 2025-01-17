import mongoose from "mongoose";

// Enhanced interfaces
interface IOrganizer {
  name: string;
  organization: string;
  _id: mongoose.Types.ObjectId;
}

interface IEvent {
  type: string[];
  location: string;
  date: Date;
  price: number;
  isVirtual: boolean;
  organizer: IOrganizer;
  isReported: boolean;
  maxAttendees: number;
  name: string;
  description: string;
  rating: number;
}

interface DateRange {
  start: Date;
  end: Date;
}

interface FilterCriteria {
  types?: string[];
  operator?: "and" | "or";
  location?: string;
  dateRange?: string | DateRange;
  price?: string;
  organizer?: string;
  isReported?: boolean;
  attendance?: string;
  searchTerm?: string;
  sort?: string;
}

type MongoNumberComparison = {
  $eq?: number;
  $gt?: number;
  $gte?: number;
  $lt?: number;
  $lte?: number;
  $ne?: number;
};

type DateKeywordFunction = () => DateRange;

// Enhanced date keywords
const dateKeywords: Record<string, DateKeywordFunction> = {
  today: (): DateRange => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  },
  tomorrow: (): DateRange => {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  },
  weekend: (): DateRange => {
    const start = new Date();
    const daysUntilWeekend = (6 - start.getDay()) % 7;
    start.setDate(start.getDate() + daysUntilWeekend);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  },
  "next week": (): DateRange => {
    const start = new Date();
    start.setDate(start.getDate() + (7 - start.getDay()));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  },
  "next month": (): DateRange => {
    const start = new Date();
    start.setMonth(start.getMonth() + 1, 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  },
  "last month": (): DateRange => {
    const start = new Date();
    start.setMonth(start.getMonth() - 1, 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  },
};

// Enhanced date range parser
const parseDateRange = (dateRange: string | DateRange): DateRange => {
  // Handle pre-parsed DateRange object
  if (
    dateRange &&
    typeof dateRange === "object" &&
    "start" in dateRange &&
    "end" in dateRange
  ) {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // Handle string formats
  if (typeof dateRange === "string") {
    // Handle fixed keywords
    if (dateRange in dateKeywords) {
      return dateKeywords[dateRange]();
    }

    // Handle "next X days" pattern
    const nextDaysMatch = dateRange.match(/next\s+(\d+)\s+days?/i);
    if (nextDaysMatch) {
      const numberOfDays = parseInt(nextDaysMatch[1], 10);
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setDate(end.getDate() + numberOfDays);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    // Handle specific date range format (e.g., "2024-12-04 to 2024-12-16")
    const dateRangeMatch = dateRange.match(
      /(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})/
    );
    if (dateRangeMatch) {
      const start = new Date(dateRangeMatch[1]);
      const end = new Date(dateRangeMatch[2]);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  }

  // Default to today if no match
  return dateKeywords.today();
};

// Enhanced price parser
const parsePriceFilter = (priceStr: string): MongoNumberComparison | null => {
  if (!priceStr) return null;

  // Handle "free" case
  if (priceStr.toLowerCase() === "free") return { $eq: 0 };

  // Extract numeric value and handle comparison keywords
  const match = priceStr.match(/(\d+)/);
  if (match) {
    const price = parseInt(match[1], 10);
    if (
      priceStr.toLowerCase().includes("under") ||
      priceStr.toLowerCase().includes("less than")
    ) {
      return { $lt: price };
    } else if (
      priceStr.toLowerCase().includes("over") ||
      priceStr.toLowerCase().includes("more than")
    ) {
      return { $gt: price };
    }
  }
  return null;
};

// Enhanced events filter function
const filterEvents = async (criteria: FilterCriteria): Promise<IEvent[]> => {
  try {
    const query: mongoose.FilterQuery<IEvent> = {};

    // 1. Handle event types with operator
    if (
      criteria.types &&
      Array.isArray(criteria.types) &&
      criteria.types.length > 0
    ) {
      if (criteria.operator === "or") {
        query.eventTypes = { $in: criteria.types };
      } else {
        query.eventTypes = { $all: criteria.types };
      }
    }

    // 2. Handle location with virtual support
    if (criteria.location) {
      query.location = criteria.location;
    }

    // 3. Handle date ranges
    if (criteria.dateRange) {
      const dateRange = parseDateRange(criteria.dateRange);
      query.date = {
        $gte: dateRange.start,
        $lte: dateRange.end,
      };
    }

    // 4. Handle price filters
    if (criteria.price) {
      const priceFilter = parsePriceFilter(criteria.price);
      if (priceFilter) {
        query.price = priceFilter;
      }
    }

    // 5. Handle organizer search
    if (criteria.organizer) {
      const organizerRegex = new RegExp(criteria.organizer, "i");
      query.$or = query.$or || [];
      query.$or.push(
        { "organizer.name": organizerRegex },
        { "organizer.organization": organizerRegex }
      );
    }

    // 6. Handle reported events
    if (criteria.isReported === true) {
      query.isReported = true;
    }

    // 7. Handle attendance limits
    if (criteria.attendance) {
      const attendanceFilter = parsePriceFilter(criteria.attendance);
      if (attendanceFilter) {
        query.maxAttendees = attendanceFilter;
      }
    }

    // 8. Handle search terms for name/description
    if (criteria.searchTerm) {
      const searchRegex = new RegExp(criteria.searchTerm, "i");
      const searchQuery = [{ name: searchRegex }, { description: searchRegex }];

      query.$or = query.$or ? [...query.$or, ...searchQuery] : searchQuery;
    }

    // Handle sorting
    const sort: Record<string, 1 | -1> = {};
    if (criteria.sort) {
      switch (criteria.sort.toLowerCase()) {
        case "price_asc":
          sort.price = 1;
          break;
        case "price_desc":
          sort.price = -1;
          break;
        case "date_asc":
          sort.date = 1;
          break;
        case "date_desc":
          sort.date = -1;
          break;
        case "rating":
          sort.rating = -1;
          break;
        default:
          sort.date = 1;
      }
    } else {
      // Default sort by date ascending
      sort.date = 1;
    }

    // Execute query with population
    const Event = mongoose.model<IEvent>("Event");
    console.log(query);
    const results = await Event.find(query)
      .sort(sort)
      .populate("organizer", "name organization")
      .exec();

    return results;
  } catch (error) {
    console.error("Error filtering events:", error);
    throw error;
  }
};

export {
  filterEvents,
  IEvent,
  FilterCriteria,
  DateRange,
  parseDateRange,
  parsePriceFilter,
};
