import { Server as Engine } from "@socket.io/bun-engine";
import { Server } from "socket.io";
import { registerHandlers } from "./handlers";

const io = new Server();

const engine = new Engine({
  path: "/socket.io/",
  cors: {
    origin: ["http://localhost:5173", "https://bemine.ideal.sh"],
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
});

export default {
  hostname: "0.0.0.0",
  port: 3000,
  // idleTimeout: 30, // must be greater than the "pingInterval" option of the engine, which defaults to 25 seconds
  ...engine.handler(),
};
