import { Box, Typography } from "@mui/material";

interface Event {
  date: string;
  name: string;
}

const EventTitle: React.FC<Event> = ({ date, name }) => {
  const convertDate = (inputDate: string) => {
    const date = new Date(inputDate);
    const formatted = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
    return formatted;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="caption" color="text.secondary">
        {/* Sunday, December 1 */}
        {convertDate(date)}
      </Typography>
      <Typography variant="h4" sx={{ mt: 1 }}>
        {/* Boston Japan Film Festival 2024 */}
        {name}
      </Typography>
    </Box>
  );
};

export default EventTitle;
