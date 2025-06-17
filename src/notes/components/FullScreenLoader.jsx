// src/components/ui/FullScreenLoader.tsx

import { Box, CircularProgress, Typography } from "@mui/material";

export const FullScreenLoader = ({ message = "Cargando..." }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      textAlign="center"
      sx={{
        backgroundColor: "background.default",
        color: "text.primary",
        px: 2,
      }}
    >
      <CircularProgress color="primary" size={60} thickness={5} />
      <Typography variant="h6" sx={{ mt: 3 }}>
        {message}
      </Typography>
    </Box>
  );
};
