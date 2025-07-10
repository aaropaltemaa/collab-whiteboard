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

let shapes: any[] = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send the current state
  socket.emit("init", shapes);

  socket.on("drawing", (data) => {
    // Remove any existing shape with the same id
    shapes = shapes.filter((s) => s.id !== data.shape.id);
    shapes.push(data.shape);
    socket.broadcast.emit("drawing", data);
  });

  socket.on("move-shape", (data) => {
    shapes[data.index] = data.shape;
    socket.broadcast.emit("move-shape", data);
  });

  socket.on("update-text", (data) => {
    const index = shapes.findIndex((s) => s.id === data.id);
    if (index !== -1) {
      shapes[index] = data.shape;
    }
    socket.broadcast.emit("update-text", data);
  });
});


server.listen(4000, () => {
  console.log("Backend listening on http://localhost:4000");
});
