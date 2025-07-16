import type { NavBarProps } from "../types";

const NavBar = ({
  selectedColor,
  setSelectedTool,
  setSelectedColor,
  selectedStrokeWidth,
  setSelectedStrokeWidth,
}: NavBarProps) => (
  <section className=" max-w-5xl justify-center h-20 bg-amber-100 mx-auto mt-4 rounded-2xl border-b-2">
    <div className="flex flex-row items-center h-full gap-4 ml-2">
      <button onClick={() => setSelectedTool("rectangle")}>Rectangle</button>
      <button onClick={() => setSelectedTool("pen")}>Pen</button>
      <input
        type="color"
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
        className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
      />
      <select
        value={selectedStrokeWidth}
        onChange={(e) => setSelectedStrokeWidth(Number(e.target.value))}
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
