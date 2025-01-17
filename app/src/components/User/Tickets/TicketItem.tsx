import React from "react";
import { Box, Typography, Grid, Grid2 } from "@mui/material";

interface TicketItemProps {
  date: string;
  month: string;
  title: string;
  time: string;
  orderInfo: string;
  image?: string;
}

const TicketItem: React.FC<TicketItemProps> = ({
  date,
  month,
  title,
  time,
  orderInfo,
  image,
}) => {
  return (
    <Grid
      container
      sx={{
        py: 3,
        borderBottom: "1px solid #e0e0e0",
        "&:hover": {
          backgroundColor: "#fafafa",
        },
      }}
    >
      <Grid item xs={2} sx={{ textAlign: "center" }}>
        <Typography variant="h5" sx={{ color: "#ff0000", fontWeight: 500 }}>
          {date}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "#ff0000" }}>
          {month}
        </Typography>
      </Grid>
      <Grid item xs={10}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "18px",
            fontWeight: 500,
            mb: 1,
          }}
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {time}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {orderInfo}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default TicketItem;
