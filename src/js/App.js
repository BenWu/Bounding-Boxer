import React, { Component } from 'react';
import '../css/App.css';
import './FileBrowser'
import FileBrowser from "./FileBrowser";

class App extends Component {
  render() {
    return (
      <div className="App">

        <div className="container-fluid appHeader">
            <div className="appTitle">Bounding Boxer</div>
          </div>

        <div className="content">

          <FileBrowser rootDir={'./input_images/'}/>

          <div className="toolView">
            Placeholder
          </div>

        </div>

      </div>
    );
  }
}

export default App;
