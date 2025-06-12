import { Box, Typography, Grid, Button, Paper } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import CodeIcon from "@mui/icons-material/Code";
import { useGetNotesQuery } from "../../../services/noteApi";
import {
  exportJSON,
  exportNotesAsZip,
  exportNotesToExcel,
  exportNotesToPDF,
} from "../../utils/exportNotes";
import {
  useGetAllSubNotesQuery,
  useGetSubNotesQuery,
} from "../../../services/subNoteApi";

export const ToolsPage = () => {
  const {
    data: notesData = [],
    isLoading: isNotesLoading,
    isError: isNotesError,
  } = useGetNotesQuery({ page: 1, limit: 500 });

  const {
    data: subNotesData = [],
    isLoading: isSubNotesLoading,
    isError: isSubNotesError,
  } = useGetAllSubNotesQuery();

  if (isNotesLoading || !notesData.data) {
    return <div>Cargando notas...</div>;
  }

  if (isSubNotesLoading || !subNotesData.data) {
    return <div>Cargando sub notas...</div>;
  }

  const notes = notesData.data;
  const subnotes = subNotesData.data;

  const handleExport = (type) => {
    switch (type) {
      case "json":
        exportJSON(notes, subnotes);
        break;
      case "pdf":
        exportNotesToPDF(notes, subnotes);
        break;
      case "excel":
        exportNotesToExcel(notes, subnotes);
        break;
      case "zip":
        exportNotesAsZip(notes, subnotes);
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tools
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Export your notes in different formats
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<CodeIcon />}
              onClick={() => handleExport("json")}
            >
              Export to JSON
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              startIcon={<PictureAsPdfIcon />}
              onClick={() => handleExport("pdf")}
            >
              Export to PDF
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<TableChartIcon />}
              onClick={() => handleExport("excel")}
            >
              Export to Excel
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              startIcon={<FolderZipIcon />}
              onClick={() => handleExport("zip")}
            >
              Export to ZIP
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
