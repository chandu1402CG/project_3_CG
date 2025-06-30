import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import CalculateIcon from "@mui/icons-material/Calculate";
import LockResetIcon from "@mui/icons-material/LockReset";
import { forgotPassword, resetPassword, verifyResetCode } from "../services/api";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mathAnswer, setMathAnswer] = useState("");
  const [mathPuzzle, setMathPuzzle] = useState({ question: "", answer: 0 });
  const [answerError, setAnswerError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Create a random math puzzle
  useEffect(() => {
    generateMathPuzzle();
  }, []);

  const generateMathPuzzle = () => {
    const operations = ["+", "-", "*"];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;

    switch (operation) {
      case "+":
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 + num2;
        break;
      case "-":
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 - num2;
        break;
      case "*":
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 * num2;
        break;
      default:
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 + num2;
    }

    const question = `What is ${num1} ${operation} ${num2}?`;
    setMathPuzzle({ question, answer });
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validateMathAnswer = () => {
    if (!mathAnswer) {
      setAnswerError("Please answer the math puzzle");
      return false;
    }
    if (parseInt(mathAnswer) !== mathPuzzle.answer) {
      setAnswerError("Incorrect answer. Please try again.");
      return false;
    }
    setAnswerError("");
    return true;
  };

  const validatePasswords = () => {
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail()) return;

    setLoading(true);
    try {
      const response = await forgotPassword(email);
      if (response.success) {
        setResetToken(response.resetToken);
        setAlert({
          show: true,
          type: "success",
          message: "A reset code has been sent to your email.",
        });
        setActiveStep(1);
      } else {
        setAlert({
          show: true,
          type: "error",
          message: response.message || "Email not found.",
        });
      }
    } catch (err) {
      console.error("Email submission error:", err);
      setAlert({
        show: true,
        type: "error",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMathSubmit = async () => {
    if (!validateMathAnswer()) return;

    setLoading(true);
    try {
      const response = await verifyResetCode(email, parseInt(mathAnswer), resetToken);
      if (response.success) {
        setAlert({
          show: true,
          type: "success",
          message: "Verification successful.",
        });
        setActiveStep(2);
      } else {
        setAlert({
          show: true,
          type: "error",
          message: response.message || "Verification failed.",
        });
      }
    } catch (err) {
      console.error("Math verification error:", err);
      setAlert({
        show: true,
        type: "error",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!validatePasswords()) return;

    setLoading(true);
    try {
      const response = await resetPassword(email, newPassword, resetToken);
      if (response.success) {
        setAlert({
          show: true,
          type: "success",
          message: "Password has been reset successfully.",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setAlert({
          show: true,
          type: "error",
          message: response.message || "Password reset failed.",
        });
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setAlert({
        show: true,
        type: "error",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Email Verification", "Security Check", "Reset Password"];

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          mb: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <LockResetIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
          <Typography component="h1" variant="h5" gutterBottom>
            Forgot Password
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ width: "100%", mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {alert.show && (
            <Alert
              severity={alert.type}
              sx={{ width: "100%", mb: 2 }}
              onClose={() => setAlert({ ...alert, show: false })}
            >
              {alert.message}
            </Alert>
          )}

          {activeStep === 0 && (
            <Box sx={{ width: "100%" }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Enter your email address to receive a password reset link.
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleEmailSubmit}
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
              </Button>
            </Box>
          )}

          {activeStep === 1 && (
            <Box sx={{ width: "100%" }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Please solve this math puzzle to verify you're human:
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                {mathPuzzle.question}
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="mathAnswer"
                label="Your Answer"
                name="mathAnswer"
                autoFocus
                type="number"
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                error={!!answerError}
                helperText={answerError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalculateIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleMathSubmit}
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : "Verify"}
              </Button>
            </Box>
          )}

          {activeStep === 2 && (
            <Box sx={{ width: "100%" }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Enter your new password:
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="New Password"
                type="password"
                id="password"
                autoFocus
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={!!passwordError}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handlePasswordSubmit}
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : "Reset Password"}
              </Button>
            </Box>
          )}

          <Box sx={{ mt: 2, width: "100%", textAlign: "center" }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Back to Login
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
