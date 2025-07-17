import { Stage, Layer } from "react-konva";
import NavBar from "../NavBar";
import ShapeRenderer from "./ShapeRenderer";
import TextEditingOverlay from "./TextEditingOverlay";
import useDrawing from "../../hooks/useDrawing";

const Canvas = () => {
  const {
    shapes,
    selectedTool,
    selectedColor,
    selectedStrokeWidth,
    selectedShapeId,
    editingShapeId,
    editingText,
    setSelectedTool,
    setSelectedColor,
    setSelectedStrokeWidth,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleShapeSelect,
    handleShapeDragEnd,
    handleShapeDoubleClick,
    handleTextSave,
    handleTextCancel,
  } = useDrawing();

  const editingShape = editingShapeId
    ? shapes.find((s) => s.id === editingShapeId)
    : null;

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
              onDoubleClick={() => handleShapeDoubleClick(shape.id)}
            />
          ))}
        </Layer>
      </Stage>
      {editingShapeId && editingShape && (
        <TextEditingOverlay
          x={"x" in editingShape ? editingShape.x : 0}
          y={"y" in editingShape ? editingShape.y : 0}
          initialText={editingText}
          onSave={(text) => handleTextSave(editingShapeId, text)}
          onCancel={handleTextCancel}
        />
      )}
    </>
  );
};

export default Canvas;
