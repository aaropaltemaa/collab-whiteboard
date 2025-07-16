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
