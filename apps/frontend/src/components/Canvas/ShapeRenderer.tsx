import { Rect, Line, Ellipse } from "react-konva";
import type { Shape } from "../../types";
import type { KonvaEventObject } from "konva/lib/Node";

type ShapeRendererProps = {
  shape: Shape;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (updatedShape: Shape) => void;
};

const ShapeRenderer = ({
  shape,
  isSelected,
  onSelect,
  onDragEnd,
}: ShapeRendererProps) => {
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const pos = e.target.position();
    const updatedShape = { ...shape, x: pos.x, y: pos.y };
    onDragEnd(updatedShape);
  };

  if (shape.type === "rectangle") {
    return (
      <Rect
        key={shape.id}
        x={shape.x}
        y={shape.y}
        width={200}
        height={100}
        fill={shape.color}
        strokeWidth={shape.strokeWidth}
        draggable
        onClick={onSelect}
        shadowBlur={isSelected ? 10 : 0}
        shadowColor={isSelected ? "blue" : ""}
        shadowOpacity={isSelected ? 0.5 : 0}
        onDragEnd={handleDragEnd}
      />
    );
  }

  if (shape.type === "line") {
    return (
      <Line
        key={shape.id}
        points={shape.points}
        stroke={shape.color}
        strokeWidth={shape.strokeWidth}
      />
    );
  }

  if (shape.type === "ellipse") {
    return (
      <Ellipse
        key={shape.id}
        x={shape.x}
        y={shape.y}
        radiusX={shape.radiusX}
        radiusY={shape.radiusY}
        stroke={shape.color}
        strokeWidth={shape.strokeWidth}
        draggable
        onClick={onSelect}
        shadowBlur={isSelected ? 10 : 0}
        shadowColor={isSelected ? "blue" : ""}
        shadowOpacity={isSelected ? 0.5 : 0}
        onDragEnd={handleDragEnd}
      />
    );
  }

  return null;
};

export default ShapeRenderer;
