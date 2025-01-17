import React, { useState } from 'react';
import { Box, Card, CardMedia, Typography, IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import API_URLS from '../../../../constants/apiUrls';
import EventForm from '../../../../pages/Events/EventForm/EventForm';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store/store";

interface EventCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  title: string;
  location: string;
  date: string;
  organizerName: string;
  organizerCreatedAt: string;
  time: string;
  venue: string;
  price: string;
  onEdit?: (eventData: EventCardProps) => void;
}

interface EventSubmissionData {
  name: string;
  eventTypes: string[];
  description: string;
  date: string;
  time: string;
  locationType: 'virtual' | 'in-person';
  location: string;
  price: number;
  totalTickets: number;
  availableTickets: number;
  tags: string[];
  imageUrl: string;
  ageRestriction: string;
  doorTime: string;
  parkingInfo: string;
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
  isAuthenticated: boolean;
}

const OrganizerEventCard: React.FC<EventCardProps> = ({
  id,
  name,
  description,
  image,
  title,
  location,
  date,
  organizerName,
  organizerCreatedAt,
  time,
  venue,
  price,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user as User);

  const handleDelete = async () => {
    try {
      const response = await fetch(API_URLS.USER_DELETE_EVENT, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`,
          "eventId": id
        }
      });
    } catch (error) {
      console.log(error);
  };
  }

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (data: EventSubmissionData) => {
    try {
      const response = await fetch(`${API_URLS.USER_UPDATE_EVENT}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        setEditModalOpen(false);
        // Optionally refresh the event list or update local state
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const existingEventData: EventSubmissionData = {
    name: title,
    description: description,
    date: date,
    time: time,
    locationType: location.includes('http') ? 'virtual' : 'in-person',
    location: location,
    price: parseFloat(price),
    totalTickets: 0, // Add actual value if available
    availableTickets: 0, // Add actual value if available
    tags: [], // Add actual tags if available
    imageUrl: image,
    eventTypes: [], // Add actual event types if available
    ageRestriction: '', // Add if available
    doorTime: '', // Add if available
    parkingInfo: '' // Add if available
  };
  return (
    <>
    <Card 
      sx={{ 
        display: 'flex',
        mb: 2,
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
          cursor: 'pointer'
        },
        maxWidth: '800px',
        mx: 'auto'
      }}
    >
      <CardMedia
        component="img"
        sx={{ 
          width: '180px',
          height: '120px',
          objectFit: 'cover',
          borderRadius: '8px 0 0 8px'
        }}
        image={image}
        alt={title}
      />
      
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        p: 2,
        justifyContent: 'space-between'
      }}>
        <Stack spacing={0.5}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1a1a1a'
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              fontSize: '0.875rem'
            }}
          >
            {`${date} • ${time}`}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              fontSize: '0.875rem'
            }}
          >
            {location}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#1a1a1a',
              fontWeight: 500,
              fontSize: '0.875rem'
            }}
          >
            From {price}
          </Typography>
        </Stack>
        
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ 
            alignItems: 'flex-start'
          }}
        >
          <IconButton 
            size="small"
            onClick={handleEdit}
            sx={{ 
              color: '#666',
              padding: '4px',
              '&:hover': {
                color: '#1976d2'
              }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton   
            size="small"
            onClick={handleDelete}
            sx={{ 
              color: '#666',
              padding: '4px',
              '&:hover': {
                color: '#d32f2f'
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </Card>

    <EventForm
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        mode="update"
        existingEvent={existingEventData}
        onSubmit={handleEditSubmit}
      />
    </>
  );
};

export default OrganizerEventCard;