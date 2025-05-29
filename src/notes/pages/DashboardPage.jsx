import { useOutletContext } from "react-router-dom";
import { Grid, Paper, Typography, Box } from "@mui/material";
import NotesIcon from "@mui/icons-material/Note";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

export const DashboardPage = () => {
  const { totalTags, totalCategories, notesTotal } = useOutletContext();

  const stats = [
    {
      label: "Notas",
      value: notesTotal,
      icon: <NotesIcon fontSize="large" color="primary" />,
    },
    {
      label: "Categorías",
      value: totalCategories,
      icon: <CategoryIcon fontSize="large" color="success" />,
    },
    {
      label: "Etiquetas",
      value: totalTags,
      icon: <LocalOfferIcon fontSize="large" color="warning" />,
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
