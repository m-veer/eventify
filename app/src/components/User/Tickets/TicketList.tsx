// components/Tickets/TicketsList.tsx
import React from "react";
import { Box } from "@mui/material";
import TicketItem from "./TicketItem";
import { Event } from '../../types/event';

interface TicketsListProps {
  events: Event[];
}

const TicketsList: React.FC<TicketsListProps> = ({ events }) => {
    return (
      <Box sx={{ mt: 3 }}>
        {events.map((event) => (
          <TicketItem key={event.id} {...event} />
        ))}
      </Box>
    );
  };

export default TicketsList;