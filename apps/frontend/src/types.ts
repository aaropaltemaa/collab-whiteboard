export type Shape =
  | {
      id: string;
      type: "rectangle";
      x: number;
      y: number;
      color: string;
      strokeWidth: number;
      text?: string; 
    }
  | {
      id: string;
      type: "line";
      points: number[];
      color: string;
      strokeWidth: number;
    }
  | {
      id: string;
      type: "ellipse";
      x: number;
      y: number;
      radiusX: number;
      radiusY: number;
      color: string;
      strokeWidth: number;
      text?: string; 
    }
  | {
      id: string;
      type: "connector";
      startShapeId: string;
      endShapeId: string;
      points: number[]; // [startX, startY, endX, endY]
      color: string;
      strokeWidth: number;
    };

export type NavBarProps = {
  selectedTool: "rectangle" | "pen" | "ellipse"; 
  setSelectedTool: React.Dispatch<React.SetStateAction<"rectangle" | "pen" | "ellipse">>;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
  setSelectedStrokeWidth: React.Dispatch<React.SetStateAction<number>>;
  selectedColor: string;
  selectedStrokeWidth: number;
};
