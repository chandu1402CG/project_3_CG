import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
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
import PaymentIcon from "@mui/icons-material/Payment";

// Helper function to get user initials
const getUserInitials = (name) => {
  if (!name) return "?";

  const names = name.split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const Navbar = ({ isLoggedIn: propIsLoggedIn, setIsLoggedIn: propSetIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn || false);
  const [userData, setUserData] = useState(null);

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  // User menu state
  const [anchorElUser, setAnchorElUser] = useState(null);

  useEffect(() => {
    // Function to check user login status from localStorage
    const checkUserLoginStatus = () => {
      const userString = localStorage.getItem("user");
      if (userString) {
        try {
          const user = JSON.parse(userString);
          setIsLoggedIn(true);
          // Also update the parent component's state if needed
          if (propSetIsLoggedIn && !propIsLoggedIn) {
            propSetIsLoggedIn(true);
          }
          setUserData(user);
        } catch (err) {
          console.error("Error parsing user data:", err);
          setIsLoggedIn(false);
          if (propSetIsLoggedIn) {
            propSetIsLoggedIn(false);
          }
          localStorage.removeItem("user");
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    // Check login status on component mount
    checkUserLoginStatus();

    // Add event listener for login changes
    const handleLoginChange = () => {
      checkUserLoginStatus();
    };

    window.addEventListener('userLoggedIn', handleLoginChange);
    
    // Update isLoggedIn when the prop changes
    if (propIsLoggedIn !== undefined) {
      setIsLoggedIn(propIsLoggedIn);
    }
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('userLoggedIn', handleLoginChange);
    };
  }, [propIsLoggedIn, propSetIsLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    // Also update the parent component's state
    if (propSetIsLoggedIn) {
      propSetIsLoggedIn(false);
    }
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
  
  // Helper function to check if the current route matches the link
  const isActiveRoute = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return path !== '/' && location.pathname.startsWith(path);
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
            sx={{ 
              textAlign: "center",
              bgcolor: isActiveRoute('/') ? 'rgba(63, 81, 181, 0.08)' : 'transparent',
              borderLeft: isActiveRoute('/') ? '4px solid' : '4px solid transparent',
              borderColor: isActiveRoute('/') ? 'primary.main' : 'transparent',
              color: isActiveRoute('/') ? 'primary.main' : 'inherit'
            }}
          >
            <ListItemIcon sx={{ minWidth: "40px", color: isActiveRoute('/') ? 'primary.main' : 'inherit' }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: isActiveRoute('/') ? 'bold' : 'normal' }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/care-centers"
            sx={{ 
              textAlign: "center",
              bgcolor: isActiveRoute('/care-centers') ? 'rgba(63, 81, 181, 0.08)' : 'transparent',
              borderLeft: isActiveRoute('/care-centers') ? '4px solid' : '4px solid transparent',
              borderColor: isActiveRoute('/care-centers') ? 'primary.main' : 'transparent',
              color: isActiveRoute('/care-centers') ? 'primary.main' : 'inherit'
            }}
          >
            <ListItemIcon sx={{ minWidth: "40px", color: isActiveRoute('/care-centers') ? 'primary.main' : 'inherit' }}>
              <LocationOnIcon />
            </ListItemIcon>
            <ListItemText primary="Care Centers" primaryTypographyProps={{ fontWeight: isActiveRoute('/care-centers') ? 'bold' : 'normal' }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/services"
            sx={{ 
              textAlign: "center",
              bgcolor: isActiveRoute('/services') ? 'rgba(63, 81, 181, 0.08)' : 'transparent',
              borderLeft: isActiveRoute('/services') ? '4px solid' : '4px solid transparent',
              borderColor: isActiveRoute('/services') ? 'primary.main' : 'transparent',
              color: isActiveRoute('/services') ? 'primary.main' : 'inherit'
            }}
          >
            <ListItemIcon sx={{ minWidth: "40px", color: isActiveRoute('/services') ? 'primary.main' : 'inherit' }}>
              <MedicalServicesIcon />
            </ListItemIcon>
            <ListItemText primary="Services" primaryTypographyProps={{ fontWeight: isActiveRoute('/services') ? 'bold' : 'normal' }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={RouterLink}
            to="/payment"
            sx={{ 
              textAlign: "center",
              bgcolor: isActiveRoute('/payment') ? 'rgba(63, 81, 181, 0.08)' : 'transparent',
              borderLeft: isActiveRoute('/payment') ? '4px solid' : '4px solid transparent',
              borderColor: isActiveRoute('/payment') ? 'primary.main' : 'transparent',
              color: isActiveRoute('/payment') ? 'primary.main' : 'inherit'
            }}
          >
            <ListItemIcon sx={{ minWidth: "40px", color: isActiveRoute('/payment') ? 'primary.main' : 'inherit' }}>
              <PaymentIcon />
            </ListItemIcon>
            <ListItemText primary="Payment" primaryTypographyProps={{ fontWeight: isActiveRoute('/payment') ? 'bold' : 'normal' }} />
          </ListItemButton>
        </ListItem>

        {isLoggedIn ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/schedule"
                sx={{ 
                  textAlign: "center",
                  bgcolor: isActiveRoute('/schedule') ? 'rgba(63, 81, 181, 0.08)' : 'transparent',
                  borderLeft: isActiveRoute('/schedule') ? '4px solid' : '4px solid transparent',
                  borderColor: isActiveRoute('/schedule') ? 'primary.main' : 'transparent',
                  color: isActiveRoute('/schedule') ? 'primary.main' : 'inherit'
                }}
              >
                <ListItemIcon sx={{ minWidth: "40px", color: isActiveRoute('/schedule') ? 'primary.main' : 'inherit' }}>
                  <CalendarMonthIcon />
                </ListItemIcon>
                <ListItemText primary="Schedule" primaryTypographyProps={{ fontWeight: isActiveRoute('/schedule') ? 'bold' : 'normal' }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/profile"
                sx={{ 
                  textAlign: "center",
                  bgcolor: isActiveRoute('/profile') ? 'rgba(63, 81, 181, 0.08)' : 'transparent',
                  borderLeft: isActiveRoute('/profile') ? '4px solid' : '4px solid transparent',
                  borderColor: isActiveRoute('/profile') ? 'primary.main' : 'transparent',
                  color: isActiveRoute('/profile') ? 'primary.main' : 'inherit'
                }}
              >
                <ListItemIcon sx={{ minWidth: "40px", color: isActiveRoute('/profile') ? 'primary.main' : 'inherit' }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" primaryTypographyProps={{ fontWeight: isActiveRoute('/profile') ? 'bold' : 'normal' }} />
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
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/login"
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{ 
        bgcolor: "white",
        boxShadow: '0 4px 10px -2px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
      }}
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
              color={isActiveRoute('/') ? "primary" : "inherit"}
              component={RouterLink}
              to="/"
              sx={{ 
                mx: 1,
                fontWeight: isActiveRoute('/') ? 'bold' : 'regular',
                position: 'relative',
                '&::after': isActiveRoute('/') ? {
                  content: '""',
                  position: 'absolute',
                  bottom: -1,
                  left: '25%',
                  width: '50%',
                  height: 2,
                  backgroundColor: 'primary.main',
                  borderRadius: 1
                } : {}
              }}
            >
              Home
            </Button>
            <Button
              color={isActiveRoute('/care-centers') ? "primary" : "inherit"}
              component={RouterLink}
              to="/care-centers"
              sx={{ 
                mx: 1,
                fontWeight: isActiveRoute('/care-centers') ? 'bold' : 'regular',
                position: 'relative',
                '&::after': isActiveRoute('/care-centers') ? {
                  content: '""',
                  position: 'absolute',
                  bottom: -1,
                  left: '25%',
                  width: '50%',
                  height: 2,
                  backgroundColor: 'primary.main',
                  borderRadius: 1
                } : {}
              }}
            >
              Care Centers
            </Button>
            <Button
              color={isActiveRoute('/services') ? "primary" : "inherit"}
              component={RouterLink}
              to="/services"
              sx={{ 
                mx: 1,
                fontWeight: isActiveRoute('/services') ? 'bold' : 'regular',
                position: 'relative',
                '&::after': isActiveRoute('/services') ? {
                  content: '""',
                  position: 'absolute',
                  bottom: -1,
                  left: '25%',
                  width: '50%',
                  height: 2,
                  backgroundColor: 'primary.main',
                  borderRadius: 1
                } : {}
              }}
            >
              Services
            </Button>
            <Button
              color={isActiveRoute('/payment') ? "primary" : "inherit"}
              component={RouterLink}
              to="/payment"
              sx={{ 
                mx: 1,
                fontWeight: isActiveRoute('/payment') ? 'bold' : 'regular',
                position: 'relative',
                '&::after': isActiveRoute('/payment') ? {
                  content: '""',
                  position: 'absolute',
                  bottom: -1,
                  left: '25%',
                  width: '50%',
                  height: 2,
                  backgroundColor: 'primary.main',
                  borderRadius: 1
                } : {}
              }}
            >
              Payment
            </Button>
            {isLoggedIn && (
              <>
                <Button
                  color={isActiveRoute('/schedule') ? "primary" : "inherit"}
                  component={RouterLink}
                  to="/schedule"
                  sx={{ 
                    mx: 1,
                    fontWeight: isActiveRoute('/schedule') ? 'bold' : 'regular',
                    position: 'relative',
                    '&::after': isActiveRoute('/schedule') ? {
                      content: '""',
                      position: 'absolute',
                      bottom: -1,
                      left: '25%',
                      width: '50%',
                      height: 2,
                      backgroundColor: 'primary.main',
                      borderRadius: 1
                    } : {}
                  }}
                >
                  Schedule
                </Button>
                <Button
                  color={isActiveRoute('/profile') ? "primary" : "inherit"}
                  component={RouterLink}
                  to="/profile"
                  sx={{ 
                    mx: 1,
                    fontWeight: isActiveRoute('/profile') ? 'bold' : 'regular',
                    position: 'relative',
                    '&::after': isActiveRoute('/profile') ? {
                      content: '""',
                      position: 'absolute',
                      bottom: -1,
                      left: '25%',
                      width: '50%',
                      height: 2,
                      backgroundColor: 'primary.main',
                      borderRadius: 1
                    } : {}
                  }}
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
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: 1,
                  "&.Mui-disabled": {
                    borderColor: "rgba(0, 0, 0, 0.12)",
                    color: "rgba(0, 0, 0, 0.26)",
                  },
                }}
                disabled={isLoggedIn}
              >
                Login
              </Button>
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
