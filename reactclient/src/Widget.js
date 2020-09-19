import React from 'react';
import Cpu from './Cpu';
import Info from './Info';
import Mem from './Mem';
import './widget.css'

class Widget extends React.Component {
    state = {}

    render() {
        const {
            freeMem,
            totalMem,
            usedMem,
            memUseage,
            osType,
            upTime,
            cpuModel,
            numCores,
            cpuSpeed,
            cpuLoad,
            macAddress,
            isActive
        } = this.props.data

        const cpuWidgetId = `cpu-widget-${this.props.classValue}`
        const memWidgetId = `mem-widget-${this.props.classValue}`

        const cpu = { cpuLoad, cpuWidgetId}
        const mem = { totalMem, usedMem, memUseage, freeMem, memWidgetId}
        const info = { macAddress, osType, upTime, cpuModel, numCores, cpuSpeed }
        let notActiveDiv = ''
        if (!isActive) {
            notActiveDiv = <div className="not-active">Offline</div>
        }

        return (
            <div className="widget col-sm-12">
                {notActiveDiv}
                <Cpu cpuData={cpu} />
                <Mem memData={mem} />
                <Info infoData={info} />
            </div>)
    }
}

export default Widget