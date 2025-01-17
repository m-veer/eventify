import React, { useState } from 'react';
import { 
  Container, Box, Typography, Paper, Button, TextField, Dialog, 
  RadioGroup, Radio, FormControlLabel, IconButton, Chip, 
  ToggleButton, ToggleButtonGroup,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Close as CloseIcon, 
  Person as PersonIcon,
  AccessTime as AccessTimeIcon, 
  LocalParking as LocalParkingIcon,
  LocationOn, 
  Videocam,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import API_URLS from '../../../constants/apiUrls';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import { Link as RouterLink, useNavigate } from "react-router-dom";

// Interfaces
interface FAQ {
  question: string;
  answer: string;
  hasError?: boolean;
}

interface Highlight {
  type: 'age' | 'doorTime' | 'parking';
  value: string;
  displayText: string;
  icon: JSX.Element;
}

interface FormErrors {
  title?: string;
  ticketCount?: string;
  venueName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  eventLink?: string;
  description?: string;
}

interface EventBasicInfoForm {
  title: string;
  ticketCount: string;
  venueName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  eventLink: string;
  description: string;
  price: number;
}

interface EventSubmissionData {
  name: string;
  eventTypes: string[];
  description: string;
  date: string;
  time: string;
  locationType: string;
  location: string;
  price: number;
  totalTickets: number;
  availableTickets: number;
  tags: string[];
  imageUrl: string;
  ageRestriction: string;
  doorTime: string;
  parkingInfo: string;
  // faqs: Record<number, FAQ>;
}

interface EventFormProps {
  mode: 'create' | 'update';
  existingEvent?: EventSubmissionData;
  onSubmit: (data: EventSubmissionData) => Promise<void>;
}

interface EventCreationModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'update';
  existingEvent?: EventSubmissionData;
  onSubmit: (data: EventSubmissionData) => Promise<void>;
}

// interface LocationForm extends EventBasicInfoForm {}

interface EventTypeSelectorProps {
  onTypeSelect?: (selectedTypes: string[]) => void;
}

interface User {
  firstName: string;
  lastName: string;
  createdAt: string;
  location: string;
  profilePhotoURL: string;
  updatedAt: string;
  email: string;
  token: string;
}

// Event Types Array
const eventTypes = [
  "Comedy", "Food & Drink", "Technology", "Festival", "Music", "Community & Culture",
  "Hobbies & Special Interest", "Performing & Visual Arts",
  "Parties", "Fashion & Beauty", "Non-Profit",
  "Religion & Spirituality", "Fashion & Education",
  "Health & Wellness", "Event Company & Agency or Promoter",
  "Networking", "Job Fair", "Charity & Causes",
  "Business & Professional", "Sports & Fitness"
];

// const EventForm: React.FC<EventFormProps> = ({ mode, existingEvent, onSubmit }) => {
const EventForm: React.FC<EventCreationModalProps> = ({
  open,
  onClose,
  mode,
  existingEvent,
  onSubmit
}) => {
  const convertDate = (inputDate: string) => {
    const date = new Date(inputDate);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  }

  const [formData, setFormData] = useState<EventBasicInfoForm>(() => ({
    title: existingEvent?.name || '',
    ticketCount: existingEvent?.totalTickets?.toString() || '',
    venueName: existingEvent?.location?.split(',')[0] || '',
    address1: existingEvent?.location?.split(',')[1] || '',
    address2: '',
    city: existingEvent?.location?.split(',')[2] || '',
    state: existingEvent?.location?.split(',')[3] || '',
    zipCode: existingEvent?.location?.split(',')[4] || '',
    eventLink: existingEvent?.location || '',
    description: existingEvent?.description || '',
    // date: convertDate(existingEvent?.date || "") || new Date()
    date: existingEvent ? convertDate(existingEvent.date) : '',
    ageRestriction: existingEvent?.ageRestriction,
    price: existingEvent?.price || 0
  }));
  // const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentType, setCurrentType] = useState<'age' | 'doorTime' | 'parking' | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [selectedOption, setSelectedOption] = useState('');
  const [doorTimeValue, setDoorTimeValue] = useState('');
  const [timeUnit, setTimeUnit] = useState('Minutes');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    existingEvent?.eventTypes || []
  );
  const [description, setDescription] = useState(existingEvent?.description || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(existingEvent?.tags || []);
  // const [startDate, setStartDate] = useState(existingEvent?.date || '');
  // const [startDate, setStartDate] = useState(existingEvent ? convertDate(existingEvent.date) : new Date());
  const [startDate, setStartDate] = useState<string>(
    existingEvent ? new Date(existingEvent.date).toISOString().split('T')[0] : ''
  );
  const [startTime, setStartTime] = useState(existingEvent?.time || '');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [locationType, setLocationType] = useState<'venue' | 'online'>(
    existingEvent?.locationType === 'in-person' ? 'venue' : 'online'
  );
  const [price, setPrice] = useState<number>(existingEvent?.price || 0);
  const user = useSelector((state: RootState) => state.user as User);
  const navigate = useNavigate();

  // Event handlers
  // const handleSubmit = async () => {
  //   try {
  //     setLoading(true);
  //     // Format the data according to the schema
  //     const eventData: EventSubmissionData = {
  //       name: formData.title,
  //       eventTypes: selectedTypes,
  //       description: description,
  //       date: startDate,
  //       time: startTime,
  //       locationType: locationType === 'venue' ? 'in-person' : 'virtual',
  //       location: locationType === 'venue' ? `${formData.address1}, ${formData.city}, ${formData.state} ${formData.zipCode}` : formData.eventLink,
  //       price: 0,
  //       totalTickets: parseInt(formData.ticketCount),
  //       availableTickets: parseInt(formData.ticketCount),
  //       tags: tags,
  //       imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : "",
  //       ageRestriction: highlights.find(h => h.type === 'age')?.value || "All ages allowed",
  //       doorTime: highlights.find(h => h.type === 'doorTime')?.value || "30 Minutes before event",
  //       parkingInfo: highlights.find(h => h.type === 'parking')?.value || "",
  //     };

  //     const response = await fetch(API_URLS.USER_CREATE_EVENT, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         'Authorization': `Bearer ${user.token}`
  //       },
  //       body: JSON.stringify(eventData),
  //     });

  //     if (response.status === 201) {
  //       // Handle success
  //       // Redirect to event page or show success message
  //     }
  //     navigate('/');
  //   } catch (error) {
  //     // Handle error
  //     console.error('Error creating event:', error);
  //     // Show error message to user
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const eventData: EventSubmissionData = {
        name: formData.title,
        eventTypes: selectedTypes,
        description: description,
        date: startDate,
        time: startTime,
        locationType: locationType === 'venue' ? 'in-person' : 'virtual',
        location: locationType === 'venue' ? 
          `${formData.address1}, ${formData.city}, ${formData.state} ${formData.zipCode}` : 
          formData.eventLink,
        price: existingEvent?.price || formData.price,
        totalTickets: parseInt(formData.ticketCount),
        availableTickets: mode === 'create' ? 
          parseInt(formData.ticketCount) : 
          existingEvent?.availableTickets || parseInt(formData.ticketCount),
        tags: tags,
        imageUrl: selectedImage ? 
          URL.createObjectURL(selectedImage) : 
          existingEvent?.imageUrl || "",
        ageRestriction: highlights.find(h => h.type === 'age')?.value || 
          existingEvent?.ageRestriction || "All ages allowed",
        doorTime: highlights.find(h => h.type === 'doorTime')?.value || 
          existingEvent?.doorTime || "30 Minutes before event",
        parkingInfo: highlights.find(h => h.type === 'parking')?.value || 
          existingEvent?.parkingInfo || ""
      };

      await onSubmit(eventData);
      onClose();
    } catch (error) {
      console.error('Error submitting event:', error);
    } finally {
      setLoading(false);
    }
  };

  // const validateEventData = (data: EventSubmissionData): boolean => {
  //   // Add validation logic
  //   if (!data.name || !data.eventTypes.length || !data.description) {
  //     return false;
  //   }
    
  //   if (data.locationType === 'in-person' && !data.location.address) {
  //     return false;
  //   }
    
  //   if (data.locationType === 'virtual' && !data.location.link) {
  //     return false;
  //   }
    
  //   if (data.totalTickets < 1) {
  //     return false;
  //   }
    
  //   return true;
  // };
  
  // const handleImageUpload = async (file: File): Promise<string> => {
  //   // Add image upload logic to your file server/cloud storage
  //   const formData = new FormData();
  //   formData.append('image', file);
    
  //   const response = await axios.post('/api/upload', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   });
    
  //   return response.data.imageUrl;
  // };

  const handleTypeClick = (type: string) => {
    const newSelectedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newSelectedTypes);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleTagInput = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && tagInput.trim()) {
      event.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleChange = (field: keyof EventBasicInfoForm) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));
    
    if (touched[field]) {
      const error = validateField(field, newValue);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: string | number) => {
    if (typeof field === 'string') {
      setTouched(prev => ({ ...prev, [field]: true }));
      const error = validateField(field, formData[field as keyof EventBasicInfoForm]);
      setErrors(prev => ({ ...prev, [field]: error }));
    } else if (typeof field === 'number') {
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };
  
  const handleHighlightClick = (type: 'age' | 'doorTime' | 'parking') => {
    setCurrentType(type);
    setDialogOpen(true);
    setSelectedOption('');
    setDoorTimeValue('');
  };

  const handleAddHighlight = () => {
    if (!currentType) return;
    
    let newHighlight: Highlight | undefined;
    switch (currentType) {
      case 'age':
        if (selectedOption) {
          newHighlight = {
            type: 'age',
            value: selectedOption,
            displayText: selectedOption,
            icon: <PersonIcon /> as JSX.Element
          };
        }
        break;
      case 'doorTime':
        if (doorTimeValue && timeUnit) {
          newHighlight = {
            type: 'doorTime',
            value: `${doorTimeValue} ${timeUnit}`,
            displayText: `Check-in ${doorTimeValue} ${timeUnit} before event`,
            icon: <AccessTimeIcon /> as JSX.Element
          };
        }
        break;
      case 'parking':
        if (selectedOption) {
          newHighlight = {
            type: 'parking',
            value: selectedOption,
            displayText: selectedOption,
            icon: <LocalParkingIcon /> as JSX.Element
          };
        }
        break;
    }
    
    if (newHighlight) {
      setHighlights(prev => [...prev.filter(h => h.type !== currentType), newHighlight!]);
      setDialogOpen(false);
      setSelectedOption('');
      setDoorTimeValue('');
    }
  };
  
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

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(event.target.value);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          m: 2
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ color: '#f05123', fontStyle: 'italic', fontWeight: 'bold' }}>
            {mode === 'create' ? 'Create Your Event' : 'Update Your Event'}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Event Type Selector */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ color: '#f05123', mb: 3, fontWeight: 'bold' }}>
            What type of events do you host?
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {eventTypes.map((type) => (
              <Chip
                key={type}
                label={type}
                clickable
                onClick={() => handleTypeClick(type)}
                sx={{
                  borderRadius: '20px',
                  bgcolor: selectedTypes.includes(type) ? '#f05123' : 'transparent',
                  color: selectedTypes.includes(type) ? 'white' : 'inherit',
                  border: '1px solid',
                  borderColor: selectedTypes.includes(type) ? '#f05123' : '#e0e0e0',
                  '&:hover': {
                    bgcolor: selectedTypes.includes(type) ? '#d84315' : 'rgba(240, 81, 35, 0.04)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Basic Info Section */}
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

        {/* DateTime Section */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: '#f05123',
              mb: 3,
              fontWeight: 'bold'
            }}
          >
            Date and Time
          </Typography>
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3 
            }}
          >
            <TextField
              type="date"
              label="Start Date"
              value={startDate}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="time"
              label="Start Time"
              value={startTime}
              onChange={handleTimeChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Box>

        {/* Location Section */}
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

        {/* Amount Section */}
        <Box sx={{ position: 'relative' }}>
          <Typography sx={{ position: 'absolute', top: -8, right: -8, color: '#f05123' }}>*</Typography>
          <TextField
            fullWidth
            type="number"
            label="Event Price"
            placeholder="Enter event price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            inputProps={{ min: 0, step: "0.01" }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
        </Box>

        {/* Event Details Section */}
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

        {/* Image Upload Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ color: '#f05123', mb: 3, fontWeight: 'bold' }}>
            Upload an Image for the event banner:
          </Typography>
          
          <Box
            sx={{
              border: '2px dashed #e0e0e0',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              bgcolor: '#fafafa',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: '#f5f5f5'
              }
            }}
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload">
              <Button
                component="span"
                startIcon={<CloudUploadIcon />}
                variant="contained"
                sx={{
                  bgcolor: '#f05123',
                  '&:hover': {
                    bgcolor: '#d84315'
                  }
                }}
              >
                Upload Image
              </Button>
            </label>
            {selectedImage && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Selected file: {selectedImage.name}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Good to Know Section */}
        { mode === 'create' && (
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ color: '#f05123', mb: 3, fontWeight: 'bold' }}>
            Good to know
          </Typography>
          
          <Typography sx={{ color: '#666', mb: 4 }}>
            Use this section to feature specific information about your event. Add highlights and frequently asked questions for attendees.
          </Typography>

          <Box sx={{ mb: 6 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Highlights</Typography>
            
            {highlights.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                {highlights.map((highlight) => (
                  <Chip
                    key={highlight.type}
                    icon={highlight.icon}
                    label={highlight.displayText}
                    onDelete={() => setHighlights(prev => prev.filter(h => h.type !== highlight.type))}
                    sx={{
                      bgcolor: '#fff5f2',
                      color: '#f05123',
                      '& .MuiChip-icon': { color: '#f05123' }
                    }}
                  />
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {!highlights.find(h => h.type === 'age') && (
                <Button 
                  startIcon={<AddIcon />}
                  onClick={() => handleHighlightClick('age')}
                  sx={{ 
                    border: '1px solid #ddd',
                    color: '#f05123',
                    borderRadius: '20px',
                    textTransform: 'none'
                  }}
                >
                  Add Age Info
                </Button>
              )}
              {!highlights.find(h => h.type === 'doorTime') && (
                <Button 
                  startIcon={<AddIcon />}
                  onClick={() => handleHighlightClick('doorTime')}
                  sx={{ 
                    border: '1px solid #ddd',
                    color: '#f05123',
                    borderRadius: '20px',
                    textTransform: 'none'
                  }}
                >
                  Add Door Time
                </Button>
              )}
              {!highlights.find(h => h.type === 'parking') && (
                <Button 
                  startIcon={<AddIcon />}
                  onClick={() => handleHighlightClick('parking')}
                  sx={{ 
                    border: '1px solid #ddd',
                    color: '#f05123',
                    borderRadius: '20px',
                    textTransform: 'none'
                  }}
                >
                  Add Parking Info
                </Button>
              )}
            </Box>
          </Box>

          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Add highlights about your event</Typography>
                <IconButton onClick={() => setDialogOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              
              {currentType === 'age' && (
                <>
                  <Typography variant="h6" sx={{ mb: 2 }}>Is there an age restriction?</Typography>
                  <RadioGroup value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                    <FormControlLabel value="All ages allowed" control={<Radio />} label="All ages allowed" />
                    <FormControlLabel value="There's an age restriction" control={<Radio />} label="There's an age restriction" />
                    <FormControlLabel value="Parent or guardian needed" control={<Radio />} label="Parent or guardian needed" />
                  </RadioGroup>
                </>
              )}

              {currentType === 'doorTime' && (
                <>
                  <Typography variant="h6" sx={{ mb: 2 }}>What time can attendees check in before the event?</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                    <TextField
                      label="Time before event starts"
                      type="number"
                      value={doorTimeValue}
                      onChange={(e) => setDoorTimeValue(e.target.value)}
                    />
                    <RadioGroup row value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)}>
                      <FormControlLabel value="Minutes" control={<Radio />} label="Minutes" />
                      <FormControlLabel value="Hours" control={<Radio />} label="Hours" />
                    </RadioGroup>
                  </Box>
                </>
              )}

              {currentType === 'parking' && (
                <>
                  <Typography variant="h6" sx={{ mb: 2 }}>Is there parking at your venue?</Typography>
                  <RadioGroup value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                    <FormControlLabel value="Free parking" control={<Radio />} label="Free parking" />
                    <FormControlLabel value="Paid parking" control={<Radio />} label="Paid parking" />
                    <FormControlLabel value="No parking options" control={<Radio />} label="No parking options" />
                  </RadioGroup>
                </>
              )}

              <Button
                variant="contained"
                onClick={handleAddHighlight}
                sx={{ 
                  mt: 3,
                  bgcolor: '#f05123',
                  color: 'white',
                  '&:hover': { bgcolor: '#d84315' }
                }}
              >
                Add to event
              </Button>
            </Box>
          </Dialog>
        </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: '#666',
            mr: 2
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={loading}
          sx={{ 
            bgcolor: '#f05123', 
            color: 'white',
            '&:hover': { 
              bgcolor: '#d84315' 
            }
          }}
        >
          {loading ? 
            (mode === 'create' ? 'Creating Event...' : 'Updating Event...') : 
            (mode === 'create' ? 'Create Event' : 'Update Event')
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventForm;