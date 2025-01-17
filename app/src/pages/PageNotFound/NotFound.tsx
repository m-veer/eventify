import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <Box 
      sx={{ 
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 400px)",
        py: 8,
        px: 2,
        textAlign: "center"
      }}
    >
      <Box 
        sx={{
          width: 80,
          height: 80,
          border: "2px solid #FFD700",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
          color: "#FFD700",
          mb: 4
        }}
      >
        !
      </Box>

      <Typography 
        variant="h1" 
        sx={{ 
          fontSize: { xs: "28px", sm: "36px", md: "48px" },
          fontWeight: 700,
          color: "#1F1B3D",
          maxWidth: 800,
          mb: 2,
          lineHeight: 1.2
        }}
      >
        Whoops, the page or event you are looking for was not found.
      </Typography>

      <Typography 
        sx={{ 
          color: "text.secondary",
          mb: 4
        }}
      >
        If you feel this message is in error, please{" "}
        <Link 
          to="/contact-us" 
          style={{ 
            color: "#4169E1", 
            textDecoration: "none" 
          }}
        >
          let us know
        </Link>
        .
      </Typography>

      <Box 
        sx={{ 
          display: "flex", 
          gap: 2,
          flexDirection: { xs: "column", sm: "row" }
        }}
      >
        <Button
          component={Link}
          to="/create-event"
          variant="contained"
          sx={{
            bgcolor: "#D83C0D",
            color: "white",
            px: 4,
            py: 1.5,
            borderRadius: 1,
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 500,
            "&:hover": {
              bgcolor: "#C23509"
            },
            minWidth: { xs: "100%", sm: "200px" }
          }}
        >
          Create An Event
        </Button>
        <Button
          component={Link}
          to="/browseEvents"
          variant="outlined"
          sx={{
            color: "#333",
            borderColor: "#ccc",
            px: 4,
            py: 1.5,
            borderRadius: 1,
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 500,
            "&:hover": {
              borderColor: "#999",
              bgcolor: "transparent"
            },
            minWidth: { xs: "100%", sm: "200px" }
          }}
        >
          Find An Event
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;