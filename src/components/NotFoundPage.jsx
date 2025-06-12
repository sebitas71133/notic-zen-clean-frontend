import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Ups... Algo salió mal
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        La página que buscas no existe o Acceso denegado.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/app"
        sx={{ width: "fit-content" }}
      >
        Volver al inicio
      </Button>
    </Box>
  );
};

export default NotFoundPage;
