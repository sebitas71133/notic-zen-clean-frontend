import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from "@mui/icons-material";
import { useAuthStore } from "../../hooks/useAuthStore";
import { AnimatePresence, motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";

export const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { startLogin, startRegister, isLoading } = useAuthStore();
  const { darkMode, setDarkMode } = useOutletContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleTabChange = (_, newValue) => {
    setIsLogin(newValue === 0);
    reset();
  };

  const onSubmitLogin = async (Info) => {
    await startLogin({
      email: Info.emailLogin,
      password: Info.passwordLogin,
    });
  };

  const onSubmitRegister = (data) => {
    startRegister({
      name: data.nameRegister,
      email: data.emailRegister,
      password1: data.passwordRegister1,
      password2: data.passwordRegister2,
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: darkMode ? "#121212" : "#f0f2f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        transition: "background-color 0.3s",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 4,
          borderRadius: 4,
          textAlign: "center",
          position: "relative",
          backgroundColor: darkMode ? "#1e1e1e" : "#fff",
          transition: "background-color 0.3s",
        }}
      >
        {/* Botón de tema oscuro */}
        <IconButton
          onClick={setDarkMode}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        <Avatar sx={{ bgcolor: "#1976d2", mx: "auto", mb: 1 }}>
          <LockIcon />
        </Avatar>

        <Typography variant="h5" mb={2}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </Typography>

        <Tabs
          value={isLogin ? 0 : 1}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {/* TRANSICIÓN CON ANIMATEPRESENCE */}
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.form
              key="login"
              onSubmit={handleSubmit(onSubmitLogin)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!errors.emailLogin}
                helperText={errors.emailLogin?.message}
                {...register("emailLogin", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!errors.passwordLogin}
                helperText={errors.passwordLogin?.message}
                {...register("passwordLogin", {
                  required: "Password is required",
                  minLength: {
                    value: 4,
                    message: "Minimum 4 characters",
                  },
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ mt: 2 }}
              >
                Sign In
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              onSubmit={handleSubmit(onSubmitRegister)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!errors.nameRegister}
                helperText={errors.nameRegister?.message}
                {...register("nameRegister", {
                  required: "Name is required",
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Email"
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!errors.emailRegister}
                helperText={errors.emailRegister?.message}
                {...register("emailRegister", {
                  required: "Email is required",
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!errors.passwordRegister1}
                helperText={errors.passwordRegister1?.message}
                {...register("passwordRegister1", {
                  required: "Password is required",
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!errors.passwordRegister2}
                helperText={errors.passwordRegister2?.message}
                {...register("passwordRegister2", {
                  required: "Please confirm password",
                })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ mt: 2 }}
              >
                Register
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </Paper>
    </Box>
  );
};
