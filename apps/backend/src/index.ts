import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

    socket.on("drawing", (data) => {
    // Broadcast to all other clients
    socket.broadcast.emit("drawing", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
  socket.on("move-shape", (data) => {
    socket.broadcast.emit("move-shape", data);
});

});

server.listen(4000, () => {
  console.log("Backend listening on http://localhost:4000");
});
