import { useSelector, useDispatch } from "react-redux";
import ReactImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { Box } from "@mui/material";
import { TextField, Button, Typography } from "@mui/material";

import {
  deleteImageFromActiveNote,
  updatedImagesReducer,
} from "../../store/slices/noteSlice";

export const Gallery = (props) => {
  const { images } = props;
  const dispatch = useDispatch();
  const { activeNote } = useSelector((state) => state.note);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editAltText, setEditAltText] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleDeleteCurrentImage = () => {
    if (!activeNote?.images?.length) return;

    dispatch(deleteImageFromActiveNote(currentIndex));

    // (Opcional) Aquí podrías sincronizar con el backend
    // await api.updateNoteImages(activeNote.id, updatedImages);
  };

  const imagesR =
    images?.map(({ url, altText }) => ({
      original: url,
      thumbnail: url,
      thumbnailWidth: 80,
      thumbnailHeight: 80,
      thumbnailLoading: "lazy",
      description: altText,
    })) || [];

  if (imagesR.length === 0) return null;

  return (
    <Box sx={{ position: "relative" }}>
      <ReactImageGallery
        showBullets={true}
        items={imagesR}
        thumbnailPosition="top"
        onSlide={(index) => setCurrentIndex(index)}
      />
      {/* //ELIMINAR */}
      <IconButton
        onClick={handleDeleteCurrentImage}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          bgcolor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          "&:hover": { bgcolor: "red" },
        }}
      >
        <DeleteIcon />
      </IconButton>
      {/* //EDITAR */}
      <IconButton
        onClick={() => {
          const currentImage = activeNote?.images?.[currentIndex];
          setEditAltText(currentImage?.altText || "");
          setIsEditing(true);
        }}
        sx={{
          position: "absolute",
          top: 10,
          right: 60,
          zIndex: 10,
          bgcolor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          "&:hover": { bgcolor: "blue" },
        }}
      >
        <EditIcon />
      </IconButton>
      {isEditing && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "background.paper",
            width: "100%",
            maxWidth: 500,
          }}
        >
          {/* <Typography variant="subtitle1" gutterBottom>
            Editar texto alternativo
          </Typography> */}

          <TextField
            fullWidth
            id="altTextInput"
            label="Texto alternativo"
            variant="outlined"
            size="small"
            value={editAltText}
            onChange={(e) => setEditAltText(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
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

            <Button
              variant="contained"
              color="secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
