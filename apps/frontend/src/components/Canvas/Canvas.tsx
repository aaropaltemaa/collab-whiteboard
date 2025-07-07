import { Stage, Layer } from "react-konva"

const Canvas = () => {
    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
            </Layer>
        </Stage>
    )
}

export default Canvas