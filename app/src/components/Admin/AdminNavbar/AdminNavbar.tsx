import React, { useRef, useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  styled,
  useTheme,
  useMediaQuery,
  ButtonProps,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { clearUser } from "../../../store/userSlice";
import { Menu as MenuIcon } from "@mui/icons-material";
import logo from "../../../assets/eventify-logo.png";
import "./AdminNavbar.css";

type CustomButtonProps = ButtonProps & {
  to?: string;
  component?: React.ElementType;
};

const StyledAppBar = styled(AppBar)({
  backgroundColor: "white",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  position: "fixed",
  zIndex: 1100,
});

const LogoImage = styled("img")(({ theme }) => ({
  height: "40px",
  cursor: "pointer",
  [theme.breakpoints.down("sm")]: {
    height: "32px",
  },
}));

const NavButton = styled(Button)<CustomButtonProps>({
  color: "#333",
  margin: "0 8px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "rgba(255, 0, 0, 0.04)",
  },
});

const AdminButton = styled(Button)(({ theme }) => ({
  color: "#ff0000",
  textTransform: "none",
  padding: "6px 16px",
  "&:hover": {
    backgroundColor: "rgba(255, 0, 0, 0.04)",
  },
}));

const AdminNavbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userDropdownIsOpen, setUserDropdownIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);
  
  // Get admin email from Redux store
  const adminEmail = useSelector((state: RootState) => state.user.email) || "Admin@gmail.com";

  const handleLogout = async () => {
    try {
      dispatch(clearUser());
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      navigate("/", { replace: true });
      if (isMobile) {
        setMobileMenuOpen(false);
      }
    } catch (error) {
      console.error("Admin logout failed:", error);
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

  const navItems = [
    { text: "User Data", path: "/admin-users" },
    { text: "Event Table", path: "/admin-events" },
    { text: "Reported Events", path: "/admin-reported-events" },
  ];

  return (
    <StyledAppBar position="fixed">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: { xs: 2, sm: 4 },
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        <RouterLink to="/">
          <LogoImage src={logo} alt="Logo" />
        </RouterLink>

        {isMobile ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="primary">
                {adminEmail}
              </Typography>
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{
                  color: "#ff0000",
                  "&:hover": {
                    backgroundColor: "rgba(255, 0, 0, 0.04)",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Drawer
              anchor="right"
              open={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
              PaperProps={{
                sx: { width: 240 },
              }}
            >
              <List sx={{ pt: 2 }}>
                {navItems.map((item) => (
                  <ListItemButton
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                ))}
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    color: "#ff0000",
                    mt: 2,
                    borderTop: "1px solid #eee",
                  }}
                >
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </List>
            </Drawer>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { sm: 2, md: 3 },
              ml: "auto",
            }}
          >
            {navItems.map((item) => (
              <NavButton key={item.path} component={RouterLink} to={item.path}>
                {item.text}
              </NavButton>
            ))}
            <div
              className="dropdown"
              ref={userDropdownRef}
              onMouseEnter={() => setUserDropdownIsOpen(true)}
              onMouseLeave={() => setUserDropdownIsOpen(false)}
            >
              <AdminButton>
                {adminEmail}
              </AdminButton>
              <div
                className={`dropdown-content ${userDropdownIsOpen ? "show" : ""}`}
              >
                <Button
                  fullWidth
                  onClick={handleLogout}
                  sx={{
                    color: "#ff0000",
                    textAlign: "left",
                    padding: "8px 16px",
                    "&:hover": {
                      backgroundColor: "rgba(255, 0, 0, 0.04)",
                    },
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          </Box>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default AdminNavbar;