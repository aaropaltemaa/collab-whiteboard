import { Rect, Line, Ellipse, Text } from "react-konva";
import type { Shape } from "../../types";
import type { KonvaEventObject } from "konva/lib/Node";

type ShapeRendererProps = {
  shape: Shape;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (updatedShape: Shape) => void;
  onDoubleClick: () => void;
};

const ShapeRenderer = ({
  shape,
  isSelected,
  onSelect,
  onDragEnd,
  onDoubleClick,
}: ShapeRendererProps) => {
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const pos = e.target.position();
    const updatedShape = { ...shape, x: pos.x, y: pos.y };
    onDragEnd(updatedShape);
  };

  if (shape.type === "rectangle") {
    return (
      <>
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
          onDblClick={onDoubleClick}
          shadowBlur={isSelected ? 10 : 0}
          shadowColor={isSelected ? "blue" : ""}
          shadowOpacity={isSelected ? 0.5 : 0}
          onDragEnd={handleDragEnd}
        />
        {shape.text && (
          <Text
            x={shape.x + 10}
            y={shape.y + 40}
            text={shape.text}
            fontSize={16}
            fill="black"
            width={180}
            align="center"
            verticalAlign="middle"
          />
        )}
      </>
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
      <>
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
          onDblClick={onDoubleClick}
          shadowBlur={isSelected ? 10 : 0}
          shadowColor={isSelected ? "blue" : ""}
          shadowOpacity={isSelected ? 0.5 : 0}
          onDragEnd={handleDragEnd}
        />
        {shape.text && (
          <Text
            x={shape.x}
            y={shape.y}
            text={shape.text}
            fontSize={16}
            fill="black"
            width={shape.radiusX * 2}
            align="center"
            verticalAlign="middle"
            offsetX={shape.radiusX}
            offsetY={8}
          />
        )}
      </>
    );
  }

  return null;
};

export default ShapeRenderer;
