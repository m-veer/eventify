import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { Share2, Calendar, Mail } from 'lucide-react';

interface ThankYouProps {
  event: {
    title: string;
    date: string;
    time: string;
    venue: string;
    description: string;
  };
}

const ThankYou: React.FC<ThankYouProps> = ({ event }) => {
  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: `Join me at ${event.title} on ${event.date} at ${event.venue}!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = `${event.title}\n${event.date}\n${window.location.href}`;
        await navigator.clipboard.writeText(shareUrl);
        alert('Event details copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const addToCalendar = () => {
    const eventDetails = encodeURIComponent(`${event.title}\n${event.venue}\n${event.description}`);
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${event.title}&details=${eventDetails}&dates=${event.date}`;
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <Grid container justifyContent="center" sx={{ minHeight: '100vh', py: 4 }}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Box sx={{
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: 2,
          p: 4,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <Typography variant="h3" sx={{
            color: '#ff0000',
            fontWeight: 700,
            mb: 3,
            fontSize: { xs: '2rem', md: '3rem' }
          }}>
            Thank You For Registering!
          </Typography>

          <Typography variant="h6" sx={{ mb: 4, color: '#666' }}>
            You will receive all the details in your email shortly.
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Event Details
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {event.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {event.date} at {event.time}
            </Typography>
            <Typography variant="body1">
              {event.venue}
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'center',
            mb: 4
          }}>
            <Button
              variant="contained"
              startIcon={<Calendar />}
              onClick={addToCalendar}
              sx={{
                backgroundColor: '#ff0000',
                '&:hover': { backgroundColor: '#d32f2f' }
              }}
            >
              Add to Calendar
            </Button>
            <Button
              variant="outlined"
              startIcon={<Share2 />}
              onClick={handleShare}
              sx={{
                borderColor: '#ff0000',
                color: '#ff0000',
                '&:hover': {
                  borderColor: '#d32f2f',
                  backgroundColor: 'rgba(255, 0, 0, 0.04)'
                }
              }}
            >
              Share Event
            </Button>
          </Box>

          <Typography variant="body2" sx={{ color: '#666' }}>
            SHARING IS CARING
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, mb: 3 }}>
            Invite your friends to sign up for this event, too
          </Typography>

          <Box sx={{ mt: 4, borderTop: '1px solid #eee', pt: 4 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Need help? Contact us at <Mail size={16} style={{ verticalAlign: 'middle' }} /> support@eventname.com
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ThankYou;