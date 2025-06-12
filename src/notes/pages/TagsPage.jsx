import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  CardContent,
  Button,
  TextField,
  IconButton,
  Paper,
  Modal,
  CircularProgress,
  Chip,
  Tooltip,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { NoteAdd as NoteAddIcon } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LabelIcon from "@mui/icons-material/Label";
import Swal from "sweetalert2";

import {
  useGetTagsQuery,
  useAddTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} from "../../../services/tagApi";
import { useOutletContext } from "react-router-dom";

const tagColors = [
  "#E57373", // Red
  "#64B5F6", // Blue
  "#81C784", // Green
  "#FFD54F", // Yellow
  "#BA68C8", // Purple
  "#4DB6AC", // Teal
  "#FF8A65", // Orange
  "#A1887F", // Brown
];

export const TagsPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { totalTags } = useOutletContext();

  const { data: tagsData = [], isLoading: isLoadingTags } = useGetTagsQuery({
    page: page,
    limit: limit,
  });

  const totalPages = Math.ceil(totalTags / limit);

  const [addTag] = useAddTagMutation();
  const [updateTag] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();

  const [selectedTag, setSelectedTag] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditTag = (tag) => {
    setSelectedTag(tag);
    setIsEditModalOpen(true);
  };

  console.log({ tagsData });

  const handleDeleteTag = async (tag) => {
    if (!tag?.id) return;

    const result = await Swal.fire({
      title: `¿Eliminar etiqueta "${tag.name}"?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteTag(tag.id).unwrap();
        Swal.fire("Etiqueta eliminada", "", "success");
      } catch (err) {
        console.error("Error al eliminar tag:", err);
        Swal.fire("Oops", err.data?.error || "Ocurrió un error", "error");
      }
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedTag(null);
  };

  const handleSaveTag = async () => {
    try {
      if (selectedTag.id) {
        await updateTag(selectedTag).unwrap();
        Swal.fire("Etiqueta actualizada", "", "success");
      } else {
        await addTag(selectedTag).unwrap();
        Swal.fire("Etiqueta creada", "", "success");
      }
    } catch (err) {
      console.error("Error al guardar tag:", err);
      Swal.fire("Oops", err.data?.error || "Error desconocido", "error");
    } finally {
      handleCloseModal();
    }
  };

  if (isLoadingTags || !tagsData) {
    return <CircularProgress size={20} />;
  }

  return (
    <Box>
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
          component="h1"
          sx={{
            fontSize: {
              xs: "1.3rem",
              sm: "1.5rem",
              md: "1.7rem",
            },
            // fontWeight: 600,
          }}
        >
          <LabelIcon
            fontSize="large"
            color="primary"
            sx={{ marginRight: 2 }}
          ></LabelIcon>
          Tags
        </Typography>
        <Button
          variant="contained"
          startIcon={<NoteAddIcon />}
          onClick={() => handleEditTag({ name: "" })}
          sx={{
            fontSize: {
              xs: "12px",
              sm: "14px",
              md: "16px",
            },
          }}
        >
          ADD TAG
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 4,
        }}
      >
        {tagsData.data.length > 0 ? (
          tagsData.data.map((tag, index) => {
            const color = tagColors[index % tagColors.length];

            return (
              <Chip
                key={tag.id}
                label={tag.name}
                sx={{
                  fontSize: "0.95rem",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "999px",
                  backgroundColor: color,
                  color: "text.primary.main",
                  "&:hover": {
                    opacity: 0.85,
                    cursor: "pointer",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
                onClick={() => handleEditTag(tag)}
                deleteIcon={
                  <Tooltip title="Eliminar">
                    <DeleteIcon
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTag(tag);
                      }}
                      sx={{
                        color: color,
                      }}
                    />
                  </Tooltip>
                }
                onDelete={tag.userId ? () => {} : undefined}
              />
            );
          })
        ) : (
          <Paper sx={{ p: 3, textAlign: "center", width: "100%" }}>
            <Typography>No hay etiquetas todavía.</Typography>
            <Button
              variant="contained"
              startIcon={<NoteAddIcon />}
              onClick={() => handleEditTag({ name: "" })}
              sx={{ mt: 2 }}
            >
              Crear Etiqueta
            </Button>
          </Paper>
        )}
      </Box>

      {selectedTag && (
        <Modal open={isEditModalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              width: 400,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {selectedTag.id ? "Editar Etiqueta" : "Crear Etiqueta"}
            </Typography>

            <TextField
              fullWidth
              label="Nombre"
              value={selectedTag.name}
              onChange={(e) =>
                setSelectedTag({ ...selectedTag, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button onClick={handleCloseModal}>Cancelar</Button>
              <Button variant="contained" onClick={handleSaveTag}>
                Guardar
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

      <Stack spacing={2} mt={5} alignItems="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
      </Stack>
    </Box>
  );
};
