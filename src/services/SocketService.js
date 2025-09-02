import { io } from "socket.io-client";

const SOCKET_URL = "ws://13.201.33.113:5000";

class SocketService {
  constructor() {
    this.socket = null;
  }

  initializeConnection(socketPayload) {
    if (this.socket) {
      console.warn("⚠ Socket already connected!");
      return;
    }

    this.socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      query: socketPayload,
    });

    this.socket.on("connect", () => {
      console.log("✅ Connected to socket server:", this.socket.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.warn("⚡ Disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("❗ Connection Error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      console.log("❗ Disconnecting socket...");
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emitEvent(event, data) {
    if (this.socket) {
      console.log(`📤 Emitting Event: ${event}`, data);
      this.socket.emit(event, data);
    }
  }

  onEvent(event, callback) {
    if (this.socket) {
      console.log(`👂 Listening for Event: ${event}`);
      this.socket.on(event, callback);
    }
  }

  offEvent(event) {
    if (this.socket) {
      console.log(`❌ Removing Listener for Event: ${event}`);
      this.socket.off(event);
    }
  }
}

export default new SocketService();
