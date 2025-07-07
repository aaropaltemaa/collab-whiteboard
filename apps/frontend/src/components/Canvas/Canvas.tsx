import { Stage, Layer } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useState, useRef } from "react";

type Line = {
  points: number[];
};

const Canvas = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const isDrawing = useRef(false);

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
    console.log(updatedLines)
  };

  return (
    <Stage
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ background: "#fff" }}
    >
      <Layer></Layer>
    </Stage>
  );
};

export default Canvas;
