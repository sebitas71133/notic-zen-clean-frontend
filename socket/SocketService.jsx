// src/services/SocketService.js
import { io } from "socket.io-client";
import { store } from "../src/store/store";
import { notesApi } from "../services/noteApi";
import { toast } from "react-toastify";
import { Avatar, Typography, Box } from "@mui/material";
import { setActiveNote, setActiveSubNote } from "../src/store/slices/noteSlice";

export class SocketService {
  socket = null;
  socket_url = "";

  constructor(socket_url) {
    this.socket = null;
    this.socket_url = socket_url;
  }

  connect(userId) {
    if (this.socket) return; // evita conectar 2 veces

    this.socket = io(this.socket_url, {
      autoConnect: true,
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      //   console.log("✅ Conectado:", this.socket.id);
      this.socket.emit("auth", userId); // 🔹 unirse a su room
    });

    this.registerEvents();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("❌ Socket desconectado");
    }
  }

  registerEvents() {
    this.socket.on("connect", () => {
      toast.success("Bienvenido Nuevamente");
    });

    this.socket.on("disconnect", () => {
      toast.error("❌ Desconectado del servidor WebSocket");
    });

    this.socket.on("note:shared", (payload) => {
      toast(
        <div style={{ display: "flex", alignItems: "center" }}>
          {payload.noteImage && (
            <img
              src={payload.noteImage}
              alt="note thumbnail"
              style={{
                width: 40,
                height: 40,
                objectFit: "cover",
                borderRadius: 6,
                marginRight: 8,
              }}
            />
          )}
          <div>
            <strong>{payload.senderName}</strong> te compartió la nota:
            <div style={{ fontWeight: "bold" }}>{payload.noteTitle}</div>
          </div>
        </div>,
        { type: "info" }
      );

      store.dispatch(notesApi.util.invalidateTags(["Notes", "Notifications"]));
    });

    this.socket.on("note:updated", (payload) => {
      toast.info(
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Imagen de la nota */}
          {payload.images?.length > 0 && (
            <Avatar
              src={payload.images[0].url}
              alt="Note Thumbnail"
              variant="square"
              sx={{ width: 40, height: 40, borderRadius: 1 }}
            />
          )}

          {/* Info de la notificación */}
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              ✏️ NOTA : {payload.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Actualizada por {payload.currentUser?.email || "Alguien"}
            </Typography>
          </Box>
        </Box>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        }
      );

      // refresca lista
      store.dispatch(notesApi.util.invalidateTags(["Notes", "Notifications"]));

      // refresca nota activa si coincide
      const state = store.getState();
      const { activeNote } = state.note;

      if (activeNote && activeNote.id === payload.id) {
        store.dispatch(
          setActiveNote({
            ...activeNote,
            title: payload.title,
            categoryId: payload.category.id,
            content: payload.content,
            isPinned: payload.isPinned,
            isArchived: payload.isArchived,
            tags: payload.tags,
            images: payload.images,
            updatedAt: new Date().toISOString(),
          })
        );
      }
    });

    this.socket.on("note:role", (payload) => {
      toast.info(
        `Tu rol en la nota: ${payload?.note ?? ""} ahora es ${payload?.role}`
      );
      store.dispatch(notesApi.util.invalidateTags(["Notes"]));
    });

    this.socket.on("note:revoked", (payload) => {
      toast.warning(
        `🚫 Se revocó tu acceso a una nota: ${payload?.title ?? ""}`
      );
      store.dispatch(notesApi.util.invalidateTags(["Notes"]));
    });

    this.socket.on("note:deleted", (payload) => {
      toast.warning(
        `🚫 La nota compartida: ${
          payload?.title ?? ""
        } fue eliminada por el dueño : ${payload?.revokedBy}`
      );
      store.dispatch(notesApi.util.invalidateTags(["Notes"]));
    });

    //Subnote

    this.socket.on("subnote:updated", (payload) => {
      toast.info(
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Imagen de la subnota */}
          {payload.images?.length > 0 && (
            <Avatar
              src={payload.images[0].url}
              alt="SubNote Thumbnail"
              variant="square"
              sx={{ width: 40, height: 40, borderRadius: 1 }}
            />
          )}

          {/* Info de la notificación */}
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              ✏️ SUBNOTA : {payload.title || "Subnota sin título"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Actualizada por {payload.owner?.email || "Alguien"}
            </Typography>
          </Box>
        </Box>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        }
      );

      // refresca lista de subnotas
      store.dispatch(
        notesApi.util.invalidateTags(["SubNotes", "Notifications"])
      );

      // refresca subnota activa si coincide
      const state = store.getState();
      const { activeSubNote } = state.note;

      console.log({ activeSubNote });

      if (activeSubNote && activeSubNote.id === payload.subNoteId) {
        store.dispatch(
          setActiveSubNote({
            ...activeSubNote,
            title: payload.title,
            description: payload.description,
            isPinned: payload.isPinned,
            isArchived: payload.isArchived,
            tags: payload.tags,
            images: payload.images,
            code: payload.code,
            updatedAt: new Date().toISOString(),
          })
        );
      }
    });

    // //NOTIFICATIONS

    // this.socket.on("notification:new", (payload) => {
    //   store.dispatch(notesApi.util.invalidateTags(["Notifications"]));
    // });
  }
}

// Exportamos una instancia única
const socketService = new SocketService(import.meta.env.VITE_SOCKET_URL);
export default socketService;
