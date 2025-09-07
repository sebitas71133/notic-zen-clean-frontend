import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";

import { dracula } from "@uiw/codemirror-theme-dracula";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Autocomplete,
  Stack,
  FormControlLabel,
  Switch,
  Grid2,
} from "@mui/material";
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  PushPin as PushPinIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
} from "@mui/icons-material";

import UploadIcon from "@mui/icons-material/Upload";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import UndoIcon from "@mui/icons-material/Undo";
import Swal from "sweetalert2";

import { setActiveSubNote } from "../../../store/slices/noteSlice";
import { useForm, Controller } from "react-hook-form";
import {
  useAddSubNoteMutation,
  useDeleteSubNoteMutation,
  useUpdateSubNoteMutation,
} from "../../../../services/subNoteApi";
import { toast } from "react-toastify";
import { Gallery } from "../Gallery";

const MAX_LENGTH = 5000;
const MAX_LENGTH_CODE = 10000;

const toBoolean = (value) => {
  if (value) {
    return "true";
  } else {
    return "false";
  }
};

export const SubNoteForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { noteId, subNoteId } = useParams();
  const { tags } = useOutletContext();

  const handleBack = () => {
    dispatch(setActiveSubNote(null));
    navigate(`/app/note/${noteId}`); // Volver a la lista de notas
  };

  const [addSubNote, { isLoading: isLoadingCreateNote }] =
    useAddSubNoteMutation();
  const [saveSubNote, { isLoading: isLoadingSaveNote }] =
    useUpdateSubNoteMutation();

  const isNewSubNote = subNoteId === "new";
  const { activeSubNote } = useSelector((state) => state.note);

  //   USE FORM

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
      description: "",
      code: "",
      tags: [],
      images: [],
      isPinned: false,
      isArchived: false,
      hasCode: false,
    },
  });

  const [deleteSubNote] = useDeleteSubNoteMutation();

  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  const watchedImages = watch("images");

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
    const confirmResult = await Swal.fire({
      title: "¿Guardar cambios?",
      text: "¿Estás seguro de que quieres guardar esta subnota?",
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
      if (isNewSubNote) {
        response = await addSubNote({ noteId, subNote: payload }).unwrap();
        console.log("✅ Nota creada:", response);
      } else {
        response = await saveSubNote({
          noteId,
          subNoteId,
          subNote: payload,
        }).unwrap();
        console.log("✅ SubNote actualizada:", response);
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

      navigate(`/app/note/${noteId}`);
    } catch (err) {
      console.log(err);
      setValue("images", activeSubNote?.images || []);

      console.error("❌ Error al guardar nota:", err);
      Swal.fire("Oops", `${err.data.error}`);
    }
  };

  const handleDeleteNote = async () => {
    if (!activeSubNote) return;

    const result = await Swal.fire({
      title: `Delete subnote "${activeSubNote.title}"?`,
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
        await deleteSubNote({
          subNoteId: activeSubNote.id,
          noteId: activeSubNote.noteId,
        }).unwrap();
        Swal.fire("SubNote deleted", "", "success");
        navigate(`/app/note/${noteId}`);
      } catch (err) {
        console.error("Error al eliminar subnota:", err);
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
    if (activeSubNote && !isNewSubNote) {
      setValue("title", activeSubNote.title || "");
      setValue("description", activeSubNote.description || "");
      setValue("code", activeSubNote.code || "");
      setValue("tags", activeSubNote.tags?.map((t) => t.id) || []);
      setValue("images", activeSubNote.images || []);
      setValue("isPinned", activeSubNote.isPinned || false);
      setValue("isArchived", activeSubNote.isArchived || false);
      setValue("hasCode", !!activeSubNote.code);
    }
  }, [activeSubNote, isNewSubNote, setValue]);

  const isPinned = watch("isPinned");
  const isArchived = watch("isArchived");

  const activeSubNoteInitial = {
    ...activeSubNote,
    tags: activeSubNote?.tags?.map((t) => t.id) || [],
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
        width: "100%",

        display: "flex",
        justifyContent: "center",
        alignItems: "flex-center",
        p: 2,
      }}
    >
      <Box
        sx={{ p: { xs: 0, sm: 4 }, m: { xs: 0, sm: 4 } }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Portada -cover  */}

        <Box
          sx={{
            width: "100%",
            height: 200, // altura de la imagen
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
            <IconButton onClick={handleBack}>
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
              {isNewSubNote ? "NEW SUBNOTE" : "EDIT SUBNOTE"}
            </Typography>
          </Box>

          <Box>
            {!isNewSubNote && (
              <>
                <Tooltip title="Fijar">
                  <IconButton onClick={() => setValue("isPinned", !isPinned)}>
                    <PushPinIcon color={isPinned ? "primary" : "inherit"} />
                  </IconButton>
                </Tooltip>

                <Tooltip title={isArchived ? "Desarchivar" : "Archivar"}>
                  <IconButton
                    onClick={() => setValue("isArchived", !isArchived)}
                  >
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
            {/* BOTON PARA CANCELAR */}
            <Button
              variant="contained"
              color="warning"
              disabled={!isDirty}
              startIcon={<UndoIcon />}
              onClick={async () => {
                const result = await Swal.fire({
                  title: "¿Cancelar edición?",
                  text: "Perderás los cambios no guardados de la subnota.",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Sí, cancelar",
                  cancelButtonText: "No, continuar editando",
                });

                if (result.isConfirmed) {
                  if (isNewSubNote) {
                    // Si es una nota nueva y cancela, simplemente vuelve atrás
                    navigate(-1);
                  } else {
                    // Si está editando una existente, restablece los datos originales
                    reset(activeSubNoteInitial); // Usa los datos originales de la subnota
                    Swal.fire({
                      title: "Restaurado",
                      text: "Los cambios han sido descartados.",
                      icon: "info",
                      timer: 1500,
                      showConfirmButton: false,
                      timerProgressBar: true,
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
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, md: 6 }}>
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
              </Grid2>

              {/* Contenido */}
              <Grid2 size={{ xs: 12 }}>
                <TextField
                  label="description"
                  fullWidth
                  multiline
                  minRows={6}
                  // inputProps={{ maxLength: 10 }}
                  {...register("description", {
                    maxLength: {
                      value: MAX_LENGTH,
                      message: `description must not exceed ${MAX_LENGTH} characters`,
                    },
                  })}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />

                <Typography
                  variant="body2"
                  color={
                    watch("description", "").length > MAX_LENGTH
                      ? "error"
                      : "textSecondary"
                  }
                  align="right"
                >
                  {watch("description", "").length}/{MAX_LENGTH}
                </Typography>
              </Grid2>

              {/* Code */}

              <Grid2 size={{ xs: 12 }} mb={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={watch("hasCode", false)}
                      onChange={(e) => setValue("hasCode", e.target.checked)}
                    />
                  }
                  label="¿Agregar código?"
                />
              </Grid2>
              {watch("hasCode", false) && (
                <Grid2 size={{ xs: 12 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Code
                  </Typography>
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                      <CodeMirror
                        value={field.value}
                        height="600px"
                        theme={vscodeDark}
                        extensions={[javascript(), python(), sql()]} // elige qué lenguajes habilitar
                        onChange={(value) => field.onChange(value)}
                      />
                    )}
                  />
                  <Typography
                    variant="body2"
                    color={
                      watch("code", "").length > MAX_LENGTH_CODE
                        ? "error"
                        : "textSecondary"
                    }
                    align="right"
                  >
                    {watch("code", "").length}/{MAX_LENGTH_CODE}
                  </Typography>
                </Grid2>
              )}

              <Grid2 size={{ xs: 12 }}>
                <Box sx={{ mb: 2 }}>
                  {/* Encabezado con título e icono */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 1 }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <ImageOutlinedIcon color="primary" />
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontSize: { xs: "1rem", sm: "1.2rem" },
                          fontWeight: 600,
                        }}
                      >
                        Images
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
                    setValue={setValue}
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
                  </Box>
                  <Button
                    startIcon={<ImageIcon />}
                    onClick={() => setOpenImageDialog(true)}
                    sx={{ mt: 1 }}
                  >
                    Add image
                  </Button> */}
                </Box>
              </Grid2>

              {/* Tags */}
              <Grid2 size={{ xs: 12 }}>
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
                          const { key, ...tagProps } = getTagProps({
                            index,
                          });
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
              </Grid2>
            </Grid2>
          </Box>
        </Paper>

        <Dialog
          open={openImageDialog}
          onClose={() => setOpenImageDialog(false)}
        >
          <DialogTitle>Add Image </DialogTitle>
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
      </Box>
    </Box>
  );
};
