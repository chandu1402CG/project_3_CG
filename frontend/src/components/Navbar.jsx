import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from '/Logo.png';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
  Divider,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

// Helper function to get user initials
const getUserInitials = (name) => {
  if (!name) return "?";

  const names = name.split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const Navbar = ({ isLoggedIn: propIsLoggedIn }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn || false);
  const [userData, setUserData] = useState(null);

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  // User menu state
  const [anchorElUser, setAnchorElUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setIsLoggedIn(true);
        setUserData(user);
      } catch (err) {
        console.error("Error parsing user data:", err);
        setIsLoggedIn(false);
        localStorage.removeItem("user");
      }
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }

    // Update isLoggedIn when the prop changes
    if (propIsLoggedIn !== undefined) {
      setIsLoggedIn(propIsLoggedIn);
    }
  }, [propIsLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData(null);
    setAnchorElUser(null);
    navigate("/");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Drawer content for mobile menu
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", width: 250 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          my: 2,
          
        }}
      >
        <Avatar
          src={Logo}
          alt="Helping Hands Logo"
          sx={{
            m:2,
            width: 80,
            height: 80,
            mb: 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        />
        <Box>
          <Typography variant="h6" color="primary" fontWeight="bold">
            Helping Hands
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Child Care
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/"
            sx={{ textAlign: "center" }}
          >
            <ListItemIcon sx={{ minWidth: "40px" }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/care-centers"
            sx={{ textAlign: "center" }}
          >
            <ListItemIcon sx={{ minWidth: "40px" }}>
              <LocationOnIcon />
            </ListItemIcon>
            <ListItemText primary="Care Centers" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/services"
            sx={{ textAlign: "center" }}
          >
            <ListItemIcon sx={{ minWidth: "40px" }}>
              <MedicalServicesIcon />
            </ListItemIcon>
            <ListItemText primary="Services" />
          </ListItemButton>
        </ListItem>

        {isLoggedIn ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/schedule"
                sx={{ textAlign: "center" }}
              >
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <CalendarMonthIcon />
                </ListItemIcon>
                <ListItemText primary="Schedule" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/profile"
                sx={{ textAlign: "center" }}
              >
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{ textAlign: "center" }}
              >
                <ListItemIcon sx={{ minWidth: "40px" }}>
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ color: "error.main" }} />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/register"
                sx={{ textAlign: "center" }}
              >
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/login"
                sx={{ textAlign: "center" }}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={2}
      sx={{ bgcolor: "white" }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          {/* Logo - always visible */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              {/* <Avatar
                src={Logo}
                alt="Helping Hands Logo"
                variant="rounded"
                sx={{
                  width: 40,
                  height: 40,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  display: { xs: "none", sm: "flex" }
                }}
              /> */}
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="h6"
                  color="primary"
                  fontWeight="bold"
                  sx={{ lineHeight: 1.2 }}
                >
                  Helping Hands
                </Typography>
                <Typography variant="caption" color="text.primary">
                  Child Care
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Mobile menu icon */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Desktop navigation */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
              sx={{ mx: 1 }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/care-centers"
              sx={{ mx: 1 }}
            >
              Care Centers
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/services"
              sx={{ mx: 1 }}
            >
              Services
            </Button>
            {isLoggedIn && (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/schedule"
                  sx={{ mx: 1 }}
                >
                  Schedule
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/profile"
                  sx={{ mx: 1 }}
                >
                  Profile
                </Button>
              </>
            )}
          </Box>

          {/* Auth buttons or User avatar */}
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            {isLoggedIn ? (
              <Box>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {userData?.avatar ? (
                        <img
                          src={userData.avatar}
                          alt={userData.name || "User"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        getUserInitials(userData?.username)
                      )}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
                    <Typography variant="subtitle1">
                      {userData?.username || "User"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {userData?.email || ""}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {userData?.phone || ""}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem
                    onClick={handleCloseUserMenu}
                    component={RouterLink}
                    to="/profile"
                  >
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="My Profile" />
                  </MenuItem>
                  <MenuItem
                    onClick={handleCloseUserMenu}
                    component={RouterLink}
                    to="/schedule"
                  >
                    <ListItemIcon>
                      <CalendarMonthIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="My Schedule" />
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Logout"
                      sx={{ color: "error.main" }}
                    />
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
                  color="primary"
                  sx={{
                    mr: 2,
                    borderRadius: 1,
                    "&.Mui-disabled": {
                      borderColor: "rgba(0, 0, 0, 0.12)",
                      color: "rgba(0, 0, 0, 0.26)",
                    },
                  }}
                  disabled={isLoggedIn}
                >
                  Register
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 1 }}
                >
                  Login
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
