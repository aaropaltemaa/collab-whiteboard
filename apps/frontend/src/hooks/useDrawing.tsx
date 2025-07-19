import { useState, useRef } from "react";
import { nanoid } from "nanoid";
import Konva from "konva";
import type { Shape } from "../types";

const useDrawing = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedTool, setSelectedTool] = useState<
    "rectangle" | "pen" | "ellipse" | "connector"
  >("rectangle");
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState<number>(2);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [editingShapeId, setEditingShapeId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");
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

  const handleShapeDoubleClick = (shapeId: string) => {
    const shape = shapes.find((s) => s.id === shapeId);
    if (shape && (shape.type === "rectangle" || shape.type === "ellipse")) {
      setEditingShapeId(shapeId);
      setEditingText(shape.text || "");
    }
  };

  const handleTextSave = (shapeId: string, text: string) => {
    setShapes((prev) =>
      prev.map((s) => (s.id === shapeId ? { ...s, text } : s))
    );
    setEditingShapeId(null);
    setEditingText("");
  };

  const handleTextCancel = () => {
    setEditingShapeId(null);
    setEditingText("");
  };

  return {
    // State
    shapes,
    selectedTool,
    selectedColor,
    selectedStrokeWidth,
    selectedShapeId,
    editingShapeId,
    editingText,

    // Setters
    setSelectedTool,
    setSelectedColor,
    setSelectedStrokeWidth,
    setEditingText,

    // Event handlers
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleShapeSelect,
    handleShapeDragEnd,
    handleShapeDoubleClick,
    handleTextSave,
    handleTextCancel,
  };
};

export default useDrawing;
