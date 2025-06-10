import {
  useGetAllImagesQuery,
  useCleanOrphanImagesMutation,
} from "../../../services/noteApi";
import {
  useCleanOrphanSubImagesMutation,
  useGetAllSubImagesQuery,
} from "../../../services/subNoteApi";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

export const CloudinaryView = () => {
  // Notas
  const {
    data: imagesData,
    isLoading: isLoadingImages,
    isError,
  } = useGetAllImagesQuery();

  const [cleanOrphanImages, { isLoading: isCleaning }] =
    useCleanOrphanImagesMutation();

  // Subnotas
  const {
    data: imagesSubData,
    isLoading: isLoadingSubImages,
    isError: isSubError,
  } = useGetAllSubImagesQuery();

  const [cleanOrphanSubImages, { isLoading: isSubCleaning }] =
    useCleanOrphanSubImagesMutation();

  if (isLoadingImages || isLoadingSubImages)
    return (
      <Box p={4} textAlign="center">
        <CircularProgress />
        <Typography variant="body1">Cargando imágenes...</Typography>
      </Box>
    );

  if (isError || !imagesData?.data || isSubError || !imagesSubData?.data)
    return (
      <Box p={4}>
        <Typography color="error">Error al cargar las imágenes.</Typography>
      </Box>
    );

  const { cloudinaryImages, cloudinaryImagesBD, externalImagesBD } =
    imagesData.data;

  const { cloudinarySubImages, cloudinarySubImagesBD, externalSubImagesBD } =
    imagesSubData.data;

  const handleCleanOrphanImages = async () => {
    try {
      const res = await cleanOrphanImages().unwrap();
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCleanOrphanSubImages = async () => {
    try {
      const res = await cleanOrphanSubImages().unwrap();
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  const renderImageSection = (title, images, alt = "Imagen") => (
    <Box mb={4}>
      <Typography variant="h6" gutterBottom>
        {title}: {images.length}
      </Typography>
      <Grid container spacing={2}>
        {images.map((url, idx) => (
          <Grid item key={idx}>
            <Box
              component="img"
              src={url}
              alt={alt}
              sx={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 2,
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        📷 Vista de Imágenes
      </Typography>

      <Button
        variant="contained"
        color="error"
        onClick={handleCleanOrphanImages}
        disabled={isCleaning}
        sx={{ mb: 3 }}
      >
        {isCleaning ? "Limpiando..." : "🧹 Eliminar Imágenes Huérfanas"}
      </Button>

      {renderImageSection("📦 Total en Cloudinary (API)", cloudinaryImages)}
      {renderImageSection("🗂️ En BD (Cloudinary)", cloudinaryImagesBD)}
      {renderImageSection("🌐 En BD (externas)", externalImagesBD)}

      <Divider sx={{ my: 4 }} />

      <Typography variant="h4" gutterBottom>
        📝 Vista de Sub-Imágenes
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCleanOrphanSubImages}
        disabled={isSubCleaning}
        sx={{ mb: 3 }}
      >
        {isSubCleaning ? "Limpiando..." : "🧹 Eliminar Sub-Imágenes Huérfanas"}
      </Button>

      {renderImageSection(
        "📦 Total en Cloudinary (API)",
        cloudinarySubImages,
        "SubImagen"
      )}
      {renderImageSection(
        "🗂️ En BD (Cloudinary)",
        cloudinarySubImagesBD,
        "SubImagen"
      )}
      {renderImageSection(
        "🌐 En BD (externas)",
        externalSubImagesBD,
        "SubImagen externa"
      )}
    </Box>
  );
};
