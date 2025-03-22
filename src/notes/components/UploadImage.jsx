import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Badge, IconButton, Typography, Box, Tooltip } from "@mui/material";
import { setIsUploadingImages } from "../../store/slices/journalSlice";

export const UploadImage = ({ onUpload }) => {
  const dispatch = useDispatch();
  const { isSaving } = useSelector((state) => state.journal);
  const [pendingImages, setPendingImages] = useState(0); // Contador de imágenes nuevas

  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUD_UPLOAD_PRESET;

  useEffect(() => {
    if (isSaving) setPendingImages(0); // Reset cuando empieza a guardar
  }, [isSaving]);

  const openWidget = () => {
    dispatch(setIsUploadingImages(true));
    window.cloudinary
      .createUploadWidget(
        {
          cloudName: cloudName,
          uploadPreset: uploadPreset,
        },
        (error, result) => {
          if (!error && result.event === "success") {
            console.log("Imagen subida: ", result.info.secure_url);
            setPendingImages((prev) => prev + 1); // Aumentar contador
            onUpload(result.info.secure_url); // Enviar imagen a la nota
          }
          dispatch(setIsUploadingImages(false));
        }
      )
      .open();
  };

  return (
    <Box display="flex" alignItems="center">
      <Tooltip title="Upload Image" arrow>
        <Badge
          badgeContent={pendingImages}
          color="error"
          overlap="circular"
          sx={{
            "& .MuiBadge-badge": {
              animation: pendingImages > 0 ? "pulse 1.5s infinite" : "none",
            },
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.1)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        >
          <IconButton
            type="button"
            onClick={openWidget}
            sx={{
              // padding: 2,
              // borderRadius: "12px",
              backgroundColor:
                pendingImages > 0 ? "rgba(255, 165, 0, 0.2)" : "transparent",
              transition: "background-color 0.3s ease, transform 0.2s",
              "&:hover": {
                backgroundColor: "rgba(255, 165, 0, 0.3)",
                transform: "scale(1.05)",
              },
              "&:disabled": {
                opacity: 0.5,
                cursor: "not-allowed",
              },
              bgcolor: "text.primary",
              color: "primary.main",
            }}
            disabled={isSaving}
          >
            <FileUploadIcon
              sx={{
                fontSize: 32,
                color: pendingImages > 0 ? "orange" : "inherit",
              }}
            />
          </IconButton>
        </Badge>
      </Tooltip>

      <Typography
        variant="h6"
        sx={{ ml: 1, fontWeight: 500, color: "text.primary" }}
      >
        Upload Image
      </Typography>
    </Box>
  );
};
