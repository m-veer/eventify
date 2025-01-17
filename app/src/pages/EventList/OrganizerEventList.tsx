import React, { useState, useMemo, useEffect } from 'react';
import { Container, Box, Card, CardMedia, Typography, IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Pagination from '../../components/Common/Pagination/Pagination';
import EventForm from '../../pages/Events/EventForm/EventForm';
import API_URLS from '../../constants/apiUrls';
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface Event {
  _id: string;
  name: string;
  title: string;
  location: string;
  locationType: string;
  description: string;
  image: string;
  date: string;
  time: string;
  createdAt: string;
  organizer: {
    email: string;
    createdAt: string;
    firstName: string;
    lastName: string;
    _id: string;
  }
  eventTypes: string[];
  price: number;
  totalTickets: number;
  availableTickets: number,
  tags: string[],
  imageUrl: string,
  ageRestriction: string,
  doorTime: string,
  parkingInfo: string,
  eventPhotoURL: string
}

interface ProcessedEvent {
  id: string;
  name: string;
  eventTypes: string[];
  description: string;
  image: string;
  title: string;
  location: string;
  locationType: string;
  date: string;
  organizerName: string;
  organizerCreatedAt: string;
  time: string;
  venue: string;
  price: number;
  totalTickets: number;
  availableTickets: number;
  tags: string[];
  imageUrl: string;
  ageRestriction: string;
  doorTime: string;
  parkingInfo: string;
  eventPhotoURL: string;
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

const EventList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [events, setEvents] = useState<ProcessedEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<ProcessedEvent | null>(null);
  const user = useSelector((state: RootState) => state.user as User);
  // const [numberOfEvents, setNumberOfEvents] = useState(0);

  const convertDate = (inputDat: string) => {
    const date = new Date(inputDat);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const processEventData = (item: Event): ProcessedEvent => ({
    id: item._id,
    name: item.name,
    description: item.description,
    image: item.image,
    title: item.name,
    location: item.location,
    locationType: item.locationType,
    date: convertDate(item.createdAt),
    time: item.time,
    venue: item.location,
    organizerName: `${item.organizer.firstName} ${item.organizer.lastName}`,
    organizerCreatedAt: item.organizer.createdAt,
    price: item.price,
    eventTypes: item.eventTypes,
    totalTickets: item.totalTickets,
    availableTickets: item.availableTickets,
    tags: item.tags,
    imageUrl: item.imageUrl,
    ageRestriction: item.ageRestriction,
    doorTime: item.doorTime,
    parkingInfo: item.parkingInfo,
    eventPhotoURL: item.eventPhotoURL
  });

  const handleDelete = async (eventId: string) => {
    try {
      await fetch(API_URLS.USER_DELETE_EVENT, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`,
          "eventId": eventId
        }
      });
      fetchEvents(); // Refresh the list after deletion
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (event: ProcessedEvent) => {
    setCurrentEvent(event);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (data: EventSubmissionData) => {
    if (!currentEvent) return;
    
    try {
      const response = await fetch(API_URLS.USER_UPDATE_EVENT, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`,
          "eventId": currentEvent.id
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        setEditModalOpen(false);
        fetchEvents(); // Refresh the list after update
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URLS.USER_GET_EVENTS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const uniqueEvents = new Map<string, ProcessedEvent>();

      data.data.forEach((item: Event) => {
        if (!uniqueEvents.has(item._id)) {
          uniqueEvents.set(item._id, processEventData(item));
        }
      });

      // setNumberOfEvents(uniqueEvents.size);
      
      setEvents(Array.from(uniqueEvents.values()));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const currentEvents = useMemo(() => {
    const indexOfLastEvent = currentPage * itemsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
    return events.slice(indexOfFirstEvent, indexOfLastEvent);
  }, [currentPage, itemsPerPage, events]);

  const totalPages = Math.ceil(events.length / itemsPerPage);

  const renderEventCard = (event: ProcessedEvent) => {
    const existingEventData: EventSubmissionData = {
      name: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      locationType: event.locationType,
      location: event.location,
      price: event.price,
      totalTickets: 0,
      availableTickets: 0,
      tags: [],
      imageUrl: event.image,
      eventTypes: [],
      ageRestriction: '',
      doorTime: '',
      parkingInfo: ''
    };

    return (
      <Card key={event.id} sx={{ 
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
      }}>
        <CardMedia
          component="img"
          sx={{ 
            width: '180px',
            height: '120px',
            objectFit: 'cover',
            borderRadius: '8px 0 0 8px'
          }}
          image={event.image}
          alt={event.title}
        />
        
        <Box sx={{ 
          display: 'flex', 
          flex: 1,
          p: 2,
          justifyContent: 'space-between'
        }}>
          <Stack spacing={0.5}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: '#1a1a1a' }}>
              {event.title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
              {`${event.date} • ${event.time}`}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
              {event.location}
            </Typography>
            <Typography variant="body2" sx={{ color: '#1a1a1a', fontWeight: 500, fontSize: '0.875rem' }}>
              From {event.price}
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
            <IconButton 
              size="small"
              onClick={() => handleEdit(event)}
              sx={{ 
                color: '#666',
                padding: '4px',
                '&:hover': { color: '#1976d2' }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton   
              size="small"
              onClick={() => handleDelete(event.id)}
              sx={{ 
                color: '#666',
                padding: '4px',
                '&:hover': { color: '#d32f2f' }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Card>
    );
  };

  return (
    <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ my: 3 }}>
        {loading && <div>Loading events...</div>}
        {error && <div>Error: {error}</div>}
        {!loading && !error && currentEvents.map(renderEventCard)}
      </Box>
      <Pagination 
        totalPages={totalPages}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onItemsPerPageChange={(items) => {
          setItemsPerPage(items);
          setCurrentPage(1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
      {currentEvent && (
        <EventForm
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setCurrentEvent(null);
          }}
          mode="update"
          existingEvent={currentEvent ? {
            name: currentEvent.title,
            description: currentEvent.description,
            date: currentEvent.date,
            time: currentEvent.time,
            locationType: currentEvent.locationType,
            location: currentEvent.location,
            price: currentEvent.price,
            totalTickets: currentEvent.totalTickets,
            availableTickets: currentEvent.availableTickets,
            tags: currentEvent.tags,
            imageUrl: currentEvent.image,
            eventTypes: currentEvent.eventTypes,
            ageRestriction: currentEvent.ageRestriction,
            doorTime: currentEvent.doorTime,
            parkingInfo: currentEvent.parkingInfo
          } : undefined}
          onSubmit={handleEditSubmit}
        />
      )}
    </Container>
  );
};

export default EventList;