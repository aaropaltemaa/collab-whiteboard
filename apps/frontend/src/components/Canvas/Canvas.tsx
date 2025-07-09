import { Stage, Layer, Line, Rect, Ellipse } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useState, useRef, useEffect } from "react";
import io, { Socket } from "socket.io-client";

type Shape =
  | {
      type: "line";
      points: number[];
    }
  | {
      type: "rectangle";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "ellipse";
      x: number;
      y: number;
      radiusX: number;
      radiusY: number;
    };

const Canvas = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedTool, setSelectedTool] = useState<
    "pen" | "rectangle" | "ellipse"
  >("pen");
  const isDrawing = useRef(false);
  const socket = useRef<Socket | null>(null);
  const socketId = useRef<string | null>(null);

  useEffect(() => {
    socket.current = io("http://localhost:4000");

    socket.current.on("connect", () => {
      socketId.current = socket.current?.id ?? null;
      console.log("Connected to server, socket ID:", socketId.current);
    });

    socket.current.on("drawing", (data) => {
      if (data.senderId === socketId.current) {
        return;
      }

      const incomingShape: Shape = data.shape;

      setShapes((prevShapes) => [...prevShapes, incomingShape]);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;

    isDrawing.current = true;

    if (selectedTool === "pen") {
      const newLine: Shape = {
        type: "line",
        points: [pos.x, pos.y],
      };
      setShapes((prev) => [...prev, newLine]);
    } else if (selectedTool === "rectangle") {
      const newRect: Shape = {
        type: "rectangle",
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
      };
      setShapes((prev) => [...prev, newRect]);
    } else if (selectedTool === "ellipse") {
      const newEllipse: Shape = {
        type: "ellipse",
        x: pos.x,
        y: pos.y,
        radiusX: 0,
        radiusY: 0,
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
      const newWidth = pos.x - lastShape.x;
      const newHeight = pos.y - lastShape.y;
      const updatedRect: Shape = {
        ...lastShape,
        width: newWidth,
        height: newHeight,
      };
      const updatedShapes = [...shapes.slice(0, -1), updatedRect];
      setShapes(updatedShapes);
    }

    if (lastShape.type === "ellipse" && selectedTool === "ellipse") {
      const newRadiusX = Math.abs(pos.x - lastShape.x);
      const newRadiusY = Math.abs(pos.y - lastShape.y);

      const updatedEllipse: Shape = {
        ...lastShape,
        radiusX: newRadiusX,
        radiusY: newRadiusY,
      };

      const updatedShapes = [...shapes.slice(0, -1), updatedEllipse];
      setShapes(updatedShapes);
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;

    const lastShape = shapes[shapes.length - 1];
    if (!lastShape) return;

    if (socket.current) {
      socket.current.emit("drawing", {
        shape: lastShape,
        senderId: socketId.current,
      });
    }
  };

  return (
    <>
      <div className="flex gap-2 p-2 bg-gray-100 border-b border-gray-300">
        {["pen", "rectangle", "ellipse"].map((tool) => (
          <button
            key={tool}
            onClick={() =>
              setSelectedTool(tool as "pen" | "rectangle" | "ellipse")
            }
            className={`px-3 py-1 rounded ${
              selectedTool === tool
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            {tool.charAt(0).toUpperCase() + tool.slice(1)}
          </button>
        ))}
      </div>

      <Stage
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ background: "#fff" }}
      >
        <Layer>
          {shapes.map((shape, index) => {
            if (shape.type === "line") {
              return (
                <Line
                  key={index}
                  points={shape.points}
                  stroke="black"
                  strokeWidth={2}
                  lineCap="round"
                  lineJoin="round"
                />
              );
            }

            if (shape.type === "rectangle") {
              return (
                <Rect
                  key={index}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  stroke="black"
                  strokeWidth={2}
                />
              );
            }
            if (shape.type === "ellipse") {
              return (
                <Ellipse
                  key={index}
                  x={shape.x}
                  y={shape.y}
                  radiusX={shape.radiusX}
                  radiusY={shape.radiusY}
                  stroke="black"
                  strokeWidth={2}
                />
              );
            }

            return null;
          })}
        </Layer>
      </Stage>
    </>
  );
};

export default Canvas;
