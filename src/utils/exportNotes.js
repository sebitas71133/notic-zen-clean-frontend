import jsPDF from "jspdf";
import * as XLSX from "xlsx";
// import "jspdf-autotable";

import JSZip from "jszip";
import { saveAs } from "file-saver";

export const exportJSON = (notes) => {
  const blob = new Blob([JSON.stringify(notes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mis-notas.json";
  a.click();
  URL.revokeObjectURL(url);
};

export const exportNotesToPDF = async (notes) => {
  const doc = new jsPDF();
  let y = 10;

  for (const note of notes) {
    doc.setFontSize(14);
    doc.text(`Título: ${note.title}`, 10, y);
    y += 8;

    doc.setFontSize(12);
    doc.text(`Contenido: ${note.content}`, 10, y);
    y += 8;

    if (note.category?.name) {
      doc.text(`Categoría: ${note.category.name}`, 10, y);
      y += 8;
    }

    if (note.tags?.length) {
      doc.text(`Tags: ${note.tags.map((tag) => tag.name).join(", ")}`, 10, y);
      y += 8;
    }

    if (note.images?.length) {
      doc.text(`Imágenes:`, 10, y);
      y += 6;

      for (const img of note.images) {
        try {
          doc.text(`• ${img.altText || "Sin descripción"}`, 15, y);
          y += 6;

          doc.text(img.url, 15, y);
          y += 6;

          const dataUrl = await getImageDataUrl(img.url);
          doc.addImage(dataUrl, "JPEG", 15, y, 40, 40); // ajusta tamaño aquí
          y += 45;

          if (y > 260) {
            doc.addPage();
            y = 10;
          }
        } catch (error) {
          doc.text(`(No se pudo cargar imagen)`, 15, y);
          y += 10;
        }
      }
    }

    y += 10;
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  }

  doc.save("mis-notas.pdf");
};

export const exportNotesToExcel = (notes) => {
  const data = notes.map((note) => ({
    Título: note.title,
    Contenido: note.content,
    Categoría: note.category?.name || "",
    Tags: note.tags.map((t) => t.name).join(", "),
    Imágenes: note.images.map((img) => img.url).join(", "),
    Archivado: note.isArchived ? "Sí" : "No",
    Fijado: note.isPinned ? "Sí" : "No",
    Fecha_Creación: new Date(note.createdAt).toLocaleString(),
    Fecha_Actualización: new Date(note.updatedAt).toLocaleString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Notas");

  XLSX.writeFile(workbook, "notas.xlsx");
};

export const exportNotesAsZip = async (notes) => {
  const zip = new JSZip();
  const imagesFolder = zip.folder("imagenes");

  // Guardamos el JSON completo
  const notesJSON = JSON.stringify(notes, null, 2);
  zip.file("notas.json", notesJSON);

  // Recorremos todas las notas
  for (const note of notes) {
    for (const image of note.images) {
      try {
        const response = await fetch(image.url);
        const blob = await response.blob();

        // Extraemos el nombre de la imagen desde la URL o el publicId
        const mime = blob.type; // ej: "image/jpeg"
        const extension = mime.split("/")[1]; // ej: "jpeg"
        const filename = `imagen_${image.id}.${extension}`;

        imagesFolder.file(filename, blob);
      } catch (error) {
        console.warn(`Error al descargar imagen: ${image.url}`, error);
      }
    }
  }

  // Generar y guardar el zip
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "notas_completas.zip");
};

const getImageDataUrl = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // evita errores de CORS si es posible
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg");
        resolve(dataUrl);
      } else {
        reject("Canvas context null");
      }
    };
    img.onerror = (err) => reject(err);
  });
};
