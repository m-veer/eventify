// components/About/DevelopedBy.tsx
import React from 'react';
import { Box, Container, Typography, Avatar, Grid, IconButton, Link } from '@mui/material';
import { LinkedIn, Instagram } from '@mui/icons-material';
import adityaImage from "../../assets/DeveloperImages/aditya-image.jpg"
import mayurImage from "../../assets/DeveloperImages/mayur-image.jpg"
import rushabhImage from "../../assets/DeveloperImages/rushabh-image.jpg"
import yashImage from "../../assets/DeveloperImages/yash-image.jpg"

interface TeamMember {
  name: string;
  email: string;
  image: string;
  linkedinUrl: string;
  instagramUrl: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Aditya Raj',
    email: 'raj.aditya@northeastern.edu',
    image: adityaImage,
    linkedinUrl: 'https://www.linkedin.com/in/aditya-raj-sde/',
    instagramUrl: 'https://www.instagram.com/aditya_raj_117/'
  },
  {
    name: 'Mayur Raj',
    email: 'veer.m@northeastern.edu',
    image: mayurImage,
    linkedinUrl: 'https://www.linkedin.com/in/mayur-veer/',
    instagramUrl: 'https://www.instagram.com/manya.veer/'
  },
  {
    name: 'Rushabh Darji',
    email: 'darji.rushabh@northeastern.edu',
    image: rushabhImage,
    linkedinUrl: 'https://www.linkedin.com/in/rushabh-darji-58557b1aa/',
    instagramUrl: 'https://www.instagram.com/rushabh.darji/'
  },
  {
    name: 'Yash Vyas',
    email: 'vyas.yash@northeastern.edu',
    image: yashImage,
    linkedinUrl: 'https://www.linkedin.com/in/vyas-yash/',
    instagramUrl: 'https://www.instagram.com/yashyashvyas/'
  }
];

const DevelopedBy: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ my: 8 }}>
      <Typography 
        variant="h3" 
        align="center" 
        sx={{ 
          mb: 6,
          color: '#f05123',
          fontStyle: 'italic',
          fontWeight: 'bold'
        }}
      >
        This Website is developed by
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {teamMembers.map((member) => (
          <Grid item xs={12} sm={6} md={3} key={member.name}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Avatar
                src={member.image}
                sx={{
                  width: 200,
                  height: 200,
                  bgcolor: '#ff5722',
                  mb: 2,
                  border: '4px solid #ff5722'
                }}
              />
              <Typography variant="h5" sx={{ mb: 1 }}>
                {member.name}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 2 }}
              >
                {member.email}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  component={Link}
                  href={member.linkedinUrl}
                  target="_blank"
                  sx={{ color: '#0077b5' }}
                >
                  <LinkedIn />
                </IconButton>
                <IconButton
                  component={Link}
                  href={member.instagramUrl}
                  target="_blank"
                  sx={{ color: '#e4405f' }}
                >
                  <Instagram />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DevelopedBy;