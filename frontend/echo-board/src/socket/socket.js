import { io } from "socket.io-client";
import { BACKEND_URL } from "../config";

const socket = io(BACKEND_URL, {
  transports: ["polling", "websocket"],
  withCredentials: true,
});

export default socket;