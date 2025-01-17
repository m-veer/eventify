import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { Container, Box, Typography, TextField, Button } from "@mui/material";

type ContactFormInputs = {
  name: string;
  email: string;
  message: string;
};

const ContactUsForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>();

  const onSubmit: SubmitHandler<ContactFormInputs> = (data) => {
    const serviceId = "service_6n8j1wx";
    const templateId = "template_xg278aq";
    const userId = "TfFkFj32kv3nXJbFH";

    const templateParams = {
      from_name: data.name,
      email_id: data.email,
      message: data.message
    };
    
    emailjs
      .send(serviceId, templateId, templateParams, userId)
      .then(() => {
        alert("Message sent successfully!");
        reset();
      })
      .catch((error) => {
        console.error("Failed to send message:", error);
        alert("Failed to send the message. Please try again.");
      });
  };

  return (
    <Container maxWidth="lg" sx={{ my: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            color: '#f05123',
            fontStyle: 'italic',
            fontWeight: 'bold',
            mb: 4,
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}
        >
          Contact Us
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 6,
            maxWidth: '800px',
            mx: 'auto',
            px: { xs: 2, md: 0 }
          }}
        >
          Have questions or concerns? We're here to help. Send us a message and we'll respond as soon as possible.
        </Typography>
      </Box>

      <Box 
        component="form" 
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          maxWidth: '600px',
          mx: 'auto',
          p: { xs: 2, md: 4 },
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Name"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={5}
            {...register("message", { required: "Message is required" })}
            error={!!errors.message}
            helperText={errors.message?.message}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            bgcolor: '#f05123',
            py: 1.5,
            fontSize: '1.1rem',
            '&:hover': {
              bgcolor: '#d84315'
            }
          }}
        >
          Send Message
        </Button>
      </Box>
    </Container>
  );
};

export default ContactUsForm;