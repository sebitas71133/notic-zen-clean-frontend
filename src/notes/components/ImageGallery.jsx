import { useSelector } from "react-redux";
import ReactImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { Loading } from "../../components/Loading";
import { useEffect, useState } from "react";

export const ImageGallery = ({ onDelete }) => {
  const { active, isDeletingImage } = useSelector((state) => state.journal);

  const [visibles, setVisibles] = useState();

  const handleDeleteImage = (url) => {
    setVisibles((state) => state.filter((img) => img !== url));
    onDelete(url);
  };

  useEffect(() => {
    setVisibles(active?.imagesUrls || []);
  }, [active]);

  const renderItem = (item) => (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img src={item.original} alt="Imagen" style={{ width: "100%" }} />

      <IconButton
        onClick={() => handleDeleteImage(item.original)}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          bgcolor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          "&:hover": { bgcolor: "red" },
        }}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );

  const images = visibles?.map((url) => ({
    original: url,
    thumbnail: url,

    thumbnailWidth: 80,
    thumbnailHeight: 80,
    thumbnailLoading: "lazy",
  }));

  return isDeletingImage ? (
    <Loading />
  ) : (
    images?.length !== 0 && (
      <ReactImageGallery
        showBullets={true}
        items={images || []}
        thumbnailPosition={"top"}
        renderItem={renderItem}
      />
    )
  );
};
