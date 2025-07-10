export type Shape =
  | {
      id: string;
      type: "line";
      points: number[];
      color: string;
      strokeWidth: number;
      text?: string;
    }
  | {
      id: string;
      type: "rectangle";
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
      strokeWidth: number;
      text?: string;
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
    };
