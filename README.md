# 🖼️ Notes App - Frontend (React + Vite + MUI)

Este proyecto es la interfaz de usuario para la aplicación de notas, construida con **React 19**, **Vite**, **MUI**, **Redux Toolkit** y varias librerías modernas. Se conecta al backend a través de peticiones HTTP y permite a los usuarios registrar, autenticar, crear, editar, organizar y visualizar sus notas y subnotas.

---

## 🚀 Tecnologías principales

- React 19
- Vite
- MUI (Material UI)
- Redux Toolkit
- Framer Motion – animaciones
- React Hook Form – formularios
- jsPDF, xlsx, jszip, file-saver – exportar datos
- React Toastify, SweetAlert2 – notificaciones y alertas

---

### 🖼️ Vista previa de la aplicación

| Notes                                                                                     | Note                                                                                     | SubNote                                                                                     |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| ![Notes](https://github.com/user-attachments/assets/547d5ff1-4be2-43cf-8d21-1fc17fd8d24c) | ![Note](https://github.com/user-attachments/assets/83e56a73-90af-4ac4-93fb-c0fd91d2dabf) | ![SubNote](https://github.com/user-attachments/assets/e7b4555b-0d99-4baf-bd74-f44f84e1033c) |

| Dashboard                                                                                     | Categories                                                                                     | Tags                                                                                     |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| ![Dashboard](https://github.com/user-attachments/assets/78cf3707-4a4f-4e47-b508-a19c70114a5f) | ![Categories](https://github.com/user-attachments/assets/75dafe61-ef7a-4039-bb67-388b3251de29) | ![Tags](https://github.com/user-attachments/assets/4c4f562e-775e-45a3-a880-05d3a581c532) |

| Tools                                                                                     | Filtrado                                                                                     | Login                                                                                     |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![Tools](https://github.com/user-attachments/assets/19e3abfa-1561-4e1c-9ab0-c7222b41689a) | ![Filtrado](https://github.com/user-attachments/assets/d42cd775-45a4-4305-8696-77076e41f927) | ![Login](https://github.com/user-attachments/assets/2d96a276-997c-40bb-a015-80d4e8064398) |

### 🛠️ Vista previa del panel de administración

| Admin - User                                                                             | Admin - Dashboard                                                                             | Admin - Cloudinary                                                                             |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| ![User](https://github.com/user-attachments/assets/09337ee3-485c-46e9-a9c8-3e275ff12931) | ![Dashboard](https://github.com/user-attachments/assets/3ee78701-12d5-4073-bf70-0c7920502c93) | ![Cloudinary](https://github.com/user-attachments/assets/9c82596f-284b-459d-a7cc-b75f638c9cd4) |

---

## 📦 Instalación

1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/notes-frontend.git
cd notes-frontend
```

2. Instala las dependencias

```bash
npm install
```

3. Crea el archivo `.env`

```bash
cp .env.template .env
```

Edita el `.env` con la URL de tu backend y las claves necesarias.

Ejemplo:

```env

VITE_API_URL=https://notes-api.onrender.com

```

4. Levanta el proyecto

```bash
npm run dev
```

---

## 📘 Funcionalidades destacadas

- Registro y login
- Validación de email
- Gestión de notas y subnotas
- Etiquetas, categorías e imágenes
- Notas destacadas, archivadas y buscador
- Exportación a PDF, Excel, ZIP
- Animaciones con Framer Motion
- Toasts y alertas visuales

---

## 🧪 Scripts disponibles

| Comando           | Descripción                 |
| ----------------- | --------------------------- |
| `npm run dev`     | Modo desarrollo             |
| `npm run build`   | Compilación para producción |
| `npm run preview` | Previsualizar build local   |

---

## 🧩 Integraciones

- Autenticación JWT
- Backend propio desplegado en Render
- Exportaciones locales

---

## 🛠️ Autor

Jesús Sebastián Huamanculi Casavilca - GitHub

---

## 📄 Licencia

MIT
