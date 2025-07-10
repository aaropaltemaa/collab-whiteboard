import { useRef } from "react";
import type { Shape } from "../types";
import type { KonvaEventObject } from "konva/lib/Node";
import type { Socket } from "socket.io-client";
import { nanoid } from "nanoid";

export function useCanvasDrawing({
  shapes,
  setShapes,
  selectedTool,
  selectedColor,
  selectedStrokeWidth,
  socket,
  socketId,
}: {
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  selectedTool: "pen" | "rectangle" | "ellipse";
  selectedColor: string;
  selectedStrokeWidth: number;
  socket: React.MutableRefObject<Socket | null>;
  socketId: React.MutableRefObject<string | null>;
}) {
  const isDrawing = useRef(false);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (!clickedOnEmpty) return;

    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;

    isDrawing.current = true;

    if (selectedTool === "pen") {
      const newLine: Shape = {
        id: nanoid(),
        type: "line",
        points: [pos.x, pos.y],
        color: selectedColor,
        strokeWidth: selectedStrokeWidth,
      };
      setShapes((prev) => [...prev, newLine]);
    } else if (selectedTool === "rectangle") {
      const newRect: Shape = {
        id: nanoid(),
        type: "rectangle",
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        color: selectedColor,
        strokeWidth: selectedStrokeWidth,
      };
      setShapes((prev) => [...prev, newRect]);
    } else if (selectedTool === "ellipse") {
      const newEllipse: Shape = {
        id: nanoid(),
        type: "ellipse",
        x: pos.x,
        y: pos.y,
        radiusX: 0,
        radiusY: 0,
        color: selectedColor,
        strokeWidth: selectedStrokeWidth,
      };
      setShapes((prev) => [...prev, newEllipse]);
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;

    const lastShape = shapes[shapes.length - 1];
    if (!lastShape) return;

    if (lastShape.type === "line" && selectedTool === "pen") {
      const updatedLine: Shape = {
        ...lastShape,
        points: [...lastShape.points, pos.x, pos.y],
      };
      const updatedShapes = [...shapes.slice(0, -1), updatedLine];
      setShapes(updatedShapes);
    }

    if (lastShape.type === "rectangle" && selectedTool === "rectangle") {
      const updatedRect: Shape = {
        ...lastShape,
        width: pos.x - lastShape.x,
        height: pos.y - lastShape.y,
      };
      const updatedShapes = [...shapes.slice(0, -1), updatedRect];
      setShapes(updatedShapes);
    }

    if (lastShape.type === "ellipse" && selectedTool === "ellipse") {
      const updatedEllipse: Shape = {
        ...lastShape,
        radiusX: Math.abs(pos.x - lastShape.x),
        radiusY: Math.abs(pos.y - lastShape.y),
      };
      const updatedShapes = [...shapes.slice(0, -1), updatedEllipse];
      setShapes(updatedShapes);
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;

    const lastShape = shapes[shapes.length - 1];
    if (!lastShape) return;

    socket.current?.emit("drawing", {
      shape: lastShape,
      senderId: socketId.current,
    });
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
