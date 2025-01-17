import React, { useState, useEffect } from 'react';
import DeleteAccountModal from "../../components/User/DeleteAccountModal/DeleteAccountModal"
import './AccountSettings.css';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { clearUser } from "../../store/userSlice";
import API_URLS from "../../constants/apiUrls";
import { useNavigate } from "react-router-dom";

interface FormData {
  firstName: string,
  lastName: string,
  email: string,
  location: string
}

interface User {
  firstName: string;
  lastName: string;
  createdAt: string;
  location: string;
  profilePhotoURL: string;
  updatedAt: string;
  email: string;
  token: string;
}

interface FormErrors {
  firstName: string[];
  lastName: string[];
  location: string[];
}

const AccountInfo: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user as User);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    location: user.location
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({
    firstName: [],
    lastName: [],
    location: []
  });

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(API_URLS.USER_DELETE_USER, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "User delete failed");
      }

      const data = await response.json();

      // Clear user data from Redux store
      dispatch(clearUser());

      // Clear all auth-related data from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      navigate('/', { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Validate the field
    if (['firstName', 'lastName', 'location'].includes(name)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: validateField(value, name)
      }));
    }
  };

  const hasErrors = (): boolean => {
    return Object.values(errors).some(fieldErrors => fieldErrors.length > 0);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(API_URLS.USER_UPDATE_USER, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleUpdateClick = () => {
    if (isEditing) {
      // Validate before submitting
      validateAllFields();
      if (!hasErrors()) {
        handleSubmit();
      }
    }
    setIsEditing(!isEditing);
  };

  const convertDate = (inputDate: string) => {
    const date = new Date(inputDate);
    const formatted = date.toLocaleDateString('en-us', { 
        month: "short",
        day: "numeric", 
        year: "numeric"
    });
    const result = `Eventify account since ${formatted}`;
    return result;
  }

  const validateField = (value: string, fieldName: string): string[] => {
    const errors = [];
    if (!value.trim()) {
      errors.push(`${fieldName} is required.`);
    } else if (value.length < 2) {
      errors.push(`${fieldName} must be at least 2 characters long.`);
    } else if (!/^[a-zA-Z\s]+$/.test(value) && fieldName !== "location") {
      errors.push(`${fieldName} must contain only letters.`);
    }
    return errors;
  };

  // Validate all fields
  const validateAllFields = () => {
    const newErrors = {
      firstName: validateField(formData.firstName ?? "", 'First Name'),
      lastName: validateField(formData.lastName ?? "", 'Last Name'),
      location: validateField(formData.location ?? "", 'Location')
    };
    setErrors(newErrors);
  };

  // Use useEffect to validate fields when editing mode changes
  useEffect(() => {
    if (isEditing) {
      validateAllFields();
    } else {
      setErrors({
        firstName: [],
        lastName: [],
        location: []
      });
    }
  }, [isEditing, formData.firstName, formData.lastName, formData.location]);

  return (
    <div className="account-info-container">
      <div className="header-info">
        <h1>Account Information</h1>
        {/* <span className="account-date">Eventify account since Sep 2, 2024</span> */}
        <span className="account-date">{convertDate(user.createdAt)}</span>
      </div>
      
      <section className="profile-photo-section">
        <h2>Profile Photo</h2>
        <div 
          className="profile-upload-area"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDragDrop}
        >
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-preview" />
          ) : (
            <div className="upload-placeholder">
              <span className="icon">👤</span>
              <p>Add A Profile Image</p>
              <small>Drag and drop or choose a file to upload</small>
            </div>
          )}
          {/* // For file input in profile photo section */}
          <input 
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={!isEditing}
            className="file-input"
            aria-label="Upload profile photo"
            title="Choose a profile photo"
            id="profile-photo-upload"
          />
        </div>
      </section>

      <section className="contact-info-section">
        <h2>Contact Information</h2>
        <div className="form-grid">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                aria-label="First name input"
                placeholder="Enter your first name"
              />
              {errors.firstName.map((error, index) => (
                <span key={index} className="error-message">{error}</span>
              ))}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                aria-label="Last name input"
                placeholder="Enter your last name"
              />
              {errors.lastName.map((error, index) => (
                <span key={index} className="error-message">{error}</span>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                aria-label="Email input"
                placeholder="Enter your email"
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                aria-label="Location input"
                placeholder="Enter your location"
              />
              {errors.location.map((error, index) => (
                <span key={index} className="error-message">{error}</span>
              ))}
            </div>
          </div>

          <div className="button-group">
            <button 
              onClick={handleUpdateClick}
              className="update-button"
              disabled={isEditing && hasErrors()}
            >
              {isEditing ? 'Submit' : 'Update'}
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="delete-account-button"
            >
              Delete Account
            </button>

            <DeleteAccountModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={handleDeleteAccount}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccountInfo;