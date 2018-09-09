import React, { Component } from 'react';
import './App.css';
import './FileBrowser'
import FileBrowser from "./FileBrowser";

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 className="title">Bounding Boxer</h1>

        <FileBrowser rootDir={'./input_images/'}/>

      </div>
    );
  }
}

export default App;
