import { Avatar, Box, Typography } from "@mui/material";

interface Event {
  organizerName: string;
  organizerCreatedAt: string;
}

const EventOrganizer: React.FC<Event> = ({organizerName, organizerCreatedAt}) => {
  const getAcronym = (input: string): string => {
    return input
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('');
  };

  const convertDate = (inputDate: string) => {
    const date = new Date(inputDate);
    const formatted = date.toLocaleDateString('en-us', { 
        month: "short",
        day: "numeric", 
        year: "numeric"
    });
    const result = `Eventify account since ${formatted}`;
    return result;
  }

  return (
    <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
      <Avatar>
        {getAcronym(organizerName)}
      </Avatar>
      <Box>
        <Typography>By {organizerName}</Typography>
        <Typography variant="caption" color="text.secondary">
          {convertDate(organizerCreatedAt)}
        </Typography>
      </Box>
    </Box>
  );
};

export default EventOrganizer;