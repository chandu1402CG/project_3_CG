import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Fade,
  useTheme,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";

const FeaturesSection = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <ShieldIcon fontSize="inherit" />,
      title: "Safe & Secure",
      description:
        "State-of-the-art security systems and strict check-in/out procedures",
      color: theme.palette.primary.main,
    },
    {
      icon: <LocalDiningIcon fontSize="inherit" />,
      title: "Nutritious Meals",
      description: "Healthy, balanced meals and snacks prepared fresh daily",
      color: theme.palette.secondary.main,
    },
    {
      icon: <MenuBookIcon fontSize="inherit" />,
      title: "Educational Programs",
      description: "Age-appropriate learning activities and curriculum",
      color: "#FF9800", // orange
    },
    {
      icon: <EmojiEmotionsIcon fontSize="inherit" />,
      title: "Caring Staff",
      description:
        "Experienced, qualified caregivers who love working with children",
      color: "#009688", // teal
    },
    {
      icon: <AccessibilityNewIcon fontSize="inherit" />,
      title: "Physical Activities",
      description:
        "Play spaces designed to promote motor skills and healthy development",
      color: "#9C27B0", // purple
    },
    {
      icon: <LocalLibraryIcon fontSize="inherit" />,
      title: "Early Literacy",
      description: "Programs designed to develop reading and language skills",
      color: "#F44336", // red
    },
  ];

  return (
    <Box
      component="section"
      sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.paper" }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            textAlign: "center",
            mb: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Fade in={true} timeout={1000}>
            <Typography
              variant="overline"
              component="div"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                letterSpacing: 2,
                mb: 1,
              }}
            >
              WHO WE ARE
            </Typography>
          </Fade>

          <Fade in={true} timeout={1500}>
            <Typography
              variant="h3"
              component="h2"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 2,
                mt: 2,
                position: "relative",
                display: "inline-block",
                backgroundImage: "linear-gradient(45deg, #3f51b5, #f50057)",
                backgroundSize: "100%",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 2px 5px rgba(0,0,0,0.1)",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: "80px",
                  height: "4px",
                  bottom: "-15px",
                  left: "calc(50% - 40px)",
                  background: "linear-gradient(45deg, #3f51b5, #f50057)",
                  borderRadius: "2px",
                },
              }}
            >
              Welcome to Helping Hands Child Care
            </Typography>
          </Fade>

          <Fade in={true} timeout={2000}>
            <Typography
              variant="body1"
              align="center"
              paragraph
              sx={{
                mt: 5,
                mb: 6,
                maxWidth: 850,
                mx: "auto",
                fontSize: "1.15rem",
                lineHeight: 1.75,
                color: "text.secondary",
                px: { xs: 2, sm: 4 },
              }}
            >
              At Helping Hands Child Care, we believe every child deserves the
              best start in life. Our centers provide safe, nurturing
              environments where children can learn, play, and grow. With both
              corporate and community care models, we offer flexible options to
              meet the needs of all families.
            </Typography>
          </Fade>
        </Box>

        <Box
          data-id="features-container"
          sx={{
            mt: 8,
            position: "relative",
            width: "100%",
            "&::before": {
              content: '""',
              position: "absolute",
              top: -40,
              left: "50%",
              width: "100px",
              height: "4px",
              bgcolor: "secondary.main",
              transform: "translateX(-50%)",
              borderRadius: "2px",
              display: { xs: "none", md: "block" },
            },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 3,
              width: "100%",
            }}
          >
            {features.map((feature, index) => (
              <Box key={index}>
                <Fade in={true} timeout={1000 + index * 300}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: { xs: 3, md: 4 },
                      height: "100%",
                      textAlign: "center",
                      borderRadius: 3,
                      transition: "all 0.4s ease",
                      position: "relative",
                      overflow: "hidden",
                      border: "1px solid rgba(0,0,0,0.05)",
                      background:
                        "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "4px",
                        bgcolor: feature.color || "primary.main",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      },
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                        "&::after": {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: feature.color || "primary.main",
                        color: "white",
                        width: { xs: 70, md: 85 },
                        height: { xs: 70, md: 85 },
                        fontSize: { xs: "2rem", md: "2.5rem" },
                        mx: "auto",
                        mb: 3,
                        boxShadow: `0 10px 20px ${feature.color}40 || rgba(63, 81, 181, 0.3)`,
                        border: "4px solid rgba(255,255,255,0.9)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.1) rotate(5deg)",
                        },
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      fontWeight={700}
                      sx={{
                        mb: 1.5,
                        color: "text.primary",
                        fontSize: { xs: "1.2rem", md: "1.35rem" },
                        position: "relative",
                        display: "inline-block",
                        pb: 1.5,
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          width: "40px",
                          height: "3px",
                          bottom: 0,
                          left: "calc(50% - 20px)",
                          backgroundColor: feature.color || "secondary.main",
                          borderRadius: "2px",
                        },
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.7,
                        fontSize: { xs: "0.9rem", md: "0.95rem" },
                        maxWidth: "90%",
                        mx: "auto",
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Paper>
                </Fade>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
