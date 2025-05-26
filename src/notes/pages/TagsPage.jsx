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
} from "@mui/material";
import { NoteAdd as NoteAddIcon } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

import {
  useGetTagsQuery,
  useAddTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} from "../../../services/tagApi";
import { useOutletContext } from "react-router-dom";

export const TagsPage = () => {
  // const { data: tags = [], isLoading } = useGetTagsQuery({
  //   page: 1,
  //   limit: 100,
  // });

  const { notes, user, categories, tags } = useOutletContext();

  console.log({ tags });

  const [addTag] = useAddTagMutation();
  const [updateTag] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();

  const [selectedTag, setSelectedTag] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditTag = (tag) => {
    setSelectedTag(tag);
    setIsEditModalOpen(true);
  };

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
        <Typography variant="h4">Mis Etiquetas</Typography>
        <Button
          variant="contained"
          startIcon={<NoteAddIcon />}
          onClick={() => handleEditTag({ name: "" })}
        >
          Nueva Etiqueta
        </Button>
      </Box>

      <Grid container spacing={3}>
        {tags.length > 0 ? (
          tags
            .filter((tag) => tag.userId !== null)
            .map((tag) => (
              <Grid item xs={12} sm={6} md={4} key={tag.id}>
                <Card sx={{ height: "100%" }}>
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6">{tag.name}</Typography>
                    <Box>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEditTag(tag)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteTag(tag)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
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
          </Grid>
        )}
      </Grid>

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
    </Box>
  );
};
