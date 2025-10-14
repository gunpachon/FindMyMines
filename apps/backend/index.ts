import { Server as Engine } from "@socket.io/bun-engine";
import { Server } from "socket.io";
import { onClick, onCreate, onJoin, onReset } from "./functions";

const io = new Server();

const engine = new Engine({
  path: "/socket.io/",
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.bind(engine);

io.on("connection", (socket) => {
  // game setup
  io.emit("activeConnections", io.of("/").sockets.size);
  console.log(`# of Connected Clients: ${io.of("/").sockets.size}`);

  //on start
  socket.on("join", async (name: string, code: string) => {
    const state = onJoin(socket, name, code); //how to connect -> to be discussed

    const socketsInRoom = io.sockets.adapter.rooms.get(code)?.size;

    console.log(socketsInRoom);

    if (socketsInRoom !== undefined && socketsInRoom >= 2) {
      socket.emit("error", "too many clients");
    } else {
      socket.join(code);
      io.to(code).emit("gameState", state);
    }
  });

  //on create
  socket.on("create", (mode: string) => {
    const state = onCreate(mode);
    socket.emit("created", state?.code);
  });

  //on click
  socket.on("click", () => {
    const state = onClick(code, socket, tileIndex);
    io.emit("clickState", state);
  });

  //on reset
  socket.on("reset", () => {
    const state = onReset(code);
    io.emit("resetGameState", state);
  });

  //on disconnect -> not done
  socket.on("disconnect", () => {
    io.emit("activeConnections", io.of("/").sockets.size);
    console.log(`# of Connected Clients: ${io.of("/").sockets.size}`);
  });
});

export default {
  hostname: "0.0.0.0",
  port: 3000,
  // idleTimeout: 30, // must be greater than the "pingInterval" option of the engine, which defaults to 25 seconds
  ...engine.handler(),
};
