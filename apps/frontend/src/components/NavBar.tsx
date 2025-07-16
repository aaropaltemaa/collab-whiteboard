import type { NavBarProps } from "../types";

const NavBar = ({ setSelectedTool }: NavBarProps) => (
  <section className=" max-w-5xl justify-center h-20 bg-amber-100 mx-auto mt-4 rounded-2xl border-b-2">
    <div className="flex flex-row items-center h-full gap-4 ml-2">
      <button onClick={() => setSelectedTool("rectangle")}>Rectangle</button>
      <button onClick={() => setSelectedTool("pen")}>Pen</button>
    </div>
  </section>
);

export default NavBar;
