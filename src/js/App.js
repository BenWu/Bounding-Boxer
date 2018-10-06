import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import '../css/App.css';
import FileBrowser from './FileBrowser';
import ImageLabeler from './ImageLabeler';

const appPath = window.require('electron').remote.getGlobal('appPath');
const isDev = window.require('electron').remote.getGlobal('isDev');

/*
Colors
{
  light: #8561c5, deepPurple 500 light
  primary: #673ab7, deepPurple 500 primary
  dark: #482880, deepPurple 500 dark
  darker: #381f75, deepPurple 700 dark
  darkest: #221266, deepPurple 900 dark
  lightish: #6a52b3, deepPurple 800 light
}
*/

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawerOpen: true,
      selectedFile: null
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);

    this.onFileSelected = this.onFileSelected.bind(this);
  }

  onFileSelected(filepath) {
    this.setState({selectedFile: filepath})
  }

  toggleDrawer() {
    this.setState((state, props) => ({
      isDrawerOpen: !state.isDrawerOpen
    }));
  }

  render() {
    const appBarColor = '#221266';

    const rootDir = isDev
      ? `${appPath}/input_images/`
      : 'Begin by dragging a file or folder into the window';

    return (
      <div className="App">

        <div className="appHeader">
          <AppBar style={{backgroundColor: appBarColor}} position="static">
            <Toolbar>
              <IconButton style={{backgroundColor: appBarColor, color: '#ffffff'}}
                          aria-label="Menu"
                          onClick={this.toggleDrawer}>
                <MenuIcon/>
              </IconButton>
              <span className="appTitle">Bounding Boxer</span>
            </Toolbar>
          </AppBar>
        </div>

        <div className="content">

          <FileBrowser rootDir={rootDir}
                       onFileSelected={this.onFileSelected}
                       isDrawerOpen={this.state.isDrawerOpen}
                       toggleDrawer={this.toggleDrawer}/>

          <ImageLabeler selectedFile={this.state.selectedFile}/>

        </div>

        <div className="appFooter">
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/Ben-Wu/Bounding-Boxer">View source</a>
        </div>

      </div>
    );
  }
}

export default App;
