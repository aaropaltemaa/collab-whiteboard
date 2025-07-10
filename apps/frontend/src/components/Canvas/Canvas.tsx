import { Stage, Layer, Rect } from "react-konva";
import { useState } from "react";

const Canvas = () => {
  const [shapes, setShapes] = useState([
    { id: "rect1", x: 50, y: 50, color: "red" },
    { id: "rect2", x: 300, y: 50, color: "green" },
  ]);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
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
