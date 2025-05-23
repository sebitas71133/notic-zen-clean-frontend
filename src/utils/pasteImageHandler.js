import { useEffect } from "react";

export const PasteImageHandler = ({ onImagePaste }) => {
  useEffect(() => {
    const handlePaste = (event) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let item of items) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageUrl = event.target.result;
            onImagePaste(imageUrl); // Llama a tu función para manejar la imagen (base64)
          };
          reader.readAsDataURL(file);
          break; // solo una imagen por paste
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [onImagePaste]);

  return null; // Este componente solo maneja el evento global
};
