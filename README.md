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

## 📄 Licencia

MIT
