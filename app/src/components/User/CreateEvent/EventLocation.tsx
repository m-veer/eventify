// components/CreateEvent/EventLocation.tsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { LocationOn, Videocam } from '@mui/icons-material';

interface LocationForm {
  venueName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  eventLink: string;
  description?: string;
}

interface FormErrors {
  venueName?: string;
  address1?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  eventLink?: string;
  description?: string;
}

const EventLocation: React.FC = () => {
  const [locationType, setLocationType] = useState<'venue' | 'online'>('venue');
  const [formData, setFormData] = useState<LocationForm>({
    venueName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    eventLink: '',
    description: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (name: string, value: string | undefined) => {
    if (!value?.trim() && name !== 'address2') {
      return 'This field is required';
    }
    if (name === 'zipCode' && value && !/^\d{5}(-\d{4})?$/.test(value)) {
      return 'Please enter a valid ZIP code';
    }
    if (name === 'eventLink' && value && !/^https?:\/\/.+/.test(value)) {
      return 'Please enter a valid URL starting with http:// or https://';
    }
    return '';
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof LocationForm]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: keyof LocationForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setFormData(prev => ({ ...prev, [field]: newValue }));
    if (touched[field]) {
      const error = validateField(field, newValue);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ color: '#f05123', mb: 3, fontWeight: 'bold' }}>
        Where is it located?
      </Typography>

      <ToggleButtonGroup
        value={locationType}
        exclusive
        onChange={(_, newValue) => {
          if (newValue) {
            setLocationType(newValue);
            setErrors({});
            setTouched({});
          }
        }}
        sx={{ mb: 3 }}
      >
        <ToggleButton 
          value="venue"
          sx={{
            textTransform: 'none',
            px: 3,
            py: 1,
            '&.Mui-selected': {
              backgroundColor: '#f05123',
              color: 'white',
              '&:hover': {
                backgroundColor: '#d84315'
              }
            }
          }}
        >
          <LocationOn sx={{ mr: 1 }} />
          Venue
        </ToggleButton>
        <ToggleButton 
          value="online"
          sx={{
            textTransform: 'none',
            px: 3,
            py: 1,
            '&.Mui-selected': {
              backgroundColor: '#f05123',
              color: 'white',
              '&:hover': {
                backgroundColor: '#d84315'
              }
            }
          }}
        >
          <Videocam sx={{ mr: 1 }} />
          Online event
        </ToggleButton>
      </ToggleButtonGroup>

      {locationType === 'venue' ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Typography sx={{ position: 'absolute', top: -8, right: -8, color: '#f05123' }}>*</Typography>
            <TextField
              fullWidth
              label="Venue Name"
              placeholder="Enter the venue name"
              value={formData.venueName}
              onChange={handleChange('venueName')}
              onBlur={() => handleBlur('venueName')}
              error={!!errors.venueName}
              helperText={errors.venueName}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>

          <Box sx={{ position: 'relative' }}>
            <Typography sx={{ position: 'absolute', top: -8, right: -8, color: '#f05123' }}>*</Typography>
            <TextField
              fullWidth
              label="Address 1"
              placeholder="Enter the full address"
              value={formData.address1}
              onChange={handleChange('address1')}
              onBlur={() => handleBlur('address1')}
              error={!!errors.address1}
              helperText={errors.address1}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>

          <TextField
            fullWidth
            label="Address 2"
            placeholder="Apartment, suite, etc. (optional)"
            value={formData.address2}
            onChange={handleChange('address2')}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ position: 'relative', flex: 1 }}>
              <Typography sx={{ position: 'absolute', top: -8, right: -8, color: '#f05123' }}>*</Typography>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={handleChange('city')}
                onBlur={() => handleBlur('city')}
                error={!!errors.city}
                helperText={errors.city}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            <Box sx={{ position: 'relative', flex: 1 }}>
              <Typography sx={{ position: 'absolute', top: -8, right: -8, color: '#f05123' }}>*</Typography>
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                onChange={handleChange('state')}
                onBlur={() => handleBlur('state')}
                error={!!errors.state}
                helperText={errors.state}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>

            <Box sx={{ position: 'relative', flex: 1 }}>
              <Typography sx={{ position: 'absolute', top: -8, right: -8, color: '#f05123' }}>*</Typography>
              <TextField
                fullWidth
                label="ZIP Code"
                value={formData.zipCode}
                onChange={handleChange('zipCode')}
                onBlur={() => handleBlur('zipCode')}
                error={!!errors.zipCode}
                helperText={errors.zipCode}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Typography sx={{ position: 'absolute', top: -8, right: -8, color: '#f05123' }}>*</Typography>
            <TextField
              fullWidth
              label="Event Link"
              placeholder="Add a link to your online event"
              value={formData.eventLink}
              onChange={handleChange('eventLink')}
              onBlur={() => handleBlur('eventLink')}
              error={!!errors.eventLink}
              helperText={errors.eventLink}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>
          
          <Box sx={{ position: 'relative' }}>
            <Typography sx={{ position: 'absolute', top: -8, right: -8, color: '#f05123' }}>*</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Provide Details"
              placeholder="Add details about how to join the online event"
              value={formData.description}
              onChange={handleChange('description')}
              onBlur={() => handleBlur('description')}
              error={!!errors.description}
              helperText={errors.description}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EventLocation;