import { Server as Engine } from "@socket.io/bun-engine";
import { Server } from "socket.io";
import { registerAdminHandlers, registerHandlers } from "./handlers";

const io = new Server();

const engine = new Engine({
  path: "/socket.io/",
  cors: {
    origin: process.env.CORS_ORIGINS?.split(" ") ?? ["http://localhost:5173"],
  },
});

io.bind(engine);

function emitSize() {
  io.of("/admin").emit("clients", io.of("/").sockets.size);
}

io.on("connection", (socket) => {
  // game setup
  emitSize();

  registerHandlers(socket, io);

  //on reset
  // socket.on("reset", () => {
  //   const state = onReset(code);
  //   io.emit("resetGameState", state);
  // });

  //on disconnect -> not done
  socket.on("disconnect", () => {
    emitSize();
  });
});

io.of("/admin").on("connection", (socket) => {
  socket.emit("clients", io.of("/").sockets.size);

  registerAdminHandlers(socket, io);
});

export default {
  hostname: process.env.HOST ?? "0.0.0.0",
  port: process.env.PORT ?? 3000,
  // idleTimeout: 30, // must be greater than the "pingInterval" option of the engine, which defaults to 25 seconds
  ...engine.handler(),
};
