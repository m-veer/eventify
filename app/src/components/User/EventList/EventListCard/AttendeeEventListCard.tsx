import React, { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  Typography,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

interface EventCardProps {
  id: string;
  image: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  price: string;
}

const AttendeeEventCard: React.FC<EventCardProps> = ({
  id,
  image,
  title,
  date,
  time,
  venue,
  price,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setIsShareModalOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsShareModalOpen(false);
  };

  const shareToSocialMedia = async (platform: "twitter" | "instagram") => {
    const eventUrl = `${window.location.origin}/events/${id}`;
    const shareUrl = encodeURIComponent(eventUrl);
    const shareText = encodeURIComponent(
      `Check out this event: ${title} on ${date}!`
    );

    if (platform === "instagram") {
      const instagramUrl = `instagram://story-camera?text=${shareText}&url=${shareUrl}`;

      try {
        window.location.href = instagramUrl;

        setTimeout(() => {
          try {
            navigator.clipboard.writeText(`${title}\n${date}\n${eventUrl}`);
            alert(
              "Event details copied to clipboard. You can now paste this in Instagram!"
            );
            window.open("https://www.instagram.com", "_blank");
          } catch (err) {
            console.error("Failed to copy to clipboard:", err);
            window.open("https://www.instagram.com", "_blank");
          }
        }, 1000);
      } catch (error) {
        console.error("Error sharing to Instagram:", error);
      }
    } else {
      const twitterUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
      window.open(twitterUrl, "_blank");
    }

    handleClose();
  };

  return (
    <Card
      sx={{
        display: "flex",
        mb: 2,
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        "&:hover": {
          boxShadow: "0 4px 8px rgba(0,0,0,0.12)",
          cursor: "pointer",
        },
        maxWidth: "800px",
        mx: "auto",
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: "180px",
          height: "120px",
          objectFit: "cover",
          borderRadius: "8px 0 0 8px",
        }}
        image={image}
        alt={title}
      />

      <Box
        sx={{
          display: "flex",
          flex: 1,
          p: 2,
          justifyContent: "space-between",
        }}
      >
        <Stack spacing={0.5}>
          <Typography
            variant="h6"
            sx={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "#1a1a1a",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              fontSize: "0.875rem",
            }}
          >
            {`${date} • ${time}`}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              fontSize: "0.875rem",
            }}
          >
            {venue}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#1a1a1a",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            From {price}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "flex-start",
          }}
        >
          <IconButton
            size="small"
            onClick={handleShareClick}
            sx={{
              color: isShareModalOpen ? "#ff0000" : "#666",
              padding: "4px",
              "&:hover": {
                color: "#ff0000",
                backgroundColor: "rgba(255, 0, 0, 0.04)",
              },
              "&:active": {
                color: "#ff0000",
                backgroundColor: "rgba(255, 0, 0, 0.08)",
              },
            }}
          >
            <ShareIcon fontSize="small" />
          </IconButton>
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
                <TwitterIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Share on Twitter</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => shareToSocialMedia("instagram")}>
              <ListItemIcon>
                <InstagramIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Share on Instagram</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>
      </Box>
    </Card>
  );
};

export default AttendeeEventCard;