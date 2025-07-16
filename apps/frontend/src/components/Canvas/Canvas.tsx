import { Stage, Layer, Rect, Line } from "react-konva";
import { useState, useRef } from "react";
import { nanoid } from "nanoid";
import Konva from "konva";
import type { Shape } from "../../types";
import NavBar from "../NavBar";

const Canvas = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedTool, setSelectedTool] = useState<"rectangle" | "pen">(
    "rectangle"
  );
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const isDrawing = useRef(false);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Ignore clicks on existing shapes
    if (e.target !== e.target.getStage()) return;

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    if (selectedTool === "rectangle") {
      const newRect = {
        id: nanoid(),
        type: "rectangle" as const,
        x: pointerPosition.x,
        y: pointerPosition.y,
        color: selectedColor,
      };
      setShapes((prev) => [...prev, newRect]);
    }

    if (selectedTool === "pen") {
      const newLine = {
        id: nanoid(),
        type: "line" as const,
        points: [pointerPosition.x, pointerPosition.y],
        color: selectedColor,
      };
      setShapes((prev) => [...prev, newLine]);
      isDrawing.current = true;
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) return;

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    if (isDrawing.current && selectedTool === "pen") {
      const lastShape = shapes[shapes.length - 1];

      if (lastShape && lastShape.type === "line") {
        const updatedLine = {
          ...lastShape,
          points: [...lastShape.points, pointerPosition.x, pointerPosition.y],
        };

        setShapes((prev) => [...prev.slice(0, -1), updatedLine]);
      }
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <>
      <NavBar
        selectedColor={selectedColor}
        setSelectedTool={setSelectedTool}
        setSelectedColor={setSelectedColor}
      />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {shapes.map((shape) => {
            if (shape.type === "rectangle")
              return (
                <Rect
                  key={shape.id}
                  x={shape.x}
                  y={shape.y}
                  width={200}
                  height={100}
                  fill={shape.color}
                  draggable
                  onDragEnd={(e) => {
                    const pos = e.target.position();
                    setShapes((prev) =>
                      prev.map((s) =>
                        s.id === shape.id ? { ...s, x: pos.x, y: pos.y } : s
                      )
                    );
                  }}
                />
              );
            if (shape.type === "line")
              return (
                <Line
                  key={shape.id}
                  points={shape.points}
                  stroke={shape.color}
                  strokeWidth={2}
                />
              );

            return null; // Add return null for other shape types
          })}
        </Layer>
      </Stage>
    </>
  );
};

export default Canvas;
