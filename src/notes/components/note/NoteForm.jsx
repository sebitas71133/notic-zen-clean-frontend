import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormHelperText,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  PushPin as PushPinIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  Add as AddIcon,
  Image as ImageIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import UploadIcon from "@mui/icons-material/Upload";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import UndoIcon from "@mui/icons-material/Undo";
import Swal from "sweetalert2";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";

import { Gallery } from "../Gallery";

import { Stack } from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { toast } from "react-toastify";
import { SubNotesView } from "../../views/SubNotesView";

import {
  useAddNoteMutation,
  useDeleteNoteMutation,
  useGetShareNotesQuery,
  useGetStatsQuery,
  useUpdateNoteMutation,
} from "../../../../services/noteApi";
import ShareNoteForm from "./ShareNoteForm";

const MAX_LENGTH = 5000;

const toBoolean = (value) => {
  if (value) {
    return "true";
  } else {
    return "false";
  }
};

export const NoteForm = ({ noteId = "new", onBack }) => {
  const { categories, tags, userId } = useOutletContext();

  const [addNote, { isLoading: isLoadingCreateNote }] = useAddNoteMutation();
  const [saveNote, { isLoading: isLoadingSaveNote }] = useUpdateNoteMutation();

  const { data: shareNotes = [], isLoading: isShareNotesLoading } =
    useGetShareNotesQuery({ noteId });

  const isNewNote = noteId === "new";
  const navigate = useNavigate();
  const { activeNote } = useSelector((state) => state.note);

  console.log(shareNotes);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
      tags: [],
      images: [],
      isPinned: false,
      isArchived: false,
    },
  });

  const [deleteNote] = useDeleteNoteMutation();

  // const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  const watchedImages = watch("images");

  //IMAGENES DESDE PC :

  const handleFileImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("The file exceeds 10MB, Please coohse a smaller one.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target?.result;
      setNewImageUrl(base64Image);
      setNewImageAlt("");
      setOpenImageDialog(true);
    };
    reader.readAsDataURL(file);

    // Limpiar el input para permitir volver a seleccionar la misma imagen si se desea
    event.target.value = null;
  };

  const onSubmit = async (data) => {
    console.log({ data });
    const confirmResult = await Swal.fire({
      title: "¿Guardar cambios?",
      text: "¿Estás seguro de que quieres guardar esta nota?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "No, cancelar",
    });

    if (!confirmResult.isConfirmed) {
      return;
    }
    try {
      const payload = {
        ...data,
        tags: data.tags ?? [],
        images: data.images ?? [],
        isPinned: toBoolean(data.isPinned),
        isArchived: toBoolean(data.isArchived),
      };

      let response;
      if (isNewNote) {
        response = await addNote(payload).unwrap();
        console.log("✅ Nota creada:", response);
      } else {
        response = await saveNote({ id: noteId, ...payload }).unwrap();
        console.log("✅ Nota actualizada:", response);
      }

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

      navigate("/app");
    } catch (err) {
      console.log(err);
      setValue("images", activeNote?.images || []);

      console.error("❌ Error al guardar nota:", err);
      Swal.fire("Oops", `${err.data.error}`);
    }
  };

  const handleDeleteNote = async () => {
    if (!activeNote) return;

    const result = await Swal.fire({
      title: `Delete note "${activeNote.title}"?`,
      text: "This acction cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteNote(activeNote.id).unwrap();
        Swal.fire("Note deleted", "", "success");
        navigate("/app");
      } catch (err) {
        console.error("Error al eliminar nota:", err);
        Swal.fire("Oops", err.data?.error || "An error ocurred", "error");
      }
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl) return;
    const updated = [
      ...watchedImages,
      {
        url: newImageUrl,
        altText: newImageAlt,
        publicId: undefined, // aún no existe en Cloudinary
        id: undefined, // será llenado por el backend
        createdAt: undefined,
      },
    ];
    setValue("images", updated, { shouldDirty: true });
    setNewImageUrl("");
    setNewImageAlt("");
    setOpenImageDialog(false);
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = watchedImages.filter((_, index) => index !== indexToRemove);
    setValue("images", updated, { shouldDirty: true });
  };

  const handleEditWatchedImage = (indexToUpdate, newAltText) => {
    const updated = watchedImages.map((img, index) =>
      index === indexToUpdate ? { ...img, altText: newAltText } : img
    );
    setValue("images", updated, { shouldDirty: true });
  };

  const handleInsertImageAtStart = (indexToMove) => {
    if (indexToMove < 0 || indexToMove >= watchedImages.length) return;

    const newImage = watchedImages[indexToMove];
    const filterImages = watchedImages.filter(
      (_, index) => index !== indexToMove
    );
    const updateImages = [newImage, ...filterImages];
    setValue("images", updateImages, { shouldDirty: true });
  };

  useEffect(() => {
    if (activeNote && !isNewNote) {
      setValue("title", activeNote.title || "");
      setValue("content", activeNote.content || "");
      setValue("categoryId", activeNote.categoryId || "");
      setValue("tags", activeNote.tags?.map((t) => t.id) || []);
      setValue("images", activeNote.images || []);
      setValue("isPinned", activeNote.isPinned || false);
      setValue("isArchived", activeNote.isArchived || false);
    }
  }, [activeNote, isNewNote, setValue]);

  const isPinned = watch("isPinned");
  const isArchived = watch("isArchived");

  const activeNoteInitial = {
    ...activeNote,
    tags: activeNote?.tags?.map((t) => t.id) || [],
  };

  useEffect(() => {
    const handlePaste = (event) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.indexOf("image") === 0) {
          const file = item.getAsFile();
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (e) => {
            const base64Image = e.target?.result;
            setNewImageUrl(base64Image); // Ponemos la imagen base64 en el estado
            setNewImageAlt(""); // Limpiamos el alt para que el usuario escriba uno
            setOpenImageDialog(true); // Abrimos el diálogo
          };
          reader.readAsDataURL(file);

          break; // Solo procesamos la primera imagen del portapapeles
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  if (isLoadingCreateNote || isLoadingSaveNote) {
    return (
      <Box
        sx={{
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Guardando nota...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 0, sm: 4 },
        m: { xs: 0, sm: 4 },
        width: { sx: "100%", sm: "100%", md: "90%", xl: "70%" },
        // mx: "auto",
      }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Portada -cover  */}

      <Box
        sx={{
          width: "100%",
          height: 320, // altura de la imagen
          backgroundImage:
            watchedImages.length > 0
              ? `url(${watchedImages[0].url})`
              : `url("https://picsum.photos/1200/400")`, // aquí pones tu URL
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "8px 8px 0 0",
          mb: 2, // separación con el contenido
        }}
      />

      {/* Formulario */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            sx={{
              fontSize: {
                xs: "1rem",
                sm: "1.3rem",
                // md: "2rem",
                // lg: "2rem",
              },
              fontWeight: 600,
            }}
          >
            {isNewNote ? "NEW NOTE" : "EDIT NOTE"}
          </Typography>
        </Box>
        <Box>
          {!isNewNote && (
            <>
              <Tooltip title="Fijar">
                <IconButton onClick={() => setValue("isPinned", !isPinned)}>
                  <PushPinIcon color={isPinned ? "primary" : "inherit"} />
                </IconButton>
              </Tooltip>

              <Tooltip title={isArchived ? "Desarchivar" : "Archivar"}>
                <IconButton onClick={() => setValue("isArchived", !isArchived)}>
                  {isArchived ? (
                    <UnarchiveIcon color="primary" />
                  ) : (
                    <ArchiveIcon />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton onClick={() => handleDeleteNote()} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          {/* BOTON CANCELAR */}

          <Button
            variant="contained"
            color="warning"
            disabled={!isDirty}
            startIcon={<UndoIcon />}
            onClick={async () => {
              const result = await Swal.fire({
                title: "¿Cancelar edición?",
                text: "Perderás los cambios no guardados de la nota.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, cancelar",
                cancelButtonText: "No, continuar editando",
              });

              if (result.isConfirmed) {
                if (isNewNote) {
                  // Si es una nota nueva y cancela, simplemente vuelve atrás
                  navigate(-1);
                } else {
                  // Si está editando una existente, restablece los datos originales
                  reset(activeNoteInitial); // Usa los datos originales de la subnota
                  Swal.fire({
                    title: "Restaurado",
                    text: "Los cambios han sido descartados.",
                    icon: "info",
                    timer: 1500, // en milisegundos
                    showConfirmButton: false,
                    timerProgressBar: true, // opcional, muestra una barra de progreso
                  });
                }
              }
            }}
            sx={{
              mr: 1,

              color: "#fff",
              "&:hover": {
                backgroundColor: "#f57c00",
              },
            }}
          >
            Cancelar
          </Button>

          {/* BOTON SAVE */}
          <Button
            type="submit"
            variant="contained"
            startIcon={
              isLoadingCreateNote || isLoadingSaveNote ? (
                <CircularProgress size={20} />
              ) : (
                <SaveIcon />
              )
            }
            sx={{ ml: 1 }}
            disabled={isLoadingCreateNote || isLoadingSaveNote}
          >
            {isLoadingCreateNote || isLoadingSaveNote ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Box
          disabled={isLoadingCreateNote || isLoadingSaveNote}
          component="fieldset"
          sx={{ border: 0, p: 0, m: 0 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Title"
                fullWidth
                {...register("title", {
                  required: "Title is required",
                  maxLength: {
                    value: 100,
                    message: `Title must not exceed ${100} characters`,
                  },
                })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>

            {/* CATEGORY */}
            <Grid item xs={12} md={6}>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel>Category</InputLabel>
                    <Select {...field} label="Category">
                      {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box
                              width={12}
                              height={12}
                              borderRadius="50%"
                              bgcolor={cat.color}
                              flexShrink={0}
                            />
                            {cat.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Contenido */}
            <Grid item xs={12}>
              <TextField
                label="Content"
                fullWidth
                multiline
                minRows={6}
                // inputProps={{ maxLength: 10 }}
                {...register("content", {
                  maxLength: {
                    value: MAX_LENGTH,
                    message: `Content must not exceed ${MAX_LENGTH} characters`,
                  },
                })}
                error={!!errors.content}
                helperText={errors.content?.message}
              />
              <Typography
                variant="body2"
                color={
                  watch("content", "").length > MAX_LENGTH
                    ? "error"
                    : "textSecondary"
                }
                align="right"
              >
                {watch("content", "").length}/{MAX_LENGTH}
              </Typography>
            </Grid>
            {/* Editor de contenido */}

            {/* Tags */}
            <Grid item xs={12}>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={tags}
                    getOptionLabel={(tag) => tag.name}
                    value={tags.filter((tag) => field.value.includes(tag.id))}
                    onChange={(e, newValue) =>
                      field.onChange(newValue.map((tag) => tag.id))
                    }
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                          <Chip
                            key={option.id}
                            label={option.name}
                            {...tagProps}
                          />
                        );
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        placeholder="Add Tags"
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
                    <ImageOutlinedIcon color="action" />
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontSize: {
                          xs: "1rem",
                          sm: "1.3rem",
                          // md: "2rem",
                          // lg: "2rem",
                        },
                        fontWeight: 600,
                      }}
                    >
                      IMAGES
                    </Typography>
                  </Stack>

                  {/* Acciones */}
                  <Stack direction="row" spacing={1}>
                    <Box>
                      <input
                        accept="image/*"
                        type="file"
                        hidden
                        multiple
                        id="upload-image"
                        onChange={handleFileImageUpload}
                      />
                      <label htmlFor="upload-image">
                        <Tooltip title="Upload from PC">
                          <IconButton component="span" color="primary">
                            <UploadIcon />
                          </IconButton>
                        </Tooltip>
                      </label>
                    </Box>

                    <Tooltip title="Add image by URL">
                      <IconButton
                        color="primary"
                        onClick={() => setOpenImageDialog(true)}
                      >
                        <AddPhotoAlternateIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
                <Gallery
                  images={watchedImages}
                  onRemove={handleRemoveImage}
                  onEdit={handleEditWatchedImage}
                  onPin={handleInsertImageAtStart}
                />
                {/* SUBIR DESDE PC */}
                {/* <Box>
                  <input
                    accept="image/*"
                    type="file"
                    hidden
                    multiple
                    id="upload-image"
                    onChange={handleFileImageUpload}
                  />
                  <label htmlFor="upload-image">
                    <Button
                      component="span"
                      startIcon={<ImageIcon />}
                      sx={{ mt: 1 }}
                    >
                      Upload image from PC
                    </Button>
                  </label>
                </Box> */}
                <Button
                  startIcon={<ImageIcon />}
                  onClick={() => setOpenImageDialog(true)}
                  sx={{ mt: 1 }}
                >
                  Add image
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
        <DialogTitle>Add Image</DialogTitle>
        <DialogContent>
          {newImageUrl?.startsWith("data:image") ? (
            <img
              src={newImageUrl}
              alt="Vista previa"
              style={{
                maxWidth: "100%",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            />
          ) : (
            <TextField
              label="image url"
              fullWidth
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}
          <TextField
            label="alternative text"
            fullWidth
            value={newImageAlt}
            onChange={(e) => setNewImageAlt(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImageDialog(false)}>Cancel</Button>
          <Button onClick={handleAddImage} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/* SUBNOTES */}
      {/* 
      {shareNotes.length > 0 && (
        <ShareNoteForm
          noteId={activeNote?.id}
          sharedUsers={shareNotes}
          // onUpdated={() => refetchNotes()}
        ></ShareNoteForm>
      )} */}

      <ShareNoteForm
        noteId={activeNote?.id}
        sharedUsers={shareNotes}
        // onUpdated={() => refetchNotes()}
      ></ShareNoteForm>

      {!isNewNote && (
        <Box mt={4}>
          <SubNotesView noteId={noteId}></SubNotesView>
        </Box>
      )}
    </Box>
  );
};
