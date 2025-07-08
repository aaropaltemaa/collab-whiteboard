import { Stage, Layer, Line } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useState, useRef, useEffect } from "react";
import io, { Socket } from "socket.io-client";

type Line = {
  points: number[];
};

const Canvas = () => {
  const [lines, setLines] = useState<Line[]>([]);
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
        // Ignore our own drawing
        return;
      }

      // Append the incoming line to state
      setLines((prevLines) => [...prevLines, { points: data.points }]);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const newLine: Line = { points: [pos.x, pos.y] };
    setLines([...lines, newLine]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    // if we're not drawing, exit
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    if (!stage) return;
    const point = stage.getPointerPosition();
    if (!point) return;

    // Get the last line
    const lastLine = lines[lines.length - 1];

    // Add new point to its points array
    const updatedLine = {
      ...lastLine,
      points: [...lastLine.points, point.x, point.y],
    };

    // Replace the last line with the updated one
    const updatedLines = [...lines.slice(0, -1), updatedLine];

    setLines(updatedLines);
    if (socket.current) {
      socket.current.emit("drawing", {
        points: updatedLine.points,
        senderId: socketId.current,
      });
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
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
          {lines.map((line, index) => (
            <Line
              key={index}
              points={line.points}
              stroke="black"
              strokeWidth={2}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
};

export default Canvas;
