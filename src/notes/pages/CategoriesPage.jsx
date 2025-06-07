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
  Stack,
  Pagination,
} from "@mui/material";
import { NoteAdd as NoteAddIcon } from "@mui/icons-material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryIcon from "@mui/icons-material/Category";

import { useOutletContext } from "react-router-dom";

import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../../services/categoryApi";
import Swal from "sweetalert2";

const colorOptions = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#607d8b",
];

export const CategoriesPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { totalCategories } = useOutletContext();

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoryError,
  } = useGetCategoriesQuery({ page: page, limit: limit });

  const totalPages = Math.ceil(totalCategories / limit);

  const [addCategory, { isLoading: isLoadingCreateCategory }] =
    useAddCategoryMutation();
  const [updateCategory, { isLoading: isLoadingSaveCategory }] =
    useUpdateCategoryMutation();

  const [deleteCategory, { isLoading: isLoadingDeleteCategory }] =
    useDeleteCategoryMutation();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    console.log({ category });
    setIsEditModalOpen(true);
  };

  const handleDeleteCategory = async (selectedCategory) => {
    console.log("borrando ", selectedCategory);
    if (!selectedCategory?.id) return;

    const result = await Swal.fire({
      title: `¿Eliminar "${selectedCategory.name}"?`,
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
        const response = await deleteCategory(selectedCategory.id).unwrap();
        console.log("✅ Categoría eliminada:", response);

        Swal.fire({
          title: `${selectedCategory.name} eliminada`,
          icon: "success",
          width: 600,
          padding: "3em",
          color: "#716add",
          backdrop: `
          rgba(0,0,123,0.4)
          url("/images/nyan-cat.gif")
          right top
          no-repeat
        `,
        });
      } catch (err) {
        console.error("❌ Error al eliminar categoría:", err);
        Swal.fire(
          "Oops",
          `${err.data?.error || "Ocurrió un error al eliminar"}`,
          "error"
        );
      }
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSaveCategory = async () => {
    // aquí iría tu lógica para guardar los cambios (dispatch, API, etc.)
    let response;
    try {
      if (selectedCategory.id) {
        console.log("EDITANDO :  ", selectedCategory);
        response = await updateCategory(selectedCategory).unwrap();
        console.log("✅ Categoria editada:", response);
      } else {
        console.log("GUARDANDO : ", selectedCategory);
        response = await addCategory(selectedCategory).unwrap();
        console.log("✅ Categoria creada:", response);
      }

      Swal.fire({
        title: `${selectedCategory.name} guardada!`,
        icon: "success",
        width: 600,
        padding: "3em",
        color: "#716add",
        backdrop: `
                rgba(0,0,123,0.4)
                url("/images/nyan-cat.gif")
                right top
                no-repeat
              `,
      });
    } catch (err) {
      console.error("❌ Error al guardar categoria:", err);
      Swal.fire("Oops", `${err.data.error}`);
    } finally {
      setIsEditModalOpen(false);
    }
  };

  if (isCategoriesLoading || !categoriesData.data) {
    return <div>Cargando notas...</div>;
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
            fontWeight: 600,
          }}
        >
          {/* <CategoryIcon
            fontSize="large"
            color="primary"
            sx={{ marginRight: 2 }}
          ></CategoryIcon> */}
          🗂️ Categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<NoteAddIcon />}
          onClick={() =>
            handleEditCategory({
              name: "",
              color: "#000000",
            })
          }
          sx={{
            fontSize: {
              xs: "12px",
              sm: "14px",
              md: "16px",
            },
          }}
        >
          ADD CATEGORY
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: "flex", gap: 2 }}></Box>

      <Grid container spacing={3}>
        {categoriesData.data.length > 0 ? (
          categoriesData.data.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card
                sx={{
                  height: "100%",
                  borderLeft: `8px solid ${category.color}`,
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {category.name}
                  </Typography>

                  {category.user_id !== null && (
                    <Box>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEditCategory(category)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body1">
                No se encontraron categorías.
              </Typography>
              <Button
                variant="contained"
                startIcon={<NoteAddIcon />}
                onClick={handleNewNote}
                sx={{ mt: 2 }}
              >
                Crear Categoría
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>

      {selectedCategory && (
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
              {selectedCategory.id ? "Editar Categoría" : "Crear Categoría"}
            </Typography>

            <TextField
              fullWidth
              label="Nombre"
              value={selectedCategory.name}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  name: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Selecciona un color:
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {colorOptions.map((color) => (
                <Box
                  key={color}
                  onClick={() =>
                    setSelectedCategory({ ...selectedCategory, color })
                  }
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: color,
                    border:
                      selectedCategory.color === color
                        ? "2px solid black"
                        : "3px solid transparent",
                    cursor: "pointer",
                    transition: "border 0.2s",
                  }}
                />
              ))}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button onClick={handleCloseModal}>Cancelar</Button>
              <Button variant="contained" onClick={handleSaveCategory}>
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
