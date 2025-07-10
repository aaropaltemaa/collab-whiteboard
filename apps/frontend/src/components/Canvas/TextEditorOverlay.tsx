import React from "react";
import type { Shape } from "../../types";
import type { Socket } from "socket.io-client";

type Props = {
  editingShapeIndex: number;
  shape: Shape;
  editingText: string;
  setEditingText: (text: string) => void;
  setEditingShapeIndex: (index: number | null) => void;
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  socket: Socket | null;
  socketId: string | null;
};

const TextEditorOverlay: React.FC<Props> = ({
  editingShapeIndex,
  shape,
  editingText,
  setEditingText,
  setEditingShapeIndex,
  setShapes,
  socket,
  socketId,
}) => {
  if (!shape) return null;

  const inputTop =
    shape.type === "rectangle"
      ? shape.y
      : shape.type === "ellipse"
        ? shape.y - shape.radiusY
        : 0;

  const inputLeft =
    shape.type === "rectangle"
      ? shape.x
      : shape.type === "ellipse"
        ? shape.x - shape.radiusX
        : 0;

  return (
    <input
      autoFocus
      value={editingText}
      onChange={(e) => setEditingText(e.target.value)}
      onBlur={() => {
        const newShape = { ...shape, text: editingText };

        setShapes((prev) => {
          const updated = [...prev];
          updated[editingShapeIndex] = newShape;
          return updated;
        });

        if (socket) {
          socket.emit("update-text", {
            id: shape.id,
            shape: newShape,
            senderId: socketId,
          });
        }

        setEditingShapeIndex(null);
        setEditingText("");
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
      style={{
        position: "absolute",
        top: inputTop,
        left: inputLeft,
        fontSize: 16,
        padding: "2px 4px",
        border: "1px solid #ccc",
        borderRadius: 4,
        background: "#fff",
      }}
    />
  );
};

export default TextEditorOverlay;
