import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  CircularProgress,
  Alert,
  Button,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Pagination from "../../components/Common/Pagination/Pagination";
import AttendeeEventCard from "../../components/User/EventList/EventListCard/AttendeeEventListCard";
import axios from "axios";
import API_URLS from "../../constants/apiUrls";

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  locationType: string;
  price: number;
  eventTypes: string[];
  organizer: {
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
  };
}

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 500,
  padding: "6px 16px",
  borderRadius: "8px",
  color: "#333",
  whiteSpace: "nowrap",
  minWidth: "auto",
  "&:hover": {
    backgroundColor: "rgba(255, 0, 0, 0.04)",
  },
  "&.active": {
    backgroundColor: "#ff0000",
    color: "#ffffff",
  },
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "8px",
  overflowX: "auto",
  padding: "16px 0",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "-ms-overflow-style": "none",
  scrollBehavior: "smooth",
  [theme.breakpoints.down("sm")]: {
    gap: "4px",
    padding: "12px 0",
  },
}));

const categories = [
  "ALL",
  "Online",
  "Today",
  "This weekend",
  "Free",
  "Comedy",
  "Food & Drink",
  "Music",
  "Community & Culture",
  "Hobbies & Special Interest",
  "Performing & Visual Arts",
  "Parties",
  "Fashion & Beauty",
  "Non-Profit",
  "Religion & Spirituality",
  "Fashion & Education",
  "Health & Wellness",
  "Event Company & Agency or Promoter",
  "Networking",
  "Job Fair",
  "Charity & Causes",
  "Business & Professional",
  "Sports & Fitness",
];

const BrowseEvents: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("ALL");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchEvents = async (category?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Update the URL to match backend route
      const params: Record<string, string> = {};

      if (category && category !== "ALL") {
        switch (category) {
          case "Online":
            params.locationType = "virtual";
            break;
          case "Today":
            params.startDate = new Date().toISOString();
            params.endDate = new Date().toISOString();
            break;
          case "This weekend":
            const friday = new Date();
            friday.setDate(friday.getDate() + (5 - friday.getDay()));
            const sunday = new Date(friday);
            sunday.setDate(sunday.getDate() + 2);
            params.startDate = friday.toISOString();
            params.endDate = sunday.toISOString();
            break;
          case "Free":
            params.maxPrice = "0";
            break;
          default:
            params.eventType = category;
        }
      }

      const response = await axios.get(API_URLS.FILTERS_API, {
        params,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch events. Please try again later.");
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    fetchEvents(category);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  return (
    <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box
        sx={{ position: "relative", width: "100%", backgroundColor: "#ffffff" }}
      >
        <ScrollContainer>
          {categories.map((category) => (
            <StyledButton
              key={category}
              variant="text"
              className={activeCategory === category ? "active" : ""}
              onClick={() => handleCategoryClick(category)}
              size={isMobile ? "small" : "medium"}
            >
              {category}
            </StyledButton>
          ))}
        </ScrollContainer>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ my: 3, minHeight: "200px", position: "relative" }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          currentEvents.map((event) => (
            <AttendeeEventCard
              key={event._id}
              id={event._id}
              title={event.name}
              date={new Date(event.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
              time={event.time}
              venue={event.location}
              price={`$${event.price.toFixed(2)}`}
              image={""}
            />
          ))
        )}
      </Box>

      {!isLoading && events.length > 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}
    </Container>
  );
};

export default BrowseEvents;
