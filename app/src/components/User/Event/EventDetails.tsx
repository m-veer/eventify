import React, { useState } from 'react';
import { Grid, Box, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Share2, Twitter, Instagram, Flag, Facebook, Linkedin } from 'lucide-react';
import axios from 'axios';

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
}

interface EventDetailsProps {
  id: string;
  name: string;
  description: string;
  date: string;
}

const EventDetails: React.FC<EventDetailsProps> = ({ id, name, description, date }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportError, setReportError] = useState('');
  const open = Boolean(anchorEl);

  const convertDate = (inputDate: string) => {
    const date = new Date(inputDate);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const event = {
    id: id,
    name: name,
    description: description,
    date: convertDate(date)
  };

  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setIsShareModalOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsShareModalOpen(false);
  };

  const handleReportClick = () => {
    setIsReportDialogOpen(true);
  };

  const handleReportConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/events/report', null, {
        headers: {
          'eventid': id,
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        setIsReported(true);
        setReportError('');
      }
    } catch (error: any) {
      setReportError(error.response?.data?.message || 'Failed to report event');
    } finally {
      setIsReportDialogOpen(false);
    }
  };

  const shareToSocialMedia = (platform: "twitter" | "instagram" | "facebook" | "linkedin") => {
    const eventUrl = window.location.href;
    const shareUrl = encodeURIComponent(eventUrl);
    const shareText = encodeURIComponent(
      `Check out this event: ${event.name} on ${event.date}!`
    );

    const platformUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
      instagram: `instagram://story-camera?text=${shareText}&url=${shareUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`
    };

    if (platform === "instagram") {
      window.location.href = platformUrls[platform];
      setTimeout(() => {
        try {
          navigator.clipboard.writeText(
            `${event.name}\n${event.date}\n${window.location.href}`
          );
          alert("Event details copied to clipboard. You can now paste this in Instagram!");
          window.open("https://www.instagram.com", "_blank");
        } catch (err) {
          console.error("Failed to copy to clipboard:", err);
          window.open("https://www.instagram.com", "_blank");
        }
      }, 1000);
    } else {
      window.open(platformUrls[platform], "_blank");
    }

    handleClose();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3
        }}>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 600 }}>
            {event.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handleReportClick}
              disabled={isReported}
              sx={{
                color: isReported ? '#999' : '#666',
                padding: '8px',
                borderRadius: '4px',
                '&:hover': {
                  color: '#ff0000',
                  backgroundColor: 'rgba(255, 0, 0, 0.04)'
                },
                '&.Mui-disabled': {
                  color: '#999'
                }
              }}
            >
              <Flag size={20} />
            </IconButton>
            <IconButton
              onClick={handleShareClick}
              sx={{
                color: isShareModalOpen ? '#ff0000' : '#666',
                padding: '8px',
                borderRadius: '4px',
                '&:hover': {
                  color: '#ff0000',
                  backgroundColor: 'rgba(255, 0, 0, 0.04)'
                }
              }}
            >
              <Share2 size={20} />
              <Typography sx={{ 
                ml: 1, 
                fontSize: '0.875rem',
                color: isShareModalOpen ? '#ff0000' : '#666'
              }}>
                Share
              </Typography>
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            About this event
          </Typography>
          <Typography variant="body1" paragraph>
            {event.description}
          </Typography>
        </Box>
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => shareToSocialMedia("twitter")}>
          <ListItemIcon>
            <Twitter size={20} />
          </ListItemIcon>
          <ListItemText>Share on Twitter</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => shareToSocialMedia("facebook")}>
          <ListItemIcon>
            <Facebook size={20} />
          </ListItemIcon>
          <ListItemText>Share on Facebook</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => shareToSocialMedia("instagram")}>
          <ListItemIcon>
            <Instagram size={20} />
          </ListItemIcon>
          <ListItemText>Share on Instagram</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => shareToSocialMedia("linkedin")}>
          <ListItemIcon>
            <Linkedin size={20} />
          </ListItemIcon>
          <ListItemText>Share on LinkedIn</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
      >
        <DialogTitle>Report Event</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to report this event? This action cannot be undone.
          </Typography>
          {reportError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {reportError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsReportDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleReportConfirm} color="error">
            Report
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default EventDetails;