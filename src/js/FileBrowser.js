import React, { Component } from 'react';
import '../css/FileBrowser.css';

const electron = window.require('electron');
const fs = electron.remote.require('fs');

class FileBrowser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentDir: props.rootDir,
      images: [],
      dirs: []
    };
  }

  /**
   * @callback callback
   * @param {str} inputDir
   * @param {[str]} images
   * @param {[str]} dirs
   */

  /**
   * Return a list of images and directories in the given directory
   *
   * @param {string} inputDir
   * @param {callback} callback
   */
  listInputImages(inputDir, callback) {
    if (!inputDir) {
      inputDir = './input_images/';
    }
    fs.readdir(inputDir, (err, files) => {
      let images = [];
      let dirs = [];

      for (let file of files) {
        const stats = fs.statSync(inputDir + file);
        if (stats.isFile()) {
          images.push(file);
        } else if (stats.isDirectory()) {
          dirs.push(file);
        }
      }

      callback(inputDir, images, dirs);
    });
  }

  componentDidMount() {
    this.listInputImages('', (inputDir, images, dirs) => {
      this.setState({
        currentDir: inputDir,
        images,
        dirs
      });
    })
  }

  renderDirCell(name) {
    // TODO: onClick open folder and list new images
    return <div className="fileCell" key={name}>{name}</div>
  }

  renderFileCell(name) {
    // TODO: onClick select image to use in tool
    return <div className="fileCell" key={name}>{name}</div>
  }

  render() {
    return (
      <nav id="sidebar">
        <div className="fileBrowser">
          <div className="fileBrowserHeader">
            {this.state.currentDir}
          </div>
          <div className="fileBrowserContent">
            {this.state.dirs.map(this.renderDirCell)}
            {this.state.images.map(this.renderFileCell)}
          </div>
        </div>
      </nav>
    );
  }
}

export default FileBrowser;
