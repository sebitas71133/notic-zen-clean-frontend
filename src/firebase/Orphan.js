import {
  collection,
  getDocs,
  query,
  where,
  deleteField,
  updateDoc,
} from "firebase/firestore/lite";
import { Firestore } from "./config";

export const getOrphanImages = async () => {
  try {
    const orphanImages = [];
    const userImages = [];
    let totalImages = 0;

    const imagesRef = collection(Firestore, "images");
    const imagesSnapshot = await getDocs(imagesRef);

    const usersRef = collection(Firestore, "users");
    const usersSnapshot = await getDocs(usersRef);
    const users = usersSnapshot.docs.map((doc) => ({
      email: doc.data().email,
      uid: doc.id,
    }));

    for (const docSnap of imagesSnapshot.docs) {
      const imagesArray = docSnap.data().images || [];
      totalImages += imagesArray.length;

      for (const imageUrl of imagesArray) {
        let found = false;

        for (const user of users) {
          const notesRef = collection(Firestore, `${user.email}/journal/notes`);
          const q = query(
            notesRef,
            where("imagesUrls", "array-contains", imageUrl)
          );
          const notesSnapshot = await getDocs(q);

          if (!notesSnapshot.empty) {
            found = true;
            userImages.push({ email: user.email, url: imageUrl });
            break;
          }
        }

        if (!found) {
          // 🔥 Extraer el public_id desde la URL de Cloudinary
          const publicId = extractPublicId(imageUrl);
          orphanImages.push({ url: imageUrl, public_id: publicId });
        }
      }
    }

    return { orphanImages, userImages, totalImages };
  } catch (error) {
    console.error("❌ Error obteniendo imágenes:", error);
    return { orphanImages: [], userImages: [], totalImages: 0 };
  }
};

// 🛠️ Función para extraer el public_id de una URL de Cloudinary
const extractPublicId = (imageUrl) => {
  const regex = /\/upload\/v\d+\/(.+)\./;
  const match = imageUrl.match(regex);
  return match ? match[1] : null; // Retorna el public_id sin la extensión
};

export const deleteOrphanImagesFromFirestore = async (orphanImages) => {
  if (!orphanImages || orphanImages.length === 0) {
    console.log("✅ No hay imágenes huérfanas en Firestore para eliminar.");
    return;
  }

  console.log("🔍 Lista de imágenes huérfanas detectadas:", orphanImages);

  try {
    const imagesRef = collection(Firestore, "images");
    const imagesSnapshot = await getDocs(imagesRef);

    for (const docSnap of imagesSnapshot.docs) {
      const docRef = docSnap.ref;
      const imagesArray = docSnap.data().images || [];

      console.log(`📂 Revisando documento: ${docRef.id}`);
      console.log("🔹 Imágenes en Firestore:", imagesArray);

      // Verifica si las imágenes de Firestore están en la lista de huérfanas
      const filteredImages = imagesArray.filter(
        (imageUrl) =>
          !orphanImages.some((orphan) => imageUrl.includes(orphan.public_id))
      );

      console.log("🔻 Imágenes después de filtrar:", filteredImages);

      if (filteredImages.length === 0) {
        await updateDoc(docRef, { images: deleteField() });
        console.log(`🗑️ Eliminado campo "images" en documento: ${docRef.id}`);
      } else if (filteredImages.length !== imagesArray.length) {
        await updateDoc(docRef, { images: filteredImages });
        console.log(
          `🗑️ Eliminadas imágenes huérfanas en documento: ${docRef.id}`
        );
      }
    }

    console.log(
      "✅ Imágenes huérfanas eliminadas de Firestore en todos los documentos."
    );
  } catch (error) {
    console.error(
      "❌ Error eliminando imágenes huérfanas de Firestore:",
      error
    );
  }
};
