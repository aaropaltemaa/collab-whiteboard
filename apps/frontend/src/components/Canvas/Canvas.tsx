import { Stage, Layer } from "react-konva"
import type { KonvaEventObject } from "konva/lib/Node";
import { useState } from "react";

type Line = {
  points: number[];
};

const Canvas = () => {
    const [lines, setLines] = useState<Line[]>([]);

    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        const stage = e.target.getStage();
        if (!stage) return;
        const pos = stage.getPointerPosition();
        if (!pos) return;
        const newLine: Line = { points: [pos.x, pos.y]}
        setLines([...lines, newLine])
        console.log(lines)
};


    return (
        <Stage onMouseDown={handleMouseDown} width={window.innerWidth} height={window.innerHeight} style={{ background: "#fff" }}>
            <Layer>
            </Layer>
        </Stage>
    )
}

export default Canvas