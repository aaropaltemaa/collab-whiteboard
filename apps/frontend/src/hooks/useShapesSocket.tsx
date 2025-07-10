import { useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import type { Shape } from "../types";

export function useShapesSocket(
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>
) {
  const socket = useRef<Socket | null>(null);
  const socketId = useRef<string | null>(null);

  useEffect(() => {
    socket.current = io("http://localhost:4000");

    socket.current.on("connect", () => {
      socketId.current = socket.current?.id ?? null;
      console.log("Connected to server, socket ID:", socketId.current);
    });

    socket.current.on("init", (serverShapes) => {
      setShapes(serverShapes);
    });

    socket.current.on("drawing", (data) => {
      if (data.senderId === socketId.current) return;
      setShapes((prev) => {
        const exists = prev.some((s) => s.id === data.shape.id);
        if (exists) {
          return prev.map((s) => (s.id === data.shape.id ? data.shape : s));
        } else {
          return [...prev, data.shape];
        }
      });
    });

    socket.current.on("move-shape", (data) => {
      if (data.senderId === socketId.current) return;
      setShapes((prev) => prev.map((s) => (s.id === data.id ? data.shape : s)));
    });

    socket.current.on("update-text", (data) => {
      if (data.senderId === socketId.current) return;
      setShapes((prev) => prev.map((s) => (s.id === data.id ? data.shape : s)));
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [setShapes]);

  return { socket, socketId };
}
