import { Stage, Layer } from "react-konva";
import NavBar from "../NavBar";
import ShapeRenderer from "./ShapeRenderer";
import useDrawing from "../../hooks/useDrawing";

const Canvas = () => {
  const {
    shapes,
    selectedTool,
    selectedColor,
    selectedStrokeWidth,
    selectedShapeId,
    setSelectedTool,
    setSelectedColor,
    setSelectedStrokeWidth,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleShapeSelect,
    handleShapeDragEnd,
  } = useDrawing();

  return (
    <>
      <NavBar
        selectedTool={selectedTool}
        selectedColor={selectedColor}
        setSelectedTool={setSelectedTool}
        setSelectedColor={setSelectedColor}
        selectedStrokeWidth={selectedStrokeWidth}
        setSelectedStrokeWidth={setSelectedStrokeWidth}
      />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {shapes.map((shape) => (
            <ShapeRenderer
              key={shape.id}
              shape={shape}
              isSelected={shape.id === selectedShapeId}
              onSelect={() => handleShapeSelect(shape.id)}
              onDragEnd={handleShapeDragEnd}
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
};

export default Canvas;
