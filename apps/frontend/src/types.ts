export type Shape =
  | {
      id: string;
      type: "rectangle";
      x: number;
      y: number;
      color: string;
    }
  | {
      id: string;
      type: "line";
      points: number[];
      color: string;
    };

export type NavBarProps = {
  setSelectedTool: React.Dispatch<React.SetStateAction<"rectangle" | "pen">>;
};
