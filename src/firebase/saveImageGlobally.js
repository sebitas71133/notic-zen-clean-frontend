import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore/lite";
import { Firestore } from "./config";

export const saveImageGlobally = (url, userEmail) => {
  return async (dispatch) => {
    try {
      const userImagesRef = doc(Firestore, "images", userEmail);
      const docSnap = await getDoc(userImagesRef);

      if (docSnap.exists()) {
        // Si el documento ya existe, agregamos la imagen al array
        await updateDoc(userImagesRef, {
          images: arrayUnion(url), // Evita duplicados
        });
      } else {
        // Si no existe, creamos el documento con la primera imagen
        await setDoc(userImagesRef, {
          images: [url], // Se inicializa el array con la primera imagen
          user: userEmail,
          createdAt: new Date().toISOString(),
        });
      }

      console.log("Imagen guardada en Firestore:", url);
    } catch (error) {
      console.error("Error al guardar imagen:", error);
    }
  };
};
