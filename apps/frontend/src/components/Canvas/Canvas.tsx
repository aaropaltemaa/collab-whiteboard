import { Stage, Layer, Line } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useState, useRef, useEffect } from "react";
import io, { Socket } from "socket.io-client";

type Line = {
  points: number[];
};

const Canvas = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const isDrawing = useRef(false);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io("http://localhost:4000");

    socket.current.on("connect", () => {
      console.log("Connected to server");
    });

    socket.current.on("drawing", (data) => {
      console.log("Received drawing", data);

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
      });
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
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
  );
};

export default Canvas;
