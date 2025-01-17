import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import EventCard, { EventCardProps } from '../EventCard/EventCards';

interface EventCategoryProps {
  title: string;
  events: EventCardProps[];
}

const EventCategory: React.FC<EventCategoryProps> = ({ title, events }) => {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>{title}</Typography>
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton><ArrowBack /></IconButton>
        <Box display="flex" overflow="hidden">
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </Box>
        <IconButton><ArrowForward /></IconButton>
      </Box>
    </Box>
  );
};

export default EventCategory;