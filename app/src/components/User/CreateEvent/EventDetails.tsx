// components/CreateEvent/EventDetails.tsx
import React, { useState, KeyboardEvent } from 'react';
import { Box, Typography, TextField, Button, Chip } from '@mui/material';

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
}

const EventDetails: React.FC<Event> = ({id, name, description, date}) => {
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleTagInput = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && tagInput.trim()) {
      event.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const convertDate = (inputDat: string) => {
    const date = new Date(inputDat);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    return formattedDate;
  }

  const event = {
    id: id,
    name: name,
    description: description,
    date: convertDate(date)
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(null);
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Box sx={{ mb: 6 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          color: '#f05123',
          mb: 3,
          fontWeight: 'bold'
        }}
      >
        Event Details
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          placeholder="Describe your event"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Box>
          <TextField
            fullWidth
            label="Tags"
            placeholder="Press enter to add tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleTagInput}
          />
          {tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  sx={{
                    bgcolor: '#fff5f2',
                    color: '#f05123',
                    '&:hover': {
                      bgcolor: '#ffe4dc'
                    }
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EventDetails;