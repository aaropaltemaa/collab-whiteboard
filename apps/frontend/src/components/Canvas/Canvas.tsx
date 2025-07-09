import { Stage, Layer, Line, Rect, Ellipse, Text, Group } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useState, useRef, useEffect } from "react";
import io, { Socket } from "socket.io-client";

type Shape =
  | {
      type: "line";
      points: number[];
      color: string;
      strokeWidth: number;
      text?: string;
    }
  | {
      type: "rectangle";
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
      strokeWidth: number;
      text?: string;
    }
  | {
      type: "ellipse";
      x: number;
      y: number;
      radiusX: number;
      radiusY: number;
      color: string;
      strokeWidth: number;
      text?: string;
    };

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
  const socket = useRef<Socket | null>(null);
  const socketId = useRef<string | null>(null);

  useEffect(() => {
    socket.current = io("http://localhost:4000");

    socket.current.on("connect", () => {
      socketId.current = socket.current?.id ?? null;
      console.log("Connected to server, socket ID:", socketId.current);
    });

    socket.current.on("drawing", (data) => {
      if (data.senderId === socketId.current) {
        return;
      }

      const incomingShape: Shape = data.shape;

      setShapes((prevShapes) => [...prevShapes, incomingShape]);
    });

    socket.current.on("move-shape", (data) => {
      if (data.senderId === socketId.current) return;

      setShapes((prev) => {
        const updated = [...prev];
        updated[data.index] = data.shape;
        return updated;
      });
    });

    socket.current.on("update-text", (data) => {
      if (data.senderId === socketId.current) return;

      setShapes((prev) => {
        const updated = [...prev];
        updated[data.index] = data.shape;
        return updated;
      });
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

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
        type: "line",
        points: [pos.x, pos.y],
        color: selectedColor,
        strokeWidth: selectedStrokeWidth,
      };
      setShapes((prev) => [...prev, newLine]);
    } else if (selectedTool === "rectangle") {
      const newRect: Shape = {
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

  const handleDragMoveOrEnd = (
    e: KonvaEventObject<DragEvent>,
    index: number
  ) => {
    const pos = e.target.position();
    const shape = shapes[index];

    if (!shape) return;

    let updatedShape: Shape;

    if (shape.type === "rectangle") {
      updatedShape = { ...shape, x: pos.x, y: pos.y };
    } else if (shape.type === "ellipse") {
      updatedShape = { ...shape, x: pos.x, y: pos.y };
    } else {
      // Lines are not draggable
      return;
    }

    const updatedShapes = [...shapes];
    updatedShapes[index] = updatedShape;
    setShapes(updatedShapes);

    // Optionally emit on drag end
  };

  const shapeBeingEdited =
    editingShapeIndex !== null ? shapes[editingShapeIndex] : null;

  const inputTop =
    shapeBeingEdited && shapeBeingEdited.type === "rectangle"
      ? shapeBeingEdited.y
      : shapeBeingEdited && shapeBeingEdited.type === "ellipse"
        ? shapeBeingEdited.y - shapeBeingEdited.radiusY
        : 0;

  const inputLeft =
    shapeBeingEdited && shapeBeingEdited.type === "rectangle"
      ? shapeBeingEdited.x
      : shapeBeingEdited && shapeBeingEdited.type === "ellipse"
        ? shapeBeingEdited.x - shapeBeingEdited.radiusX
        : 0;

  return (
    <>
      <div className="flex gap-2 p-2 bg-gray-100 border-b border-gray-300 items-center">
        {["pen", "rectangle", "ellipse"].map((tool) => (
          <button
            key={tool}
            onClick={() =>
              setSelectedTool(tool as "pen" | "rectangle" | "ellipse")
            }
            className={`px-3 py-1 rounded ${
              selectedTool === tool
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            {tool.charAt(0).toUpperCase() + tool.slice(1)}
          </button>
        ))}

        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="ml-4"
        />

        <select
          value={selectedStrokeWidth}
          onChange={(e) => setSelectedStrokeWidth(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1"
        >
          {[1, 2, 3, 4, 5, 8, 10].map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
      </div>

      <Stage
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ background: "#fff" }}
      >
        <Layer>
          {shapes.map((shape, index) => {
            if (shape.type === "line") {
              return (
                <Line
                  key={index}
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
                <Group
                  key={index}
                  onClick={() => setSelectedShapeIndex(index)}
                  onDblClick={() => {
                    setEditingShapeIndex(index);
                    setEditingText(shape.text || "");
                  }}
                >
                  <Rect
                    key={index}
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                    onClick={() => setSelectedShapeIndex(index)}
                    shadowBlur={selectedShapeIndex === index ? 10 : 0}
                    shadowColor={selectedShapeIndex === index ? "blue" : ""}
                    shadowOpacity={0.5}
                    draggable
                    onDragMove={(e) => handleDragMoveOrEnd(e, index)}
                    onDragEnd={(e) => {
                      handleDragMoveOrEnd(e, index);

                      if (socket.current) {
                        socket.current.emit("move-shape", {
                          index,
                          shape: {
                            ...shapes[index],
                            x: e.target.x(),
                            y: e.target.y(),
                          },
                          senderId: socketId.current,
                        });
                      }
                    }}
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
                <Group
                  key={index}
                  onClick={() => setSelectedShapeIndex(index)}
                  onDblClick={() => {
                    setEditingShapeIndex(index);
                    setEditingText(shape.text || "");
                  }}
                >
                  <Ellipse
                    key={index}
                    x={shape.x}
                    y={shape.y}
                    radiusX={shape.radiusX}
                    radiusY={shape.radiusY}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                    onClick={() => setSelectedShapeIndex(index)}
                    shadowBlur={selectedShapeIndex === index ? 10 : 0}
                    shadowColor={selectedShapeIndex === index ? "blue" : ""}
                    shadowOpacity={0.5}
                    draggable
                    onDragMove={(e) => handleDragMoveOrEnd(e, index)}
                    onDragEnd={(e) => {
                      handleDragMoveOrEnd(e, index);

                      if (socket.current) {
                        socket.current.emit("move-shape", {
                          index,
                          shape: {
                            ...shapes[index],
                            x: e.target.x(),
                            y: e.target.y(),
                          },
                          senderId: socketId.current,
                        });
                      }
                    }}
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
          })}
        </Layer>
      </Stage>
      {editingShapeIndex !== null && (
        <input
          autoFocus
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          onBlur={() => {
            if (editingShapeIndex === null) return;

            setShapes((prev) => {
              const updated = [...prev];
              const shape = updated[editingShapeIndex];
              if (!shape) return prev;

              const newShape = { ...shape, text: editingText };
              updated[editingShapeIndex] = newShape;

              // Emit update to server
              if (socket.current) {
                socket.current.emit("update-text", {
                  index: editingShapeIndex,
                  shape: newShape,
                  senderId: socketId.current,
                });
              }

              return updated;
            });

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
          }}
        />
      )}
    </>
  );
};

export default Canvas;
