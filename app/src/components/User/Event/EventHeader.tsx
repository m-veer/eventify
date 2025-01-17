import { Box, IconButton } from "@mui/material";
import { Favorite, FavoriteBorder, Share } from "@mui/icons-material";
import event3 from "../../../assets/event3.webp";

// Then in your component:
<Box
  sx={{
    position: "absolute",
    top: "16px",
    right: "16px",
    display: "flex",
    gap: 1,
  }}
>
  <IconButton sx={{ color: "white" }}>
    <Favorite />
  </IconButton>
  <IconButton sx={{ color: "white" }}>
    <Share />
  </IconButton>
</Box>;

const EventHeader: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "400px",
        position: "relative",
        backgroundImage: event3,
        // backgroundImage: 'url("/event3.webp")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "8px 8px 0 0",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "16px",
          right: "16px",
          display: "flex",
          gap: 1,
        }}
      >
        <IconButton sx={{ color: "white" }}>
          <FavoriteBorder />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <Share />
        </IconButton>
      </Box>
    </Box>
  );
};

export default EventHeader;