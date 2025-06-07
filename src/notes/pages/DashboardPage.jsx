import { useNavigate, useOutletContext } from "react-router-dom";
import { Grid, Paper, Typography, Box } from "@mui/material";
import NotesIcon from "@mui/icons-material/Note";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

export const DashboardPage = () => {
  const { totalTags, totalCategories, notesTotal, imagesTotal } =
    useOutletContext();

  const navigate = useNavigate();
  // onClick={() => navigate("/app/tools")}
  const stats = [
    {
      label: "Notes",
      value: notesTotal,
      icon: <NotesIcon fontSize="large" color="primary" />,
      path: "/app",
    },
    {
      label: "Categories",
      value: totalCategories,
      icon: <CategoryIcon fontSize="large" color="success" />,
      path: "/app/category",
    },
    {
      label: "Tags",
      value: totalTags,
      icon: <LocalOfferIcon fontSize="large" color="warning" />,
      path: "/app/tags",
    },
    {
      label: "Images",
      value: imagesTotal,
      icon: <LocalOfferIcon fontSize="large" color="info" />,
      path: "",
    },
  ];

  return (
    <Box p={0}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontSize: {
              xs: "1.3rem",
              sm: "1.5rem",
              md: "1.7rem",
            },
            fontWeight: 600,
          }}
        >
          📊 Dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map(({ label, value, icon, path }) => (
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
              onClick={() => navigate(path)}
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
