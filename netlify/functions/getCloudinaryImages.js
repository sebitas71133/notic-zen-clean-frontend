import axios from "axios";

export const handler = async (event, context) => {
  const CLOUD_NAME = process.env.VITE_CLOUD_NAME;
  const API_KEY = process.env.VITE_CLOUD_API_KEY;
  const API_SECRET = process.env.VITE_CLOUD_API_SECRET;

  try {
    let allImages = [];
    let nextCursor = null;

    do {
      const response = await axios.get(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/upload?prefix=journal/&max_results=50${
          nextCursor ? `&next_cursor=${nextCursor}` : ""
        }`,
        {
          auth: { username: API_KEY, password: API_SECRET },
        }
      );

      allImages = [...allImages, ...response.data.resources];
      nextCursor = response.data.next_cursor; // Guarda el cursor para la siguiente página
    } while (nextCursor); // Si hay más imágenes, sigue iterando

    return {
      statusCode: 200,
      body: JSON.stringify(allImages.map((img) => img.secure_url)),
    };
  } catch (error) {
    console.error("Error obteniendo imágenes:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error obteniendo imágenes" }),
    };
  }
};
