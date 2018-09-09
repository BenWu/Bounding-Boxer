import React, { Component } from 'react';

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

  renderFileCell(name) {
    return <p key={name}>{name}</p>
  }

  render() {
    return (
      <div className='fileBrowser'>
        <h1>{this.state.currentDir}</h1>
        {this.state.dirs.map(this.renderFileCell)}
        {this.state.images.map(this.renderFileCell)}
      </div>
    );
  }
}

export default FileBrowser;
