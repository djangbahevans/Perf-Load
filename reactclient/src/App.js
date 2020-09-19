import React from 'react';
import './App.css';
import socket from './utilities/socketConnection'
import Widget from './Widget';

class App extends React.Component {
  state = {
    performanceData: {}
  }

  componentDidMount() {
    socket.on('data', data => {
      this.setState((prevState) => {
        const currentState = {...prevState.performanceData}
        currentState[data.macAddress] = data

        return {
          performanceData: { ...prevState.performanceData, ...currentState },
        }
      })
    })
  }

  render() {
    let widgets = []
    const data = this.state.performanceData
    let classValue = 0
    Object.entries(data).forEach(([key, value]) => {
      widgets.push(<Widget key={key} classValue={classValue} data={value} />)
      classValue++
    })
    return (
      <div className="App">
        {widgets}
      </div>
    );
  }
}

export default App;
