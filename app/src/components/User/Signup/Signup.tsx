import React, { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import {
  TextField,
  Button,
  Typography,
  Link,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Modal,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { checkValidData } from "../../../utils/validate";
import { setUser } from "../../../store/userSlice";
import API_URLS from "../../../constants/apiUrls";

interface SignupProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  location: string;
  email: string;
  password: string;
  confirmPassword: string;
  isAdmin: boolean;
  isAdminPassword: string;
}

interface Errors {
  firstName?: string;
  lastName?: string;
  location?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  isAdminPassword?: string;
  submit?: string;
}

const Signup: React.FC<SignupProps> = ({ open, onClose, onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    location: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
    isAdminPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      location: "",
      email: "",
      password: "",
      confirmPassword: "",
      isAdmin: false,
      isAdminPassword: "",
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    const validationError = checkValidData(formData.email, formData.password);
    if (validationError) {
      if (validationError.includes("Email")) {
        newErrors.email = validationError;
      }
      if (validationError.includes("Password")) {
        newErrors.password =
          "Password must contain at least 8 characters, including uppercase, lowercase, and numbers";
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.isAdmin && !formData.isAdminPassword.trim()) {
      newErrors.isAdminPassword = "Admin password is required";
    }

    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleClickShowPassword = (field: "password" | "confirmPassword") => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {

        const response = await fetch(API_URLS.USER_SIGNUP, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Login failed");
        }

        const data = await response.json();

        if (onSuccess) onSuccess();
        onClose();
      } catch (error) {
        if (error instanceof Error) {
          setErrors({
            submit: error.message || "Failed to signup. Please try again.",
          });
        } else {
          setErrors({ submit: "Failed to signup. Please try again." });
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="signup-modal"
      aria-describedby="signup-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Sign Up
        </Typography>

        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          )}

          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={!!errors.location}
            helperText={errors.location}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword("password")}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword("confirmPassword")}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <input
              type="checkbox"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
              id="isAdmin"
              style={{ marginRight: '8px' }}
            />
            <label htmlFor="isAdmin">Register as Admin</label>
          </Box>

          {formData.isAdmin && (
            <TextField
              fullWidth
              label="Admin Password"
              name="isAdminPassword"
              type="password"
              value={formData.isAdminPassword}
              onChange={handleChange}
              error={!!errors.isAdminPassword}
              helperText={errors.isAdminPassword}
              margin="normal"
            />
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <Link
              component="button"
              onClick={() => {
                onClose();
                onSwitchToLogin();
              }}
            >
              Login
            </Link>
          </Typography>
        </form>
      </Box>
    </Modal>
  );
};

export default Signup;