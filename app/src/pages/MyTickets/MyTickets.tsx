// pages/MyTickets.tsx
import React, { useState, useEffect } from "react";
import { Container, Box, Tabs, Tab, Button } from "@mui/material";
import ticketsBanner from "../../assets/mobile-tickets.png";
import TicketsList from "../../components/User/Tickets/TicketList";
import { segregateEvents } from "../../utils/dateUtils";
// import { Events } from '../../types/event';

interface Event {
  id: number;
  date: string;
  month: string;
  title: string;
  time: string;
  orderInfo: string;
}

const MyTickets: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [futureEvents, setFutureEvents] = useState<Event[]>([]);
  const [showAll, setShowAll] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setShowAll(false);
  };

  useEffect(() => {
    // Fetch or define your events data
    const allEvents: Event[] = [
      {
        id: 1,
        date: "20",
        month: "NOV",
        title: "Tech Innovations Summit",
        time: "Mon, Nov 20, 2:00 PM EST",
        orderInfo: "Free order #11110382580 placed on Sun, Nov 19, 12:45 PM",
      },
      {
        id: 2,
        date: "19",
        month: "NOV",
        title: "AI and Ethics Forum",
        time: "Sun, Nov 19, 1:00 PM EST",
        orderInfo: "Free order #11110382581 placed on Sat, Nov 18, 11:20 AM",
      },
      {
        id: 3,
        date: "18",
        month: "NOV",
        title: "Cybersecurity Best Practices",
        time: "Sat, Nov 18, 4:00 PM EST",
        orderInfo: "Free order #11110382582 placed on Fri, Nov 17, 3:30 PM",
      },
      {
        id: 4,
        date: "17",
        month: "NOV",
        title: "Sustainable Tech Solutions",
        time: "Fri, Nov 17, 3:00 PM EST",
        orderInfo: "Free order #11110382583 placed on Thu, Nov 16, 2:15 PM",
      },
      {
        id: 5,
        date: "16",
        month: "NOV",
        title: "Blockchain Revolution",
        time: "Thu, Nov 16, 5:00 PM EST",
        orderInfo: "Free order #11110382584 placed on Wed, Nov 15, 1:10 PM",
      },
      {
        id: 6,
        date: "15",
        month: "NOV",
        title: "Tech in Healthcare Symposium",
        time: "Wed, Nov 15, 6:00 PM EST",
        orderInfo: "Free order #11110382585 placed on Tue, Nov 14, 11:00 AM",
      },
      {
        id: 7,
        date: "14",
        month: "NOV",
        title: "Startup Founders Meetup",
        time: "Tue, Nov 14, 12:00 PM EST",
        orderInfo: "Free order #11110382586 placed on Mon, Nov 13, 10:00 AM",
      },
      {
        id: 8,
        date: "13",
        month: "NOV",
        title: "Cloud Computing Trends",
        time: "Mon, Nov 13, 4:00 PM EST",
        orderInfo: "Free order #11110382587 placed on Sun, Nov 12, 9:00 AM",
      },
      {
        id: 9,
        date: "12",
        month: "NOV",
        title: "Future of FinTech",
        time: "Sun, Nov 12, 3:00 PM EST",
        orderInfo: "Free order #11110382588 placed on Sat, Nov 11, 8:30 AM",
      },
      {
        id: 10,
        date: "11",
        month: "NOV",
        title: "Digital Marketing Workshop",
        time: "Sat, Nov 11, 5:00 PM EST",
        orderInfo: "Free order #11110382589 placed on Fri, Nov 10, 7:45 AM",
      },
      {
        id: 11,
        date: "30",
        month: "NOV",
        title: "Green Energy in Tech",
        time: "Thu, Nov 30, 2:00 PM EST",
        orderInfo: "Free order #11110382590 placed on Wed, Nov 29, 11:00 AM",
      },
      {
        id: 12,
        date: "02",
        month: "DEC",
        title: "Next-Gen AI Models",
        time: "Sat, Dec 2, 3:00 PM EST",
        orderInfo: "Free order #11110382591 placed on Fri, Dec 1, 12:00 PM",
      },
      {
        id: 13,
        date: "05",
        month: "DEC",
        title: "Quantum Computing Explained",
        time: "Tue, Dec 5, 1:00 PM EST",
        orderInfo: "Free order #11110382592 placed on Mon, Dec 4, 10:30 AM",
      },
      {
        id: 14,
        date: "08",
        month: "DEC",
        title: "Women in Tech Forum",
        time: "Fri, Dec 8, 5:00 PM EST",
        orderInfo: "Free order #11110382593 placed on Thu, Dec 7, 9:00 AM",
      },
      {
        id: 15,
        date: "12",
        month: "DEC",
        title: "Cyber Threat Landscape 2024",
        time: "Tue, Dec 12, 4:00 PM EST",
        orderInfo: "Free order #11110382594 placed on Mon, Dec 11, 8:00 AM",
      },
      {
        id: 16,
        date: "15",
        month: "DEC",
        title: "Future of IoT Devices",
        time: "Fri, Dec 15, 3:00 PM EST",
        orderInfo: "Free order #11110382595 placed on Thu, Dec 14, 7:30 AM",
      },
      {
        id: 17,
        date: "20",
        month: "DEC",
        title: "Digital Inclusion Conference",
        time: "Wed, Dec 20, 2:00 PM EST",
        orderInfo: "Free order #11110382596 placed on Tue, Dec 19, 6:00 AM",
      },
      {
        id: 18,
        date: "22",
        month: "DEC",
        title: "Augmented Reality in Education",
        time: "Fri, Dec 22, 1:00 PM EST",
        orderInfo: "Free order #11110382597 placed on Thu, Dec 21, 5:00 AM",
      },
      {
        id: 19,
        date: "28",
        month: "DEC",
        title: "AI-Driven Automation",
        time: "Thu, Dec 28, 6:00 PM EST",
        orderInfo: "Free order #11110382598 placed on Wed, Dec 27, 4:00 AM",
      },
      {
        id: 20,
        date: "31",
        month: "DEC",
        title: "2024 Tech Innovations Preview",
        time: "Sun, Dec 31, 4:00 PM EST",
        orderInfo: "Free order #11110382599 placed on Sat, Dec 30, 3:00 AM",
      },
    ];

    const { pastEvents: past, futureEvents: future } =
      segregateEvents(allEvents);
    setPastEvents(past);
    setFutureEvents(future);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        zIndex: 0,
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={ticketsBanner}
          alt="Eventify Tickets"
          sx={{
            // maxWidth: "600px",
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "contain",
          }}
        />
      </Box>

      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
            mt: 3,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              mb: 4,
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                fontSize: "1rem",
                minWidth: "120px",
              },
              "& .Mui-selected": {
                color: "primary.main",
              },
            }}
          >
            <Tab label="Past Events" />
            <Tab label="Future Events" />
          </Tabs>
        </Box>

        <Box sx={{ mt: 2 }}>
          {tabValue === 0 && (
            <>
              <TicketsList
                events={showAll ? pastEvents : pastEvents.slice(0, 5)}
              />
              {pastEvents.length > 5 && (
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button
                    onClick={() => setShowAll(!showAll)}
                    sx={{
                      color: "#ff0000",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                        color: "#e60000",
                      },
                    }}
                  >
                    {showAll ? "View Less" : "View More"}
                  </Button>
                </Box>
              )}
            </>
          )}
          {tabValue === 1 && (
            <>
              <TicketsList
                events={showAll ? futureEvents : futureEvents.slice(0, 5)}
              />
              {futureEvents.length > 5 && (
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button
                    onClick={() => setShowAll(!showAll)}
                    sx={{
                      color: "#0066cc",
                      textTransform: "none",
                      fontSize: "14px",
                      fontWeight: 400,
                      mt: 2,
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {showAll ? "View Less" : "View More"}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default MyTickets;
