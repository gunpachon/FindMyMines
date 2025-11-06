import { Context } from "runed";
import type { Socket } from "socket.io-client";

export const socketContext = new Context<Socket | null>("socket");
export const statusContext = new Context<{ connected: boolean }>("status");
