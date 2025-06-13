import { useOutletContext } from "react-router-dom";
import { Grid, Paper, Typography, Box } from "@mui/material";
import NotesIcon from "@mui/icons-material/Note";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import ImageIcon from "@mui/icons-material/Image";
import CollectionsIcon from "@mui/icons-material/Collections";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

import { useGetTotalDocumentsQuery } from "../../../services/authApi";
export const AdminDashboard = () => {
  const { data, isLoading, isError } = useGetTotalDocumentsQuery();

  if (isLoading || !data) {
    return <div>Cargando documents</div>;
  }

  const stats = [
    {
      label: "Usuarios",
      value: data.data.totalUser,
      icon: <PersonIcon fontSize="large" color="error" />,
    },
    {
      label: "Notas",
      value: data.data.totalNote,
      icon: <NotesIcon fontSize="large" color="primary" />,
    },
    {
      label: "Categorías",
      value: data.data.totalCategory,
      icon: <CategoryIcon fontSize="large" color="success" />,
    },
    {
      label: "Etiquetas",
      value: data.data.totalTag,
      icon: <LocalOfferIcon fontSize="large" color="warning" />,
    },

    {
      label: "Imagenes",
      value: data.data.totalImages,
      icon: <ImageIcon fontSize="large" color="info" />,
    },
    {
      label: "SubNotes",
      value: data.data.totalSubNotes,
      icon: <NoteAddIcon fontSize="large" color="primary" />,
    },
    {
      label: "SubImages",
      value: data.data.totalSubImages,
      icon: <CollectionsIcon fontSize="large" color="action" />,
    },
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        📊 Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map(({ label, value, icon }) => (
          <Grid item xs={12} sm={6} md={4} key={label}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                borderRadius: 3,
              }}
            >
              <Box mb={1}>{icon}</Box>
              <Typography variant="h6" color="text.primary">
                {label}
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
