import { useSelector, useDispatch } from "react-redux";
import ReactImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";

import { useState } from "react";
import {
  deleteImageFromActiveNote,
  updatedImagesReducer,
} from "../../store/slices/noteSlice";

export const Gallery = ({ images }) => {
  const dispatch = useDispatch();
  const { activeNote } = useSelector((state) => state.note);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editAltText, setEditAltText] = useState("");
  const [showGallery, setShowGallery] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();

  const handleDelete = () => {
    if (!activeNote?.images?.length) return;
    dispatch(deleteImageFromActiveNote(currentIndex));
  };

  const handleEdit = () => {
    const currentImage = activeNote?.images?.[currentIndex];
    setEditAltText(currentImage?.altText || "");
    setIsEditing(true);
  };

  const imagesR =
    images?.map(({ url, altText }) => ({
      original: url,
      thumbnail: url,
      description: altText,
    })) || [];

  if (imagesR.length === 0) return null;

  return (
    <Box sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}>
      {/* Vista con miniaturas */}
      {!showGallery && (
        <Box display="flex" flexWrap="wrap" gap={1}>
          {imagesR.map((img, index) => (
            <Box
              key={index}
              component="img"
              src={img.thumbnail || img.original}
              alt={img.originalAlt || ""}
              onClick={() => {
                setStartIndex(index);
                setCurrentIndex(index);
                setShowGallery(true);
              }}
              sx={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 1,
                cursor: "pointer",
                border: "2px solid transparent",
                "&:hover": {
                  borderColor: "primary.main",
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* Galería grande */}
      {showGallery && (
        <>
          <ReactImageGallery
            items={imagesR}
            startIndex={startIndex}
            showThumbnails={true}
            showPlayButton={true}
            showFullscreenButton={true}
            onSlide={(index) => setCurrentIndex(index)}
            additionalClass="custom-gallery"
          />

          {/* Botón flotante para cerrar galería */}
          <IconButton
            onClick={() => setShowGallery(false)}
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              zIndex: 10,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.2)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </>
      )}

      {/* Botones de editar/eliminar (cuando se ve la galería) */}
      {showGallery && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            gap: 1,
            zIndex: 10,
          }}
        >
          <IconButton
            onClick={handleEdit}
            size="small"
            sx={{
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": { bgcolor: theme.palette.primary.main },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton
            onClick={handleDelete}
            size="small"
            sx={{
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": { bgcolor: theme.palette.error.main },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Diálogo para editar texto alternativo */}
      <Dialog
        open={isEditing}
        onClose={() => setIsEditing(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Editar texto alternativo</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Texto alternativo"
            variant="outlined"
            size="small"
            value={editAltText}
            onChange={(e) => setEditAltText(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              const updatedImages = [...activeNote.images];
              updatedImages[currentIndex] = {
                ...updatedImages[currentIndex],
                altText: editAltText,
              };
              dispatch(updatedImagesReducer(updatedImages));
              setIsEditing(false);
            }}
          >
            Guardar
          </Button>
          <Button onClick={() => setIsEditing(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  //   <Box sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}>
  //     <ReactImageGallery
  //       items={imagesR}
  //       showThumbnails={true}
  //       thumbnailPosition="bottom"
  //       showPlayButton={true}
  //       showFullscreenButton={true}
  //       onSlide={(index) => setCurrentIndex(index)}
  //       additionalClass="custom-gallery"
  //     />

  //     {/* BOTONES flotantes */}
  //     <Box
  //       sx={{
  //         position: "absolute",
  //         top: 8,
  //         right: 8,
  //         display: "flex",
  //         gap: 1,
  //         zIndex: 10,
  //       }}
  //     >
  //       <IconButton
  //         onClick={handleEdit}
  //         size="small"
  //         sx={{
  //           bgcolor: "rgba(0,0,0,0.5)",
  //           color: "white",
  //           "&:hover": { bgcolor: theme.palette.primary.main },
  //         }}
  //       >
  //         <EditIcon fontSize="small" />
  //       </IconButton>

  //       <IconButton
  //         onClick={handleDelete}
  //         size="small"
  //         sx={{
  //           bgcolor: "rgba(0,0,0,0.5)",
  //           color: "white",
  //           "&:hover": { bgcolor: theme.palette.error.main },
  //         }}
  //       >
  //         <DeleteIcon fontSize="small" />
  //       </IconButton>
  //     </Box>

  //     {/* DIALOGO para editar */}
  //     <Dialog
  //       open={isEditing}
  //       onClose={() => setIsEditing(false)}
  //       fullWidth
  //       maxWidth="xs"
  //     >
  //       <DialogTitle>Editar texto alternativo</DialogTitle>
  //       <DialogContent>
  //         <TextField
  //           fullWidth
  //           label="Texto alternativo"
  //           variant="outlined"
  //           size="small"
  //           value={editAltText}
  //           onChange={(e) => setEditAltText(e.target.value)}
  //           autoFocus
  //         />
  //       </DialogContent>
  //       <DialogActions>
  //         <Button
  //           variant="contained"
  //           onClick={() => {
  //             const updatedImages = [...activeNote.images];
  //             updatedImages[currentIndex] = {
  //               ...updatedImages[currentIndex],
  //               altText: editAltText,
  //             };
  //             dispatch(updatedImagesReducer(updatedImages));
  //             setIsEditing(false);
  //           }}
  //         >
  //           Guardar
  //         </Button>
  //         <Button onClick={() => setIsEditing(false)}>Cancelar</Button>
  //       </DialogActions>
  //     </Dialog>
  //   </Box>
  // );
};
