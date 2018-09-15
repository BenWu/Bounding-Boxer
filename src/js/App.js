import React, { Component } from 'react';
import '../css/App.css';
import './FileBrowser'
import FileBrowser from "./FileBrowser";

const appPath = window.require('electron').remote.getGlobal('appPath');

class App extends Component {
  onFileSelected(filepath) {
    // TODO
    console.log(`Selected: ${filepath}`);
  }

  render() {
    return (
      <div className="App">

        <div className="container-fluid appHeader">
            <div className="appTitle">Bounding Boxer</div>
          </div>

        <div className="content">

          <FileBrowser rootDir={`${appPath}/input_images/`}
                       onFileSelected={this.onFileSelected}/>

          <div className="toolView">
            Placeholder
          </div>

        </div>

      </div>
    );
  }
}

export default App;
