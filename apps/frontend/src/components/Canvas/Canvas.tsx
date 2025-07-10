import { Stage, Layer } from "react-konva";
import { useState } from "react";
import Toolbar from "./Toolbar";
import ShapeRenderer from "./ShapeRenderer";
import TextEditorOverlay from "./TextEditorOverlay";
import type { Shape } from "../../types";
import { useShapesSocket } from "../../hooks/useShapesSocket";
import { useCanvasDrawing } from "../../hooks/useCanvasDrawing";
import { useShapeSelection } from "../../hooks/useShapeSelection";

const Canvas = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedTool, setSelectedTool] = useState<
    "pen" | "rectangle" | "ellipse"
  >("pen");
  const {
    selectedShapeIndex,
    editingShapeIndex,
    editingText,
    setEditingText,
    setEditingShapeIndex,
    shapeBeingEdited,
    selectShape,
    startEditing,
  } = useShapeSelection(shapes);
  const [selectedColor, setSelectedColor] = useState<string>("#000000");
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState<number>(2);

  const { socket, socketId } = useShapesSocket(setShapes);
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasDrawing({
    shapes,
    setShapes,
    selectedTool,
    selectedColor,
    selectedStrokeWidth,
    socket,
    socketId,
  });

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
              onSelect={() => selectShape(shape.id)}
              onDoubleClick={() => startEditing(shape.id)}
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
