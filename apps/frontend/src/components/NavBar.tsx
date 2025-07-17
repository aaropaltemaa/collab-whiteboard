import type { NavBarProps } from "../types";

const NavBar = ({
  selectedTool, // Add this prop
  selectedColor,
  setSelectedTool,
  setSelectedColor,
  selectedStrokeWidth,
  setSelectedStrokeWidth,
}: NavBarProps) => (
  <section className="max-w-5xl justify-center h-20 bg-amber-100 mx-auto mt-4 rounded-2xl border-b-2">
    <div className="flex flex-row items-center h-full gap-4 ml-2">
      <button
        onClick={() => setSelectedTool("rectangle")}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          selectedTool === "rectangle"
            ? "bg-blue-500 text-white shadow-md"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Rectangle
      </button>
      <button
        onClick={() => setSelectedTool("pen")}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          selectedTool === "pen"
            ? "bg-blue-500 text-white shadow-md"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Pen
      </button>
      <button
        onClick={() => setSelectedTool("ellipse")}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          selectedTool === "ellipse"
            ? "bg-blue-500 text-white shadow-md"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        Ellipse
      </button>
      <input
        type="color"
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
      />
      <select
        value={selectedStrokeWidth}
        onChange={(e) => setSelectedStrokeWidth(Number(e.target.value))}
        className="px-3 py-2 rounded-lg border border-gray-300 bg-white"
      >
        <option value={1}>1 px</option>
        <option value={2}>2 px</option>
        <option value={4}>4 px</option>
        <option value={8}>8 px</option>
        <option value={12}>12 px</option>
      </select>
    </div>
  </section>
);

export default NavBar;
