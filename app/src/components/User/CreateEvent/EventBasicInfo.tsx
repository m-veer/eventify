// components/CreateEvent/EventBasicInfo.tsx
import React, { useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';

interface EventBasicInfoForm {
  title: string;
  ticketCount: string;
}

interface FormErrors {
  title?: string;
  ticketCount?: string;
}

const EventBasicInfo: React.FC = () => {
  const [formData, setFormData] = useState<EventBasicInfoForm>({
    title: '',
    ticketCount: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'title':
        if (!value.trim()) {
          return 'Event title is required';
        }
        if (value.length > 100) {
          return 'Event title cannot exceed 100 characters';
        }
        break;
      case 'ticketCount':
        if (!value.trim()) {
          return 'Number of tickets is required';
        }
        const ticketCount = parseInt(value);
        if (isNaN(ticketCount) || ticketCount <= 0) {
          return 'Number of tickets must be greater than 0';
        }
        if (ticketCount > 100000) {
          return 'Maximum ticket limit is 100,000';
        }
        break;
    }
    return '';
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof EventBasicInfoForm]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: keyof EventBasicInfoForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setFormData(prev => ({ ...prev, [field]: newValue }));
    if (touched[field]) {
      const error = validateField(field, newValue);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
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
        Basic Information
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            label="Event Title"
            placeholder="Give your event a name"
            value={formData.title}
            onChange={handleChange('title')}
            onBlur={() => handleBlur('title')}
            error={!!errors.title}
            helperText={errors.title}
            required
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: '8px'
              }
            }}
          />
          <Typography 
            component="span" 
            sx={{ 
              position: 'absolute',
              top: -8,
              right: -8,
              color: '#f05123'
            }}
          >
            *
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <TextField
            fullWidth
            label="Number of Tickets Available"
            type="number"
            placeholder="Enter the maximum number of attendees"
            value={formData.ticketCount}
            onChange={handleChange('ticketCount')}
            onBlur={() => handleBlur('ticketCount')}
            error={!!errors.ticketCount}
            helperText={errors.ticketCount}
            required
            inputProps={{ min: 1 }}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: '8px'
              }
            }}
          />
          <Typography 
            component="span" 
            sx={{ 
              position: 'absolute',
              top: -8,
              right: -8,
              color: '#f05123'
            }}
          >
            *
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default EventBasicInfo;