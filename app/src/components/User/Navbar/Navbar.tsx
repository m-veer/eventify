import React, { useState, useRef, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  InputBase,
  Button,
  Box,
  styled,
  IconButton,
  Drawer,
  List,
  ListItemText,
  useTheme,
  useMediaQuery,
  ListItemButton,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import { clearUser } from "../../../store/userSlice";
import logo from "../../../assets/eventify-logo.png";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import "./Navbar.css";
import API_URLS from "../../../constants/apiUrls";
import EventForm from "../../../pages/Events/EventForm//EventForm"

const LogoBehavior = React.forwardRef<HTMLAnchorElement, any>((props, ref) => (
  <RouterLink to="/" ref={ref} {...props} />
));

const LinkBehaviorBrowseEvents = React.forwardRef<HTMLAnchorElement, any>(
  (props, ref) => <RouterLink to="/browseEvents" ref={ref} {...props} />
);

const LinkBehaviorHelp = React.forwardRef<HTMLAnchorElement, any>(
  (props, ref) => <RouterLink to="/contact-us" ref={ref} {...props} />
);

const LinkBehaviorMyTickets = React.forwardRef<HTMLAnchorElement, any>(
  (props, ref) => <RouterLink to="/myTickets" ref={ref} {...props} />
);

const LinkBehaviorMyEvents = React.forwardRef<HTMLAnchorElement, any>(
  (props, ref) => <RouterLink to="/myEvents" ref={ref} {...props} />
);

// const LinkBehaviorCreateEvent = React.forwardRef<HTMLAnchorElement, any>(
//   (props, ref) => <RouterLink to="/create-event" ref={ref} {...props} />
// );
const LinkBehaviorEvent = React.forwardRef<HTMLAnchorElement, any>(
  (props, ref) => {
    const { mode = 'create', eventId, ...otherProps } = props;
    const path = mode === 'create' ? '/create-event' : `/update-event/${eventId}`;
    return <RouterLink to={path} ref={ref} {...otherProps} />;
  }
);

const LinkBehaviorAccountSettings = React.forwardRef<HTMLAnchorElement, any>(
  (props, ref) => <RouterLink to="/accountSettings" ref={ref} {...props} />
);

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "white",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
}));

const LogoImage = styled("img")(({ theme }) => ({
  height: "40px",
  marginRight: "20px",
  cursor: "pointer",
  [theme.breakpoints.down("sm")]: {
    height: "32px",
    marginRight: "10px",
  },
}));

const SearchBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#f5f5f5",
  borderRadius: "20px",
  padding: "4px 16px",
  flex: 1,
  maxWidth: "600px",
  margin: "0 20px",
  [theme.breakpoints.down("md")]: {
    maxWidth: "400px",
    margin: "0 10px",
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const MobileSearchBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#f5f5f5",
  borderRadius: "20px",
  padding: "4px 16px",
  width: "100%",
  margin: "8px 0",
}));

const StyledInputBase = styled(InputBase)({
  width: "100%",
  "& .MuiInputBase-input": {
    padding: "8px 8px 8px 0",
    "&::placeholder": {
      color: "#666",
      opacity: 1,
    },
  },
});

const NavButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  [theme.breakpoints.down("md")]: {
    gap: "8px",
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const StyledButton = styled(Button)<{ component?: React.ElementType }>(
  ({ theme }) => ({
    textTransform: "none",
    fontWeight: 500,
    padding: "6px 16px",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "rgba(255, 0, 0, 0.04)",
    },
    [theme.breakpoints.down("md")]: {
      padding: "4px 12px",
      fontSize: "0.875rem",
    },
  })
);

const LoginButton = styled(StyledButton)({
  color: "#ff0000",
  borderColor: "#ff0000",
  "&:hover": {
    borderColor: "#ff0000",
    backgroundColor: "rgba(255, 0, 0, 0.04)",
  },
});

const SignUpButton = styled(StyledButton)({
  backgroundColor: "#ff0000",
  color: "white",
  "&:hover": {
    backgroundColor: "#e60000",
  },
});

const UserButton = styled(StyledButton)({
  color: "#ff0000",
  "&:hover": {
    backgroundColor: "rgba(255, 0, 0, 0.04)",
  },
});

const DrawerContent = styled(Box)(({ theme }) => ({
  width: 280,
  padding: theme.spacing(2),
  "& .MuiListItemButton-root": {
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
    color: "#333",
    padding: "6px 16px",
    "&:hover": {
      backgroundColor: "rgba(255, 0, 0, 0.04)",
    },
  },
}));

interface User {
  firstName: string;
  lastName: string;
  createdAt: string;
  location: string;
  profilePhotoURL: string;
  updatedAt: string;
  email: string;
  token: string;
  isAuthenticated: boolean;
}

interface EventData {
  name: string;
  eventTypes: string[];
  description: string;
  date: Date;
  time: string;
  locationType: 'virtual' | 'in-person';
  location: string;
  organizer: string;
  isReported: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  reportedAt?: Date;
  price: number;
  totalTickets: number;
  availableTickets: number;
  tags: string[];
  imageUrl: string;
  ageRestriction: string;
  doorTime: string;
  parkingInfo: string;
  eventPhotoURL: string;
}

interface EventSubmissionData {
  name: string;
  eventTypes: string[];
  description: string;
  date: string;
  time: string;
  locationType: string;
  location: string;
  price: number;
  totalTickets: number;
  availableTickets: number;
  tags: string[];
  imageUrl: string;
  ageRestriction: string;
  doorTime: string;
  parkingInfo: string;
}

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const user = useSelector((state: RootState) => state.user as User);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const [userDropdownIsOpen, setUserDropdownIsOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const handleEventModalOpen = () => setEventModalOpen(true);
  const handleEventModalClose = () => setEventModalOpen(false);

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
      if (isMobile) {
        setMobileSearchOpen(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(clearUser());
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleButtonClick = () => {
    if (userDropdownIsOpen) {
      setUserDropdownIsOpen(false);
    }
  };

  const onSubmit = async (data: EventSubmissionData) => {
    try {
      const response = await fetch(API_URLS.USER_CREATE_EVENT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(data)
      });
      if (response.status === 201) {
        handleEventModalClose();
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box
            component={LogoBehavior}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <LogoImage src={logo} alt="Eventify" />
          </Box>
          {!mobileSearchOpen && (
            <>
              <SearchBox>
                <StyledInputBase
                  placeholder="Search events"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  inputProps={{ "aria-label": "search" }}
                />
                <SearchIcon
                  sx={{ color: "#ff0000", cursor: "pointer" }}
                  onClick={handleSearch}
                />
              </SearchBox>
              <NavButtons>
                <StyledButton component={LinkBehaviorBrowseEvents}>
                  Browse Events
                </StyledButton>
                <StyledButton component={LinkBehaviorHelp}>
                  Help
                </StyledButton>                {user.isAuthenticated ? (
                  <div
                    className="dropdown"
                    ref={userDropdownRef}
                    onMouseEnter={() => setUserDropdownIsOpen(true)}
                    onMouseLeave={() => setUserDropdownIsOpen(false)}
                  >
                    <UserButton className="dropbtn">
                      {`${user.firstName} ${user.lastName}`}
                    </UserButton>
                    <div
                      className={`dropdown-content ${
                        userDropdownIsOpen ? "show" : ""
                      }`}
                    >
                      <StyledButton
                        onClick={handleButtonClick}
                        component={LinkBehaviorMyTickets}
                      >
                        My Tickets
                      </StyledButton>
                      <StyledButton
                        onClick={handleButtonClick}
                        component={LinkBehaviorMyEvents}
                      >
                        My Events
                      </StyledButton>
                      <StyledButton 
                        onClick={handleEventModalOpen}
                        sx={{ 
                          color: '#ff0000',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.04)'
                          }
                        }}
                      >
                        Create Event
                      </StyledButton>
                      <StyledButton
                        onClick={handleButtonClick}
                        component={LinkBehaviorAccountSettings}
                      >
                        Account Settings
                      </StyledButton>
                      <StyledButton onClick={handleLogout}>Logout</StyledButton>
                    </div>
                  </div>
                ) : (
                  <>
                    <LoginButton
                      variant="outlined"
                      onClick={() => setLoginOpen(true)}
                    >
                      Log In
                    </LoginButton>
                    <SignUpButton
                      variant="contained"
                      onClick={() => setSignupOpen(true)}
                    >
                      Sign Up
                    </SignUpButton>
                  </>
                )}
              </NavButtons>
            </>
          )}
          {isMobile && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              >
                <SearchIcon />
              </IconButton>
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
        {isMobile && mobileSearchOpen && (
          <Box sx={{ p: 2 }}>
            <MobileSearchBox>
              <StyledInputBase
                placeholder="Search events"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                inputProps={{ "aria-label": "search" }}
                autoFocus
              />
              <IconButton
                size="small"
                onClick={() => setMobileSearchOpen(false)}
              >
                <CloseIcon />
              </IconButton>
            </MobileSearchBox>
          </Box>
        )}
      </StyledAppBar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 280 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            {user.isAuthenticated && (
              <Typography
                variant="h6"
                sx={{
                  color: "#ff0000",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                {`${user.firstName} ${user.lastName}`}
              </Typography>
            )}
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ p: 2 }}>
            <ListItemButton
              component={LinkBehaviorBrowseEvents}
              onClick={() => setDrawerOpen(false)}
              sx={{ mb: 1 }}
            >
              <ListItemText
                primary="Browse Events"
                primaryTypographyProps={{
                  fontSize: "16px",
                  fontWeight: 400,
                }}
              />
            </ListItemButton>

            {user.isAuthenticated && (
              <>
                <ListItemButton
                  component={LinkBehaviorMyTickets}
                  onClick={() => setDrawerOpen(false)}
                  sx={{ mb: 1 }}
                >
                  <ListItemText
                    primary="My Tickets"
                    primaryTypographyProps={{
                      fontSize: "16px",
                      fontWeight: 400,
                    }}
                  />
                </ListItemButton>

                <ListItemButton
                  component={LinkBehaviorMyEvents}
                  onClick={() => setDrawerOpen(false)}
                  sx={{ mb: 1 }}
                >
                  <ListItemText
                    primary="My Events"
                    primaryTypographyProps={{
                      fontSize: "16px",
                      fontWeight: 400,
                    }}
                  />
                </ListItemButton>

                <ListItemButton
                  component={LinkBehaviorEvent}
                  onClick={() => setDrawerOpen(false)}
                  sx={{ mb: 1 }}
                >
                  <ListItemText
                    primary="Create Event"
                    primaryTypographyProps={{
                      fontSize: "16px",
                      fontWeight: 400,
                    }}
                  />
                </ListItemButton>

                <ListItemButton
                  component={LinkBehaviorAccountSettings}
                  onClick={() => setDrawerOpen(false)}
                  sx={{ mb: 1 }}
                >
                  <ListItemText
                    primary="Account Settings"
                    primaryTypographyProps={{
                      fontSize: "16px",
                      fontWeight: 400,
                    }}
                  />
                </ListItemButton>
              </>
            )}

            <ListItemButton onClick={() => setDrawerOpen(false)} sx={{ mb: 1 }}>
              <ListItemText
                primary="Help"
                primaryTypographyProps={{
                  fontSize: "16px",
                  fontWeight: 400,
                }}
              />
            </ListItemButton>

            {user.isAuthenticated ? (
              <ListItemButton
                onClick={() => {
                  handleLogout();
                  setDrawerOpen(false);
                }}
                sx={{ mb: 1 }}
              >
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    fontSize: "16px",
                    fontWeight: 400,
                  }}
                />
              </ListItemButton>
            ) : (
              <>
                <ListItemButton
                  onClick={() => {
                    setDrawerOpen(false);
                    setLoginOpen(true);
                  }}
                  sx={{ mb: 1 }}
                >
                  <ListItemText
                    primary="Log In"
                    primaryTypographyProps={{
                      fontSize: "16px",
                      fontWeight: 400,
                    }}
                  />
                </ListItemButton>
                <ListItemButton
                  onClick={() => {
                    setDrawerOpen(false);
                    setSignupOpen(true);
                  }}
                  sx={{
                    mb: 1,
                    bgcolor: "#ff0000",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#e60000",
                    },
                  }}
                >
                  <ListItemText
                    primary="Sign Up"
                    primaryTypographyProps={{
                      fontSize: "16px",
                      fontWeight: 400,
                    }}
                  />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>
      <Login
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => {
          setLoginOpen(false);
          navigate("/");
        }}
        onSwitchToSignup={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
      />
      <Signup
        open={signupOpen}
        onClose={() => setSignupOpen(false)}
        onSuccess={() => {
          setSignupOpen(false);
          navigate("/");
        }}
        onSwitchToLogin={() => {
          setSignupOpen(false);
          setLoginOpen(true);
        }}
      />
      <EventForm
        open={eventModalOpen}
        onClose={handleEventModalClose}
        mode="create"
        onSubmit={onSubmit}
      />
    </>
  );
};

export default Navbar;