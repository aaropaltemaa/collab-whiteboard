export type Shape =
  | {
      id: string;
      type: "rectangle";
      x: number;
      y: number;
      color: string;
      strokeWidth: number;
    }
  | {
      id: string;
      type: "line";
      points: number[];
      color: string;
      strokeWidth: number;
    };

export type NavBarProps = {
  setSelectedTool: React.Dispatch<React.SetStateAction<"rectangle" | "pen">>;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  setSelectedStrokeWidth: React.Dispatch<React.SetStateAction<number>>;
  selectedColor: string;
  selectedStrokeWidth: number;
};
