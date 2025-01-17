import React from "react";
import { Box } from "@mui/material";
import ticketsBanner from "../../../assets/mobile-tickets.png";

const TicketsBanner: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100vw',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      <Box
        component="img"
        src={ticketsBanner}
        alt="Mobile Tickets"
        sx={{
          width: '100%',
          maxWidth: '1200px',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
      />
    </Box>
  );
};

export default TicketsBanner;