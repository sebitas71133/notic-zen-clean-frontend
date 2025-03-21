import axios from "axios";
import crypto from "crypto"; // Necesario para firmar la petición

export const handler = async (event) => {
  const CLOUD_NAME = process.env.VITE_CLOUD_NAME;
  const API_KEY = process.env.VITE_CLOUD_API_KEY;
  const API_SECRET = process.env.VITE_CLOUD_API_SECRET;

  const { orphanImages } = JSON.parse(event.body); // Recibe la lista de imágenes huérfanas

  if (!orphanImages || orphanImages.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No hay imágenes para eliminar" }),
    };
  }

  try {
    for (const image of orphanImages) {
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = generateSignature(
        image.public_id,
        timestamp,
        API_SECRET
      );

      const formData = new URLSearchParams();
      formData.append("public_id", image.public_id);
      formData.append("api_key", API_KEY);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
        formData, // Enviar como `application/x-www-form-urlencoded`
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      console.log(`Imagen eliminada: ${image.public_id}`, response.data);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Imágenes eliminadas correctamente" }),
    };
  } catch (error) {
    console.error("Error eliminando imágenes:", error.response?.data || error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error eliminando imágenes" }),
    };
  }
};

// **Función para generar la firma de Cloudinary**
const generateSignature = (public_id, timestamp, api_secret) => {
  const stringToSign = `public_id=${public_id}&timestamp=${timestamp}${api_secret}`;
  return crypto.createHash("sha1").update(stringToSign).digest("hex");
};
