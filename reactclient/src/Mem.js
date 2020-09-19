import React from 'react';
import drawCircle from './utilities/canvasLoadAnimations';

function Mem(props) {
    const { totalMem, memUseage, freeMem, memWidgetId } = props.memData

    const canvas = document.querySelector(`.${memWidgetId}`)
    drawCircle(canvas, memUseage * 100)

    return (
        <div className="col-sm-3 mem">
            <h3>Memory Useage</h3>
            <div className="canvas-wrapper">
                <canvas className={memWidgetId} width="200" height="200"></canvas>
                <div className="mem-text">{memUseage * 100}%</div>
            </div>
            <div>
                Total Memory: {Math.floor((totalMem / 1073741824 * 100)) / 100} GB
            </div>
            <div>
                Free Memory: {Math.floor((freeMem / 1073741824 * 100)) / 100} GB
            </div>
        </div>
    )

}

export default Mem