import React from 'react';
import drawCircle from './utilities/canvasLoadAnimations';

class Cpu extends React.Component {
    render() {
        const canvas = document.querySelector(`.${this.props.cpuData.cpuWidgetId}`)
        drawCircle(canvas, this.props.cpuData.cpuLoad)
        
        return (
            <div className="col-sm-3 cpu">
                <h3>CPU Load</h3>
                <div className="canvas-wrapper">
                    <canvas className={this.props.cpuData.cpuWidgetId} height="200" width="200"></canvas>
                    <div className="cpu-text">{this.props.cpuData.cpuLoad}%</div>
                </div>
            </div>)
    }
}

export default Cpu