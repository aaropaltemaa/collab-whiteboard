import { Stage, Layer } from "react-konva";
import { useState, useRef } from "react";
import Toolbar from "./Toolbar";
import ShapeRenderer from "./ShapeRenderer";
import TextEditorOverlay from "./TextEditorOverlay";
import { nanoid } from "nanoid";
import type { Shape } from "../../types";
import { useShapesSocket } from "../../hooks/useShapesSocket";
import type { KonvaEventObject } from "konva/lib/Node";

const Canvas = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedTool, setSelectedTool] = useState<
    "pen" | "rectangle" | "ellipse"
  >("pen");
  const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(
    null
  );
  const [editingShapeIndex, setEditingShapeIndex] = useState<number | null>(
    null
  );
  const [editingText, setEditingText] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState<number>(2);

  const isDrawing = useRef(false);
  const { socket, socketId } = useShapesSocket(setShapes);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    // Skip if clicking an existing shape
    const clickedOnEmpty = e.target === e.target.getStage();
    if (!clickedOnEmpty) {
      return;
    }

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

  const shapeBeingEdited =
    editingShapeIndex !== null ? shapes[editingShapeIndex] : null;

  return (
    <>
      <Toolbar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedStrokeWidth={selectedStrokeWidth}
        setSelectedStrokeWidth={setSelectedStrokeWidth}
      />

      <Stage
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ background: "#fff" }}
      >
        <Layer>
          {shapes.map((shape) => (
            <ShapeRenderer
              key={shape.id}
              shape={shape}
              isSelected={
                selectedShapeIndex !== null &&
                shapes[selectedShapeIndex]?.id === shape.id
              }
              onSelect={() =>
                setSelectedShapeIndex(
                  shapes.findIndex((s) => s.id === shape.id)
                )
              }
              onDoubleClick={() => {
                setEditingShapeIndex(
                  shapes.findIndex((s) => s.id === shape.id)
                );
                setEditingText(shape.text || "");
              }}
              onDragEnd={(updated: Shape) => {
                setShapes((prev) =>
                  prev.map((s) => (s.id === updated.id ? updated : s))
                );

                socket.current?.emit("move-shape", {
                  id: updated.id,
                  shape: updated,
                  senderId: socketId.current,
                });
              }}
            />
          ))}
        </Layer>
      </Stage>
      {editingShapeIndex !== null && shapeBeingEdited !== null && (
        <TextEditorOverlay
          editingShapeIndex={editingShapeIndex as number}
          shape={shapeBeingEdited as Shape}
          editingText={editingText}
          setEditingText={setEditingText}
          setEditingShapeIndex={setEditingShapeIndex}
          setShapes={setShapes}
          socket={socket.current}
          socketId={socketId.current}
        />
      )}
    </>
  );
};

export default Canvas;
