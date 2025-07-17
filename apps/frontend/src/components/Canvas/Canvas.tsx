import { Stage, Layer } from "react-konva";
import { useState, useRef } from "react";
import { nanoid } from "nanoid";
import Konva from "konva";
import type { Shape } from "../../types";
import NavBar from "../NavBar";
import ShapeRenderer from "./ShapeRenderer";

const Canvas = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedTool, setSelectedTool] = useState<
    "rectangle" | "pen" | "ellipse"
  >("rectangle");
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState<number>(2);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const isDrawing = useRef(false);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Ignore clicks on existing shapes
    if (e.target !== e.target.getStage() && selectedTool !== "pen") return;

    const stage = e.target.getStage();
    if (!stage) return;
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    if (selectedTool === "rectangle") {
      const newRect = {
        id: nanoid(),
        type: "rectangle" as const,
        x: pointerPosition.x,
        y: pointerPosition.y,
        color: selectedColor,
        strokeWidth: selectedStrokeWidth,
      };
      setShapes((prev) => [...prev, newRect]);
    }

    if (selectedTool === "pen") {
      const newLine = {
        id: nanoid(),
        type: "line" as const,
        points: [pointerPosition.x, pointerPosition.y],
        color: selectedColor,
        strokeWidth: selectedStrokeWidth,
      };
      setShapes((prev) => [...prev, newLine]);
      isDrawing.current = true;
    }

    if (selectedTool === "ellipse") {
      const newEllipse = {
        id: nanoid(),
        type: "ellipse" as const,
        x: pointerPosition.x,
        y: pointerPosition.y,
        radiusX: 0,
        radiusY: 0,
        color: selectedColor,
        strokeWidth: selectedStrokeWidth,
      };
      setShapes((prev) => [...prev, newEllipse]);
      isDrawing.current = true;
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
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

    if (isDrawing.current && selectedTool === "ellipse") {
      const lastShape = shapes[shapes.length - 1];

      if (lastShape && lastShape.type === "ellipse") {
        const newRadiusX = Math.abs(pointerPosition.x - lastShape.x);
        const newRadiusY = Math.abs(pointerPosition.y - lastShape.y);

        const updatedEllipse = {
          ...lastShape,
          radiusX: newRadiusX,
          radiusY: newRadiusY,
        };
        setShapes([...shapes.slice(0, -1), updatedEllipse]);
      }
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleShapeSelect = (shapeId: string) => {
    setSelectedShapeId(shapeId);
  };

  const handleShapeDragEnd = (updatedShape: Shape) => {
    setShapes((prev) =>
      prev.map((s) => (s.id === updatedShape.id ? updatedShape : s))
    );
  };

  return (
    <>
      <NavBar
        selectedTool={selectedTool}
        selectedColor={selectedColor}
        setSelectedTool={setSelectedTool}
        setSelectedColor={setSelectedColor}
        selectedStrokeWidth={selectedStrokeWidth}
        setSelectedStrokeWidth={setSelectedStrokeWidth}
      />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {shapes.map((shape) => (
            <ShapeRenderer
              key={shape.id}
              shape={shape}
              isSelected={shape.id === selectedShapeId}
              onSelect={() => handleShapeSelect(shape.id)}
              onDragEnd={handleShapeDragEnd}
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
};

export default Canvas;
