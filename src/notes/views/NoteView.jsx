import { useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

// MUI Components
import { DeleteOutline, SaveOutlined } from "@mui/icons-material";
import {
  Button,
  Grid2,
  TextField,
  Typography,
  IconButton,
  Paper,
  Box,
} from "@mui/material";

// Componentes personalizados
import { UploadImage } from "../components/UploadImage";

import { formatDate } from "../../utils/dates";

// Redux Actions
import {
  deleteNoteThunk,
  deletingImage,
  saveNoteThunk,
  updateNote,
} from "../../store/slices/journalSlice";
import { setGlobalImages } from "../../store/slices/userSlice";
import { ImageGallery } from "../components/ImageGallery";
import { saveImageGlobally } from "../../firebase/saveImageGlobally";

export const NoteView = () => {
  const dispatch = useDispatch();

  // Estado Global
  const {
    active: activeNote,
    isSaving,
    isUploadingImages,
  } = useSelector((state) => state.journal);
  const { email } = useSelector((state) => state.auth);
  const { globalImages } = useSelector((state) => state.users);

  // Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // 📌 Manejo de subida de imágenes
  const handleImageUpload = useCallback(
    (url) => {
      const images = watch("imagesUrls") || [];
      const updatedImages = [...images, url];

      setValue("imagesUrls", updatedImages);
      dispatch(saveImageGlobally(url, email));
      dispatch(setGlobalImages([{ url, email }]));
    },
    [dispatch, email, setValue, watch]
  );

  // 🗑️ Manejo de eliminación de imágenes
  const handleDeleteImage = useCallback(
    (url) => {
      dispatch(deletingImage(true));

      const images = watch("imagesUrls") || [];
      const updatedImages = images.filter((e) => e !== url);

      setValue("imagesUrls", updatedImages);
      dispatch(deletingImage(false));
    },
    [dispatch, setValue, watch]
  );

  // 💾 Guardar Nota
  const onSubmit = (data) => {
    dispatch(saveNoteThunk(data));
    dispatch(updateNote(data));

    Swal.fire({
      title: `${data.title} saved!`,
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
  };

  // ❌ Eliminar Nota
  const onDeleteNote = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteNoteThunk());
        Swal.fire({
          title: "Deleted!",
          text: `Your Note "${activeNote?.title}" has been deleted.`,
          icon: "success",
        });
      }
    });
  };

  // 🎯 Sincronizar datos en el formulario cuando cambia `activeNote`
  useEffect(() => {
    if (activeNote) {
      setValue("title", activeNote.title || "");
      setValue("body", activeNote.body || "");
      setValue("date", new Date(activeNote?.date).toUTCString() || "");
      setValue("id", activeNote.id);
      setValue("imagesUrls", activeNote.imagesUrls || []);
    }
  }, [activeNote, setValue]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 3,
        mt: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {/* 🗓️ Fecha */}
      <Typography variant="h5" fontWeight="light" textAlign="center" mb={2}>
        {activeNote ? formatDate(activeNote?.date) : "No date available"}
      </Typography>

      {/* 📤 Botones de Guardar y Eliminar */}
      <Grid2
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <UploadImage onUpload={handleImageUpload} />

        <Box>
          <IconButton
            disabled={isSaving || isUploadingImages}
            color="primary"
            sx={{
              mx: 1,
              p: 1.5,
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
            }}
            type="submit"
          >
            <SaveOutlined sx={{ fontSize: 28 }} />
          </IconButton>

          <IconButton
            sx={{
              mx: 1,
              p: 1.5,
              bgcolor: "error.main",
              color: "white",
              "&:hover": { bgcolor: "error.dark" },
            }}
            onClick={onDeleteNote}
            disabled={isSaving || isUploadingImages}
          >
            <DeleteOutline sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
      </Grid2>

      {/* 📝 Campos del Formulario */}
      <TextField
        variant="outlined"
        placeholder="Ingrese un título"
        label="Título"
        fullWidth
        {...register("title", { required: "El título es requerido" })}
        error={!!errors.title}
        helperText={errors.title?.message}
        sx={{ mb: 2 }}
      />

      <TextField
        variant="outlined"
        fullWidth
        multiline
        placeholder="¿Qué sucedió en el día de hoy?"
        minRows={5}
        {...register("body", { required: "El texto es requerido" })}
        error={!!errors.body}
        helperText={errors.body?.message}
        sx={{ mb: 2 }}
      />

      {/* 🖼️ Galería de Imágenes */}
      <Paper sx={{ p: 2, bgcolor: "grey.100", borderRadius: 2, boxShadow: 1 }}>
        <ImageGallery onDelete={handleDeleteImage} />
      </Paper>
    </Box>
  );
};
