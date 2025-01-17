// components/CreateEvent/EventTypeSelector.tsx
import React, { useState } from "react";
import { Box, Typography, Chip } from "@mui/material";

const eventTypes = [
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
  "Event Compant & Agency or Promoter",
  "Networking",
  "Job Fair",
  "Charity & Causes",
  "Business & Professional",
  "Sports & Fitness",
];

interface EventTypeSelectorProps {
  onTypeSelect?: (selectedTypes: string[]) => void;
}

const EventTypeSelector: React.FC<EventTypeSelectorProps> = ({ onTypeSelect }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleTypeClick = (type: string) => {
    const newSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newSelectedTypes);
    if (onTypeSelect) {
      onTypeSelect(newSelectedTypes);
    }
  };

  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h5"
        sx={{
          color: "#f05123",
          mb: 3,
          fontWeight: "bold",
        }}
      >
        What type of events do you host?
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {eventTypes.map((type) => (
          <Chip
            key={type}
            label={type}
            clickable
            onClick={() => handleTypeClick(type)}
            sx={{
              borderRadius: "20px",
              bgcolor: selectedTypes.includes(type) ? "#f05123" : "transparent",
              color: selectedTypes.includes(type) ? "white" : "inherit",
              border: "1px solid",
              borderColor: selectedTypes.includes(type) ? "#f05123" : "#e0e0e0",
              "&:hover": {
                bgcolor: selectedTypes.includes(type) ? "#d84315" : "rgba(240, 81, 35, 0.04)",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default EventTypeSelector;