import React, { Component } from 'react';
import '../css/App.css';
import './FileBrowser'
import FileBrowser from "./FileBrowser";

class App extends Component {
  render() {
    return (
      <div className="App">

        <div className="container header">
          <p className="title">Bounding Boxer</p>
        </div>

        <FileBrowser rootDir={'./input_images/'}/>

      </div>
    );
  }
}

export default App;
