import type { NavBarProps } from "../types";

const NavBar = ({
  selectedColor,
  setSelectedTool,
  setSelectedColor,
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
    </div>
  </section>
);

export default NavBar;
