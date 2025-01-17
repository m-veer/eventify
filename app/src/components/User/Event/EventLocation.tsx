import { Box, Button, Typography } from "@mui/material";
import { Map as MapIcon } from "@mui/icons-material";

interface Event {
  location: string;
}

const EventLocation: React.FC<Event> = ({location}) => {
  const getLocation = (inputLocation: string) => {
    let locationSplit = inputLocation.split(',');
    let locationSlice = locationSplit.slice(1);
    return locationSlice.join(',').trim();
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Location
      </Typography>
      <Typography>
        {location.split(',')[0]}
      </Typography>
      <Typography color="text.secondary">
        {getLocation(location)}
      </Typography>
      <Button variant="text" sx={{ mt: 1 }} startIcon={<MapIcon />}>
        Show map
      </Button>
    </Box>
  );
};

export default EventLocation;