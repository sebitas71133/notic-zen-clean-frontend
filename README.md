# 🧘‍♂️ ZenNotes - App de Notas Visuales

**ZenNotes** es una aplicación web para tomar notas con texto e imágenes. Está pensada para quienes desean organizar ideas, registrar eventos o simplemente documentar cosas importantes con una interfaz clara y elegante. Cada nota incluye un título, contenido enriquecido y una galería de imágenes.

---

## ✨ Características

- 📝 Editor de notas con título y cuerpo
- 📸 Subida de imágenes a Cloudinary
- 🖼️ Galería integrada para cada nota
- 🗑️ Elimina imágenes almacenadas en Cloudinary (con funciones de Netlify)
- 📂 Gestión de múltiples notas con navegación lateral
- 🌓 Tema oscuro estético y profesional

---

## 🛠️ Tecnologías utilizadas

- **React 19** + **React DOM**
- **Redux Toolkit** (gestión de estado global)
- **MUI** (Material UI para componentes estilizados)
- **React Hook Form** (manejo eficiente de formularios)
- **Cloudinary API** (almacenamiento y gestión de imágenes)
- **Netlify Functions** (para cargar y borrar imágenes de forma segura)
- **SweetAlert2** (modales de confirmación)
- **React Router DOM 7**
- **React Image Gallery** (visualización de imágenes)

---

## 📦 Instalación y ejecución


### 2️⃣ Instala las dependencias:
```bash
npm install
```

### 3️⃣ Configura las variables de entorno : 
Crea un archivo .env en la raíz del proyecto con lo siguiente:
```bash
VITE_FIREBASE_API_KEY = ""
VITE_AUTH_DOMAIN =  ""
VITE_PROJECT_ID = ""
VITE_STORAGE_BUCKET=""
VITE_MESSAGING_SENDER_ID= ""
VITE_APP_ID= ""


VITE_CLOUD_NAME = ""
VITE_CLOUD_API_KEY = ""
VITE_CLOUD_API_SECRET = ""
VITE_CLOUD_UPLOAD_PRESET = ""
```

### 4️⃣ Ejecuta la app en desarrollo:
```bash
npm run dev
```

## 🎨 Capturas de pantalla  



<div align="center">
  <img src="https://github.com/user-attachments/assets/a64b4c4f-0143-4401-88c1-268e896cfb1d" width="45%" />
  <img src="https://github.com/user-attachments/assets/d729cbb8-39b2-429b-ae0e-e4331236deba" width="45%" />
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/441f44de-9370-40cb-96a0-0b84624733eb" width="45%" />
  <img src="https://github.com/user-attachments/assets/0751de89-9e7d-4a03-93ea-9b0ff3872bbe" width="45%" />
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/7bdb1c20-5562-431f-9b84-51a15099601e" width="45%" />
  <img src="https://github.com/user-attachments/assets/143388ef-46e6-4000-ad57-5efc74a16929" width="45%" />
</div>


## 🌍 Demo en producción

🚀 **Live Demo**: [otic-zen.netlify.app](https://notic-zen.netlify.app/)

## 🛠️ Autor
Jesús Sebastián Huamanculi Casavilca - GitHub
