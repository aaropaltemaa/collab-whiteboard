import { Stage, Layer, Rect, Line } from "react-konva";
import { useState, useRef } from "react";
import { nanoid } from "nanoid";
import Konva from "konva";
import type { Shape } from "../../types";

type NavBarProps = {
  setSelectedTool: React.Dispatch<React.SetStateAction<"rectangle" | "pen">>;
};

const NavBar = ({ setSelectedTool }: NavBarProps) => (
  <section className=" max-w-5xl justify-center h-20 bg-amber-100 mx-auto mt-4 rounded-2xl border-b-2">
    <div className="flex flex-row items-center h-full gap-4 ml-2">
      <button onClick={() => setSelectedTool("rectangle")}>Rectangle</button>
      <button onClick={() => setSelectedTool("pen")}>Pen</button>
    </div>
  </section>
);

const Canvas = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedTool, setSelectedTool] = useState<"rectangle" | "pen">(
    "rectangle"
  );
  const isDrawing = useRef(false);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Ignore clicks on existing shapes
    if (e.target !== e.target.getStage()) return;

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    if (selectedTool === "rectangle") {
      const newRect = {
        id: nanoid(),
        type: "rectangle" as const,
        x: pointerPosition.x,
        y: pointerPosition.y,
        color: "green",
      };

      setShapes((prev) => [...prev, newRect]);
    }

    if (selectedTool === "pen") {
      isDrawing.current = true;

      const newLine = {
        id: nanoid(),
        type: "line" as const,
        points: [pointerPosition.x, pointerPosition.y],
        color: "black",
      };

      setShapes((prev) => [...prev, newLine]);
    }
  };

  return (
    <>
      <NavBar setSelectedTool={setSelectedTool} />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
      >
        <Layer>
          {shapes.map((shape) => {
            if (shape.type === "rectangle")
              return (
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
              );
            if (shape.type === "line")
              return (
                <Line
                  key={shape.id}
                  points={shape.points}
                  stroke={shape.color}
                  strokeWidth={2}
                />
              );

            return null; // Add return null for other shape types
          })}
        </Layer>
      </Stage>
    </>
  );
};

export default Canvas;
