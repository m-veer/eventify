import { useState } from "react";
import { useDispatch } from "react-redux";
import { 
  TextField, 
  Button, 
  Typography, 
  Link, 
  Box, 
  Alert, 
  IconButton, 
  InputAdornment, 
  Modal,
  CircularProgress 
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { checkValidData } from "../../../utils/validate";
import { setUser } from "../../../store/userSlice";
import API_URLS from "../../../constants/apiUrls";

interface LoginProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  [key: string]: string | undefined;
  email?: string;
  password?: string;
  submit?: string;
}

const Login: React.FC<LoginProps> = ({ open, onClose, onSuccess, onSwitchToSignup }) => {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const validateForm = () => {
    const validationError = checkValidData(formData.email, formData.password);
    if (validationError) {
      return {
        [validationError.includes("Email") ? "email" : "password"]:
          validationError,
      };
    }
    return {};
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await fetch(API_URLS.USER_LOGIN, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Login failed");
        }

        const data = await response.json();

        const userData = {
          isAuthenticated: true,
          role: data.data.user.isAdmin ? 'admin' : 'user',
          token: data.data.token,
          firstName: data.data.user.firstName,
          lastName: data.data.user.lastName,
          email: data.data.user.email,
          isAdmin: data.data.user.isAdmin,
          createdAt: data.data.user.createdAt,
          updatedAt: data.data.user.updatedAt,
          location: data.data.user.location,
          profilePhotoURL: data.data.user.profilePhotoURL
        };

        // Store in Redux
        dispatch(setUser(userData));

        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(userData));

        if (onSuccess) onSuccess();
        onClose();
      } catch (error) {
        if (error instanceof Error) {
          setErrors({
            submit: error.message || "Failed to login. Please try again.",
          });
        } else {
          setErrors({ submit: "Failed to login. Please try again." });
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleClose = () => {
    setErrors({});
    setFormData({ email: "", password: "" });
    onClose();
  };

  return (
    <Modal 
      open={open} 
      onClose={handleClose} 
      aria-labelledby="login-modal"
    >
      <Box sx={{
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
      }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          )}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'red',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'red',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'red',
              },
            }}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'red',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'red',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'red',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "red",
              "&:hover": {
                bgcolor: "#d32f2f"
              },
              borderRadius: 2,
              py: 1.5,
              fontSize: "1.1rem",
              textTransform: 'none'
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>

          <Typography variant="body2" align="center">
            Don't have an account?{" "}
            <Link
              component="button"
              onClick={() => {
                onClose();
                onSwitchToSignup();
              }}
              sx={{ 
                color: "red", 
                textDecoration: "none",
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Sign up
            </Link>
          </Typography>
        </form>
      </Box>
    </Modal>
  );
};

export default Login;