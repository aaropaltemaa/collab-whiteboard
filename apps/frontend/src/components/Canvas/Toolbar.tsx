import React from "react";

type Props = {
  selectedTool: "pen" | "rectangle" | "ellipse";
  setSelectedTool: (tool: "pen" | "rectangle" | "ellipse") => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedStrokeWidth: number;
  setSelectedStrokeWidth: (width: number) => void;
};

const Toolbar: React.FC<Props> = ({
  selectedTool,
  setSelectedTool,
  selectedColor,
  setSelectedColor,
  selectedStrokeWidth,
  setSelectedStrokeWidth,
}) => {
  return (
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
  );
};

export default Toolbar;
