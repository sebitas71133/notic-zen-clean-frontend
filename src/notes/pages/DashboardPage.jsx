import { useNavigate } from "react-router-dom";
import { Grid, Paper, Typography, Box, useTheme, Tooltip } from "@mui/material";
import NotesIcon from "@mui/icons-material/Note";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ImageIcon from "@mui/icons-material/Image";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CollectionsIcon from "@mui/icons-material/Collections";

import { useGetStatsQuery } from "../../../services/noteApi";

export const DashboardPage = () => {
  const { data: documents, isLoading } = useGetStatsQuery({});
  const navigate = useNavigate();
  const theme = useTheme();

  if (isLoading || !documents?.data) {
    return <div>Cargando stats...</div>;
  }

  const stats = [
    {
      label: "Notes",
      value: documents.data.totalNote,
      icon: <NotesIcon fontSize="large" color="primary" />,
      path: "/app",
    },
    {
      label: "Categories",
      value: documents.data.totalCategory,
      icon: <CategoryIcon fontSize="large" color="success" />,
      path: "/app/category",
    },
    {
      label: "Tags",
      value: documents.data.totalTag,
      icon: <LocalOfferIcon fontSize="large" color="warning" />,
      path: "/app/tags",
    },
    {
      label: "Images",
      value: documents.data.totalImages,
      icon: <ImageIcon fontSize="large" color="info" />,
      path: "", // puedes asignar ruta si tienes
    },
    {
      label: "SubNotes",
      value: documents.data.totalSubNote,
      icon: <NoteAddIcon fontSize="large" color="secondary" />,
      path: "",
    },
    {
      label: "SubImages",
      value: documents.data.totalSubImage,
      icon: <CollectionsIcon fontSize="large" color="action" />,
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
            <Tooltip title={`Ir a ${label}`} arrow disableHoverListener={!path}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: 3,
                  cursor: path ? "pointer" : "default",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": path
                    ? {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[6],
                      }
                    : {},
                }}
                onClick={() => path && navigate(path)}
              >
                <Box mb={1}>{icon}</Box>
                <Typography variant="h6" color="text.primary">
                  {label}
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {value}
                </Typography>
              </Paper>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
