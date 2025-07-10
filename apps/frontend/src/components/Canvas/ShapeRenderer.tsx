import { Group, Rect, Ellipse, Line, Text } from "react-konva";
import type { Shape } from "../../types";

type Props = {
  shape: Shape;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onDragEnd?: (updatedShape: Shape) => void;
};

export default function ShapeRenderer({
  shape,
  isSelected,
  onSelect,
  onDoubleClick,
  onDragEnd,
}: Props) {
  if (shape.type === "line") {
    return (
      <Line
        key={shape.id}
        points={shape.points}
        stroke={shape.color}
        strokeWidth={shape.strokeWidth}
        lineCap="round"
        lineJoin="round"
      />
    );
  }

  if (shape.type === "rectangle") {
    return (
      <Group key={shape.id} onClick={onSelect} onDblClick={onDoubleClick}>
        <Rect
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          stroke={shape.color}
          strokeWidth={shape.strokeWidth}
          shadowBlur={isSelected ? 10 : 0}
          shadowColor={isSelected ? "blue" : ""}
          shadowOpacity={0.5}
          draggable
          onDragEnd={(e) =>
            onDragEnd?.({
              ...shape,
              x: e.target.x(),
              y: e.target.y(),
            })
          }
        />
        {shape.text && (
          <Text
            text={shape.text}
            x={shape.x + 5}
            y={shape.y + 5}
            fontSize={16}
            fill="black"
          />
        )}
      </Group>
    );
  }

  if (shape.type === "ellipse") {
    return (
      <Group key={shape.id} onClick={onSelect} onDblClick={onDoubleClick}>
        <Ellipse
          x={shape.x}
          y={shape.y}
          radiusX={shape.radiusX}
          radiusY={shape.radiusY}
          stroke={shape.color}
          strokeWidth={shape.strokeWidth}
          shadowBlur={isSelected ? 10 : 0}
          shadowColor={isSelected ? "blue" : ""}
          shadowOpacity={0.5}
          draggable
          onDragEnd={(e) =>
            onDragEnd?.({
              ...shape,
              x: e.target.x(),
              y: e.target.y(),
            })
          }
        />
        {shape.text && (
          <Text
            text={shape.text}
            x={shape.x - shape.radiusX + 5}
            y={shape.y - shape.radiusY + 5}
            fontSize={16}
            fill="black"
          />
        )}
      </Group>
    );
  }

  return null;
}
