import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ImageUpload: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ color: '#f05123', mb: 3, fontWeight: 'bold' }}>
        Upload an Image for the event banner:
      </Typography>
      
      <Box
        sx={{
          border: '2px dashed #e0e0e0',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          bgcolor: '#fafafa',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: '#f5f5f5'
          }
        }}
      >
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          id="image-upload"
          onChange={handleImageUpload}
        />
        <label htmlFor="image-upload">
          <Button
            component="span"
            startIcon={<CloudUploadIcon />}
            variant="contained"
            sx={{
              bgcolor: '#f05123',
              '&:hover': {
                bgcolor: '#d84315'
              }
            }}
          >
            Upload Image
          </Button>
        </label>
        {selectedImage && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Selected file: {selectedImage.name}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ImageUpload;