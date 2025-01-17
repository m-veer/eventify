import React, { useState, useMemo } from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import { useLocation } from "react-router-dom";
import EventCard from "../../components/User/EventList/EventListCard/AttendeeEventListCard";
import Pagination from "../../components/Common/Pagination/Pagination";
import Filter from "../../components/User/SearchResults/Filter";

interface ApiEvent {
  _id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  price: number;
  type: string[];
  organizer?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Event {
  image: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  price: string;
}

const SearchResults: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q") || "";

  const transformEventData = (apiEvent: ApiEvent): Event => {
    const eventDate = new Date(apiEvent.date);
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const formattedTime = eventDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    return {
      image: "/default-event-image.jpg",
      title: apiEvent.name,
      date: formattedDate,
      time: formattedTime,
      venue: apiEvent.location,
      price: `$${apiEvent.price.toFixed(2)}`,
    };
  };

  // Replace with actual API call
  const apiResponse = {
    success: true,
    message: "Success",
    data: [
      {
        _id: "1",
        name: "AI & Tech Networking Boston",
        description:
          "Join tech enthusiasts for an evening of networking and discussions on AI trends.",
        date: "2024-12-18T18:00:00",
        location: "Bar Moxy",
        price: 0.0,
        type: ["Networking", "Tech"],
        organizer: {
          firstName: "John",
          lastName: "Doe",
          email: "johndoe@example.com",
        },
        image: "ui/src/assets/event-1.webp",
      },
      {
        _id: "2",
        name: "Comedy Night Out",
        description: "Laugh your heart out at the best comedy show in town.",
        date: "2024-12-20T20:00:00",
        location: "Laugh Factory",
        price: 25.0,
        type: ["Comedy", "Entertainment"],
        organizer: {
          firstName: "Jane",
          lastName: "Smith",
          email: "janesmith@example.com",
        },
        image: "/images/comedy-night.jpg",
      },
      {
        _id: "3",
        name: "Live Jazz at the Blue Note",
        description: "Experience an enchanting evening of live jazz music.",
        date: "2025-01-05T19:30:00",
        location: "Blue Note Jazz Club",
        price: 15.0,
        type: ["Music", "Jazz"],
        organizer: {
          firstName: "Michael",
          lastName: "Brown",
          email: "michaelbrown@example.com",
        },
        image: "/images/live-jazz.jpg",
      },
      {
        _id: "4",
        name: "Italian Cooking Masterclass",
        description:
          "Learn to cook authentic Italian dishes from a master chef.",
        date: "2025-01-12T15:00:00",
        location: "The Culinary Studio",
        price: 50.0,
        type: ["Cooking", "Workshop"],
        organizer: {
          firstName: "Sophia",
          lastName: "Johnson",
          email: "sophiajohnson@example.com",
        },
        image: "/images/cooking-class.jpg",
      },
      {
        _id: "5",
        name: "Rock Revival Concert",
        description: "Enjoy a night of electrifying rock music performances.",
        date: "2025-01-17T21:00:00",
        location: "Downtown Arena",
        price: 40.0,
        type: ["Music", "Concert"],
        organizer: {
          firstName: "Chris",
          lastName: "Lee",
          email: "chrislee@example.com",
        },
        image: "/images/rock-concert.jpg",
      },
      {
        _id: "6",
        name: "Photography for Beginners",
        description: "A hands-on workshop for aspiring photographers.",
        date: "2025-01-25T10:00:00",
        location: "Artisan Studio",
        price: 30.0,
        type: ["Photography", "Workshop"],
        organizer: {
          firstName: "Emma",
          lastName: "Taylor",
          email: "emmataylor@example.com",
        },
        image: "/images/photography-workshop.jpg",
      },
      {
        _id: "7",
        name: "Standup Comedy Showcase",
        description: "A night of hilarious stand-up performances.",
        date: "2025-02-01T20:00:00",
        location: "Comedy Vault",
        price: 20.0,
        type: ["Comedy", "Entertainment"],
        organizer: {
          firstName: "Olivia",
          lastName: "Anderson",
          email: "oliviaanderson@example.com",
        },
        image: "/images/standup-comedy.jpg",
      },
      {
        _id: "8",
        name: "Startup Founders Meetup",
        description: "Connect with fellow entrepreneurs and share ideas.",
        date: "2025-02-05T18:00:00",
        location: "Innovation Hub",
        price: 0.0,
        type: ["Networking", "Startup"],
        organizer: {
          firstName: "Liam",
          lastName: "Martinez",
          email: "liammartinez@example.com",
        },
        image: "/images/startup-meetup.jpg",
      },
      {
        _id: "9",
        name: "Film Screening: The Classics",
        description: "Enjoy a selection of timeless classic films.",
        date: "2025-02-15T17:00:00",
        location: "Grand Cinema",
        price: 12.0,
        type: ["Film", "Entertainment"],
        organizer: {
          firstName: "Noah",
          lastName: "White",
          email: "noahwhite@example.com",
        },
        image: "/images/film-screening.jpg",
      },
      {
        _id: "10",
        name: "Local Authors Book Fair",
        description: "Meet local authors and explore their works.",
        date: "2025-02-23T11:00:00",
        location: "City Library",
        price: 0.0,
        type: ["Literature", "Fair"],
        organizer: {
          firstName: "Isabella",
          lastName: "Garcia",
          email: "isabellagarcia@example.com",
        },
        image: "/images/book-fair.jpg",
      },
    ],
  };

  const events = useMemo(
    () => apiResponse.data.map(transformEventData),
    [apiResponse.data]
  );

  const totalPages = Math.ceil(events.length / itemsPerPage);

  const currentEvents = useMemo(() => {
    const indexOfLastEvent = currentPage * itemsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
    return events.slice(indexOfFirstEvent, indexOfLastEvent);
  }, [currentPage, itemsPerPage, events]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (filterType: string, value: string) => {
    // Handle filter changes here - will be implemented with API
  };

  const handleFilterSubmit = (filters: {
    type: string[];
    startDate: string | null;
    endDate: string | null;
    price: string[];
  }) => {
    // Handle filter submission here
    // Make API call with filters
  };

  return (
    <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="h1">
          Search Results: {searchQuery}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {events.length} events found
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Filter onSubmit={handleFilterSubmit} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Box sx={{ my: 3 }}>
            {currentEvents.map((event, index) => (
              <EventCard id={""} key={`event-${index}`} {...event} />
            ))}
          </Box>
          {events.length > 0 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchResults;