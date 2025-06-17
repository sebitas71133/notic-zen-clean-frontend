import { CircularProgress, Typography, Box } from "@mui/material";

export const CheckingAuth = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        backgroundColor: "primary.main",
        padding: 4,
        color: "white",
        textAlign: "center",
      }}
    >
      <CircularProgress color="warning" size={60} thickness={5} />
      <Typography variant="h6" sx={{ mt: 3 }}>
        Verificando autenticación...
      </Typography>
    </Box>
  );
};
