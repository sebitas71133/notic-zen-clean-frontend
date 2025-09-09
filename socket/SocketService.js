// src/services/SocketService.js
import { io } from "socket.io-client";
import { store } from "../src/store/store";
import { notesApi } from "../services/noteApi";
import { toast } from "react-toastify";

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
      toast.info(`📩 Te compartieron una nota: ${payload?.title ?? ""}`);
      store.dispatch(notesApi.util.invalidateTags(["Notes"]));
    });

    this.socket.on("note:updated", (payload) => {
      console.log("sda");
      toast.info(`✏️ Una nota fue actualizada: ${payload?.title ?? ""}`);
      store.dispatch(notesApi.util.invalidateTags(["Notes"]));
    });

    this.socket.on("note:revoked", (payload) => {
      toast.warning(
        `🚫 Se revocó tu acceso a una nota: ${payload?.title ?? ""}`
      );
      store.dispatch(notesApi.util.invalidateTags(["Notes"]));
    });

    this.socket.on("note:deleted", (payload) => {
      console.log("🗑️ Nota eliminada:", payload);
      store.dispatch(notesApi.util.invalidateTags(["Notes"]));
    });
  }
}

// Exportamos una instancia única
const socketService = new SocketService(import.meta.env.VITE_SOCKET_URL);
export default socketService;
