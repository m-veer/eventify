import express, { Router, Request, Response } from "express";
import { filterEvents } from "../services/event-service";

interface DateRange {
  start: Date;
  end: Date;
}

interface EventCriteria {
  types?: string[];
  operator?: "and" | "or";
  location?: string;
  dateRange?: string | DateRange;
  price?: string;
  organizer?: string;
  searchTerm?: string;
  attendance?: string;
  sort?: "price_asc" | "price_desc" | "date_asc" | "date_desc" | "rating";
  isReported: boolean;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface ApiResponse {
  success: boolean;
  events?: any[];
  criteria?: EventCriteria;
  error?: string;
}

// Interface for the raw JSON response from OpenAI
interface RawCriteria {
  types: string[] | null;
  operator: "and" | "or" | null;
  location: string | null;
  dateRange: string | { start: string; end: string } | null;
  price: string | null;
  organizer: string | null;
  searchTerm: string | null;
  attendance: string | null;
  sort: "price_asc" | "price_desc" | "date_asc" | "date_desc" | "rating" | null;
  isReported: boolean;
}

const router: Router = express.Router();

interface SuggestEventsRequest extends Request {
  body: {
    prompt: string;
  };
}

router.post(
  "/suggest-events",
  async (req: SuggestEventsRequest, res: Response<ApiResponse>) => {
    try {
      const { prompt } = req.body;
      const user_location = "Boston";

      //   const openAIPrompt = `Extract event search criteria from this query: "${prompt}". If the user enters "near me" in the prompt, the location to search is ${user_location}. Return a JSON object with these fields:
      // - types: array of event types (e.g., ["Tech", "Comedy"])
      // - operator: "and" or "or" for multiple types
      // - location: string or null (can be city name, "virtual", or "near me")
      // - dateRange: string (e.g., "today", "tomorrow", "next week", "next month")
      // - price: string (e.g., "free", "under 50", "over 100")
      // - organizer: string or null (organizer name or organization)
      // - searchTerm: string or null (for name/description search)
      // - attendance: string or null (e.g., "less than 100")
      // - sort: string or null ("price_asc", "price_desc", "date_asc", "date_desc", "rating")
      // - isReported: boolean
      // - dateRange: object with "start" and "end" dates in ISO format, or string for relative dates`;

      // const openAIPrompt = `Extract event search criteria from this query: "${prompt}". If the user enters "near me" in the prompt, the location to search is ${user_location}. Return a JSON object with these fields:
      // - types: array of event types (e.g., ["Tech", "Comedy"])
      // - operator: "and" or "or" for multiple types
      // - location: string or null (can be city name, "virtual", or "near me")
      // - dateRange: string (e.g., "today", "tomorrow", "next week", "next month")
      // - price: string (e.g., "free", "under 50", "over 100")
      // - organizer: string or null (organizer name or organization)
      // - searchTerm: string or null (for name/description search)
      // - attendance: string or null (e.g., "less than 100")
      // - sort: string or null ("price_asc", "price_desc", "date_asc", "date_desc", "rating")
      // - isReported: boolean
      // - dateRange: object with "start" and "end" dates in ISO format, or string for relative dates
      // Example outputs:
      // 1. For "events next 5 days": {"dateRange": "next 5 days"}
      // 2. For "events from Dec 4, 2024 to Dec 16, 2024": {"dateRange": {"start": "2024-12-04", "end": "2024-12-16"}}
      // 3. For "Tech or Comedy events": {"type": ["Tech", "Comedy"], "operator": "OR"}
      // Example user queries and their interpretations:
      // 1. "Show me Tech events in Boston next week under $50"
      // {
      //   "types": ["Tech"],
      //   "location": "Boston",
      //   "dateRange": "next week",
      //   "price": "under 50",
      //   "operator": null,
      //   "organizer": null,
      //   "searchTerm": null,
      //   "attendance": null,
      //   "sort": null,
      //   "isReported": false
      // }
      // 2. "Find free virtual Comedy or Music events happening tomorrow"
      // {
      //   "types": ["Comedy", "Music"],
      //   "location": "virtual",
      //   "dateRange": "tomorrow",
      //   "price": "free",
      //   "operator": "or",
      //   "organizer": null,
      //   "searchTerm": null,
      //   "attendance": null,
      //   "sort": null,
      //   "isReported": false
      // }
      // `;

      const openAIPrompt = `Extract event search criteria from this query: "${prompt}". If the user enters "near me" in the prompt, the location to search is ${user_location}. Return a JSON object with these fields:
      - types: array of event types (e.g., ["Tech", "Comedy"])
      - operator: "and" or "or" for multiple types (default to "and" if not specified)
      - location: string or null (can be city name, "virtual", or location value from user_location if "near me" is mentioned)
      - dateRange: string or object
        - string format for relative dates (e.g., "today", "tomorrow", "next week", "next month", "next X days")
        - object format for specific dates: {"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"}
      - price: string or null (e.g., "free", "under 50", "over 100")
      - organizer: string or null (organizer name or organization)
      - searchTerm: string or null (for name/description search)
      - attendance: string or null (e.g., "less than 100")
      - sort: string or null ("price_asc", "price_desc", "date_asc", "date_desc", "rating")
      - isReported: boolean (default false)

      Example queries and their interpretations:

      1. "I want to attend Tech and Comedy events near me in next 5 days"
      {
        "types": ["Tech", "Comedy"],
        "operator": "and",
        "location": "${user_location}",
        "dateRange": "next 5 days",
        "price": null,
        "organizer": null,
        "searchTerm": null,
        "attendance": null,
        "sort": null,
        "isReported": false
      }

      2. "I want to attend Tech or Comedy events near me planned from 4th December, 2024 to 16th December, 2024"
      {
        "types": ["Tech", "Comedy"],
        "operator": "or",
        "location": "${user_location}",
        "dateRange": {
          "start": "2024-12-04",
          "end": "2024-12-16"
        },
        "price": null,
        "organizer": null,
        "searchTerm": null,
        "attendance": null,
        "sort": null,
        "isReported": false
      }

      3. "What are some upcoming AI conferences organized by MIT?"
      {
        "types": ["Conference"],
        "operator": "and",
        "location": null,
        "dateRange": "next month",
        "price": null,
        "organizer": "MIT",
        "searchTerm": "AI",
        "attendance": null,
        "sort": "date_asc",
        "isReported": false
      }

      4. "Show me events with high ratings happening this weekend"
      {
        "types": null,
        "operator": null,
        "location": null,
        "dateRange": "weekend",
        "price": null,
        "organizer": null,
        "searchTerm": null,
        "attendance": null,
        "sort": "rating",
        "isReported": false
      }

      5. "Find reported events in Cambridge from last month"
      {
        "types": null,
        "operator": null,
        "location": "Cambridge",
        "dateRange": "last month",
        "price": null,
        "organizer": null,
        "searchTerm": null,
        "attendance": null,
        "sort": null,
        "isReported": true
      }

      6. "List all virtual events about machine learning"
      {
        "types": null,
        "operator": null,
        "location": "virtual",
        "dateRange": null,
        "price": null,
        "organizer": null,
        "searchTerm": "machine learning",
        "attendance": null,
        "sort": null,
        "isReported": false
      }

      7. "What are the most expensive concerts next month?"
      {
        "types": ["Concert"],
        "operator": null,
        "location": null,
        "dateRange": "next month",
        "price": null,
        "organizer": null,
        "searchTerm": null,
        "attendance": null,
        "sort": "price_desc",
        "isReported": false
      }

      8. "Show me events by John Smith happening today"
      {
        "types": null,
        "operator": null,
        "location": null,
        "dateRange": "today",
        "price": null,
        "organizer": "John Smith",
        "searchTerm": null,
        "attendance": null,
        "sort": null,
        "isReported": false
      }

      9. "Find networking events with less than 100 attendees"
      {
        "types": ["Networking"],
        "operator": null,
        "location": null,
        "dateRange": null,
        "price": null,
        "organizer": null,
        "searchTerm": null,
        "attendance": "less than 100",
        "sort": null,
        "isReported": false
      }

      Return a JSON object matching the format shown in the examples above. Be sure to:
      1. Handle multiple event types with appropriate "and"/"or" operator
      2. Replace "near me" with the provided user_location value
      3. Parse specific date ranges into start/end date objects
      4. Parse relative dates like "next X days" as strings
      5. Include only non-null values in the response
      6. Default sort to null unless specifically mentioned
      7. Set isReported to true only when explicitly mentioned
      8. Handle attendance limits when specified
      9. Extract search terms for name/description searching
      10. Identify organizer names/organizations when mentioned`;

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: openAIPrompt }],
            response_format: { type: "json_object" },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("OpenAI API request failed");
      }

      const data: OpenAIResponse = await response.json();
      const parsedCriteria = JSON.parse(
        data.choices[0].message.content
      ) as RawCriteria;

      // Transform the criteria in a type-safe way
      const transformedCriteria: EventCriteria = {
        ...(parsedCriteria.types && { types: parsedCriteria.types }),
        ...(parsedCriteria.operator && { operator: parsedCriteria.operator }),
        ...(parsedCriteria.location && { location: parsedCriteria.location }),
        ...(parsedCriteria.price && { price: parsedCriteria.price }),
        ...(parsedCriteria.organizer && {
          organizer: parsedCriteria.organizer,
        }),
        ...(parsedCriteria.searchTerm && {
          searchTerm: parsedCriteria.searchTerm,
        }),
        ...(parsedCriteria.attendance && {
          attendance: parsedCriteria.attendance,
        }),
        ...(parsedCriteria.sort && { sort: parsedCriteria.sort }),
        isReported: parsedCriteria.isReported ?? false,
      };

      // Handle dateRange separately due to its complex type
      if (parsedCriteria.dateRange) {
        if (typeof parsedCriteria.dateRange === "string") {
          transformedCriteria.dateRange = parsedCriteria.dateRange;
        } else if (typeof parsedCriteria.dateRange === "object") {
          transformedCriteria.dateRange = {
            start: new Date(parsedCriteria.dateRange.start),
            end: new Date(parsedCriteria.dateRange.end),
          };
        }
      }

      console.log(transformedCriteria);
      const events = await filterEvents(transformedCriteria);

      res.json({
        success: true,
        events,
        criteria: transformedCriteria,
      });
    } catch (error) {
      console.error(
        "Error in suggest-events:",
        error instanceof Error ? error.message : String(error)
      );
      res.status(500).json({
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }
);

export default router;
