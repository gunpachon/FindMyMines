import { Server as Engine } from "@socket.io/bun-engine";
import { Server } from "socket.io";

const io = new Server();

const engine = new Engine({
  path: "/socket.io/",
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.bind(engine);

io.on("connection", (socket) => {
  // ...

  io.emit("activeConnections", io.of("/").sockets.size);

  socket.on("message", (name, message) => {
    io.emit("message", name, message);
  });

  socket.on("disconnect", () => {
    io.emit("activeConnections", io.of("/").sockets.size);
  });
});

export default {
  hostname: "0.0.0.0",
  port: 3000,
  // idleTimeout: 30, // must be greater than the "pingInterval" option of the engine, which defaults to 25 seconds
  ...engine.handler(),
};
