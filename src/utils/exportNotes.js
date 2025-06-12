import jsPDF from "jspdf";
import * as XLSX from "xlsx";
// import "jspdf-autotable";

import JSZip from "jszip";
import { saveAs } from "file-saver";

export const exportJSON = (notes, subnotes) => {
  const data = {
    notas: notes,
    subnotas: subnotes,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mis-notas-y-subnotas.json";
  a.click();
  URL.revokeObjectURL(url);
};

export const exportNotesToPDF = async (notes, subnotes) => {
  const doc = new jsPDF();
  let y = 10;

  const addMultiLine = (
    text,
    x = 10,
    fontSize = 12,
    spacing = 6,
    maxWidth = 180
  ) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    for (const line of lines) {
      doc.text(line, x, y);
      y += spacing;
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    }
  };

  const addImage = async (url, alt = "Sin descripción") => {
    try {
      addMultiLine(`• ${alt}`, 15, 11, 6);
      addMultiLine(url, 15, 10, 6);

      const dataUrl = await getImageDataUrl(url);
      doc.addImage(dataUrl, "JPEG", 15, y, 40, 40);
      y += 45;

      if (y > 260) {
        doc.addPage();
        y = 10;
      }
    } catch {
      addMultiLine("(No se pudo cargar imagen)", 15, 10, 10);
    }
  };

  for (const note of notes) {
    addMultiLine(`📌 Título: ${note.title}`, 10, 14);
    addMultiLine(`Contenido: ${note.content}`);
    if (note.category?.name) addMultiLine(`Categoría: ${note.category.name}`);
    if (note.tags?.length)
      addMultiLine(`Tags: ${note.tags.map((t) => t.name).join(", ")}`);

    if (note.images?.length) {
      addMultiLine("Imágenes:");
      for (const img of note.images) {
        await addImage(img.url, img.altText);
      }
    }

    // Subnotas relacionadas
    const relatedSubnotes = subnotes.filter((s) => s.noteId === note.id);
    if (relatedSubnotes.length) {
      addMultiLine("Subnotas:", 10, 13);

      for (const sub of relatedSubnotes) {
        addMultiLine(`• ${sub.title}`, 15);
        addMultiLine(`  ${sub.description}`, 20);

        if (sub.tags?.length) {
          addMultiLine(`  Tags: ${sub.tags.map((t) => t.name).join(", ")}`, 20);
        }

        if (sub.images?.length) {
          for (const img of sub.images) {
            await addImage(img.url, img.altText);
          }
        }
        y += 6;
      }
    }

    y += 10;
  }

  doc.save("notas_y_subnotas.pdf");
};

export const exportNotesToExcel = (notes, subnotes) => {
  // Hoja de Notas
  const noteData = notes.map((note) => ({
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

  // Hoja de Subnotas
  const subnoteData = subnotes.map((sub) => ({
    Título: sub.title,
    Descripción: sub.description,
    ID_Nota_Padre: sub.noteId,
    Tags: sub.tags.map((t) => t.name).join(", "),
    Imágenes: sub.images.map((img) => img.url).join(", "),
    Archivado: sub.isArchived ? "Sí" : "No",
    Fijado: sub.isPinned ? "Sí" : "No",
    Fecha_Creación: new Date(sub.createdAt).toLocaleString(),
    Fecha_Actualización: new Date(sub.updatedAt).toLocaleString(),
  }));

  const wb = XLSX.utils.book_new();

  const noteSheet = XLSX.utils.json_to_sheet(noteData);
  XLSX.utils.book_append_sheet(wb, noteSheet, "Notas");

  const subnoteSheet = XLSX.utils.json_to_sheet(subnoteData);
  XLSX.utils.book_append_sheet(wb, subnoteSheet, "Subnotas");

  XLSX.writeFile(wb, "notas_y_subnotas.xlsx");
};

export const exportNotesAsZip = async (notes, subnotes) => {
  const zip = new JSZip();
  const imagesFolder = zip.folder("imagenes");

  // Guardamos el JSON de notas
  const notesJSON = JSON.stringify(notes, null, 2);
  zip.file("notas.json", notesJSON);

  // Guardamos el JSON de subnotas
  const subnotesJSON = JSON.stringify(subnotes, null, 2);
  zip.file("subnotas.json", subnotesJSON);

  // Descargar imágenes de las notas
  for (const note of notes) {
    for (const image of note.images) {
      try {
        const response = await fetch(image.url);
        const blob = await response.blob();

        const mime = blob.type;
        const extension = mime.split("/")[1];
        const filename = `nota_${image.id}.${extension}`;

        imagesFolder.file(filename, blob);
      } catch (error) {
        console.warn(`Error al descargar imagen de nota: ${image.url}`, error);
      }
    }
  }

  // Descargar imágenes de las subnotas
  for (const subnote of subnotes) {
    for (const image of subnote.images) {
      try {
        const response = await fetch(image.url);
        const blob = await response.blob();

        const mime = blob.type;
        const extension = mime.split("/")[1];
        const filename = `subnota_${image.id}.${extension}`;

        imagesFolder.file(filename, blob);
      } catch (error) {
        console.warn(
          `Error al descargar imagen de subnota: ${image.url}`,
          error
        );
      }
    }
  }

  // Generar y guardar el ZIP
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "mis-notas-y-subnotas.zip");
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
