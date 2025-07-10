import { Stage, Layer, Rect } from "react-konva";
import { useState } from "react";
import { nanoid } from "nanoid";
import Konva from "konva";

const Canvas = () => {
  const [shapes, setShapes] = useState([
    { id: nanoid(), x: 50, y: 50, color: "red" },
  ]);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Ignore clicks on existing shapes
    if (e.target !== e.target.getStage()) return;

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    const newRect = {
      id: nanoid(),
      x: pointerPosition.x,
      y: pointerPosition.y,
      color: "green",
    };

    setShapes((prev) => [...prev, newRect]);
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleStageClick}
    >
      <Layer>
        {shapes.map((shape) => (
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
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;
