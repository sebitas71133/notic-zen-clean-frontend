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
import Swal from "sweetalert2";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  useAddNoteMutation,
  useUpdateNoteMutation,
} from "../../../services/noteApi";
import { Gallery } from "../components/Gallery";

import { Stack } from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { toast } from "react-toastify";

export const NoteCard = ({ noteId = "new", onBack }) => {
  const { categories, tags, userId } = useOutletContext();
  const [addNote, { isLoading: isLoadingCreateNote }] = useAddNoteMutation();
  const [saveNote, { isLoading: isLoadingSaveNote }] = useUpdateNoteMutation();
  const isNewNote = noteId === "new";
  const navigate = useNavigate();
  const { activeNote } = useSelector((state) => state.note);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
      tags: [],
      images: [],
    },
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  const watchedImages = watch("images");
  console.log({ watchedImages });

  //IMAGENES DESDE PC :

  const handleFileImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error(
        "El archivo supera los 10MB. Por favor, selecciona uno más ligero."
      );
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
    try {
      const payload = {
        ...data,
        tags: data.tags ?? [],
        images: data.images ?? [],
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
        title: `${data.title} guardada!`,
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

      console.log(payload);

      navigate("/app");
    } catch (err) {
      setValue("images", activeNote.images || []);
      console.error("❌ Error al guardar nota:", err);
      Swal.fire("Oops", `${err.data.error}`);
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
    setValue("images", updated);
    setNewImageUrl("");
    setNewImageAlt("");
    setOpenImageDialog(false);
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = watchedImages.filter((_, index) => index !== indexToRemove);
    setValue("images", updated);
  };

  useEffect(() => {
    if (activeNote && !isNewNote) {
      setValue("title", activeNote.title || "");
      setValue("content", activeNote.content || "");
      setValue("categoryId", activeNote.categoryId || "");
      setValue("tags", activeNote.tags?.map((t) => t.id) || []);
      setValue("images", activeNote.images || []);
    }
  }, [activeNote, isNewNote, setValue]);

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

  return (
    <Box sx={{ p: 3 }} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5">
            {isNewNote ? "Nueva Nota" : "Editar Nota"}
          </Typography>
        </Box>
        <Box>
          {!isNewNote && (
            <>
              <Tooltip title="Fijar">
                <IconButton>
                  <PushPinIcon
                    color={activeNote?.isPinned ? "secondary" : "inherit"}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Archivar">
                <IconButton>
                  {activeNote?.isArchived ? <UnarchiveIcon /> : <ArchiveIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton
                  onClick={() => setOpenDeleteDialog(true)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ ml: 1 }}
            disabled={isLoadingCreateNote || isLoadingSaveNote}
          >
            Guardar
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
            <Grid item xs={12}>
              <TextField
                label="Título"
                fullWidth
                {...register("title", { required: "El título es requerido" })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contenido"
                fullWidth
                multiline
                minRows={4}
                {...register("content")}

                // {...register("content", { required: "El texto es requerido" })}
                // error={!!errors.content}
                // helperText={errors.content?.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: "La categoría es obligatoria" }}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel>Categoría</InputLabel>
                    <Select {...field} label="Categoría">
                      <MenuItem value="">Sin categoría</MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <FormHelperText>
                        {fieldState.error.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="tags"
                control={control}
                rules={{
                  validate: (value) =>
                    value.length > 0 || "Selecciona al menos una etiqueta",
                }}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error}>
                    <InputLabel>Etiquetas</InputLabel>
                    <Select
                      multiple
                      {...field}
                      renderValue={(selected) =>
                        selected
                          .map((id) => tags.find((t) => t.id === id)?.name)
                          .join(", ")
                      }
                    >
                      {tags
                        .filter(
                          (tag) => tag.userId === userId || tag.userId === null
                        )
                        .map((tag) => (
                          <MenuItem key={tag.id} value={tag.id}>
                            <Checkbox checked={field.value.includes(tag.id)} />
                            {tag.name}
                          </MenuItem>
                        ))}
                    </Select>
                    {fieldState.error && (
                      <FormHelperText>
                        {fieldState.error.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 2 }}
                >
                  <ImageOutlinedIcon color="action" />
                  <Typography variant="h5" component="h2">
                    Imágenes de la Nota
                  </Typography>
                </Stack>
                <Gallery images={watchedImages} onRemove={handleRemoveImage} />
                <Button
                  startIcon={<ImageIcon />}
                  onClick={() => setOpenImageDialog(true)}
                  sx={{ mt: 1 }}
                >
                  Agregar imagen
                </Button>
              </Box>
              {/* SUBIR DESDE PC */}
              <input
                accept="image/*"
                type="file"
                hidden
                id="upload-image"
                onChange={handleFileImageUpload}
              />
              <label htmlFor="upload-image">
                <Button
                  component="span"
                  startIcon={<ImageIcon />}
                  sx={{ mt: 1 }}
                >
                  Subir imagen desde PC
                </Button>
              </label>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
        <DialogTitle>Agregar Imagen</DialogTitle>
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
              label="URL de la imagen"
              fullWidth
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}
          <TextField
            label="Texto alternativo"
            fullWidth
            value={newImageAlt}
            onChange={(e) => setNewImageAlt(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImageDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddImage} variant="contained">
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
