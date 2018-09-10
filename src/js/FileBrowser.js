import React, { Component } from 'react';
import backIcon from '../img/back.png'
import fileIcon from '../img/file.png'
import folderIcon from '../img/folder.png'
import '../css/FileBrowser.css';

const electron = window.require('electron');
const fs = electron.remote.require('fs');

class FileBrowser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentDir: props.rootDir,
      images: [],
      dirs: [],
      selectedFile: null,
      prevState: null
    };

    this.goBack = this.goBack.bind(this);
    this.renderDirCell = this.renderDirCell.bind(this);
    this.renderFileCell = this.renderFileCell.bind(this);
  }

  /**
   * @callback callback
   * @param {string} inputDir
   * @param {[string]} images
   * @param {[string]} dirs
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

  onDirSelected(name) {
    this.setState((state, props) => ({
      currentDir: state.currentDir + name + '/',
      images: [],
      dirs: [],
      prevState: state
    }), () => this.updateFileList(this.state.currentDir));
  }

  renderDirCell(name) {
    return (
      <div className="fileCell"
           onClick={() => this.onDirSelected(name)}
           key={name}>
        <img src={folderIcon} alt=""/>
        {name}
      </div>
    )
  }

  onImageSelected(name) {
    this.setState({selectedFile: name});
    this.props.onImageSelected(this.state.currentDir + name);
  }

  renderFileCell(name) {
    const selected = name === this.state.selectedFile;
    return (
      <div className={`fileCell ${selected ? 'selectedFileCell' : ''}`}
           onClick={() => this.onImageSelected(name)}
           key={name}>
        <img src={fileIcon} alt=""/>
        <div>{name}</div>
      </div>
    )
  }

  goBack() {
    if (this.state.prevState !== null) {
      const selected = this.state.selectedFile;
      this.setState(
        this.state.prevState,
        () => this.setState({selectedFile: selected})
      );
    }
  }

  renderBackCell() {
    return (
      <div className="fileCell backCell" onClick={this.goBack}>
        <img src={backIcon} alt=""/>
        <div>Back to previous folder</div>
      </div>
    )
  }

  updateFileList(path) {
    this.listInputImages(path, (inputDir, images, dirs) => {
      this.setState({
        currentDir: inputDir,
        images,
        dirs
      });
    });
  }

  componentDidMount() {
    this.updateFileList(this.props.rootDir);
  }

  render() {
    return (
      <nav id="sidebar">
        <div className="fileBrowser">
          <div className="fileBrowserHeader">
            {this.state.currentDir.slice(1)}
          </div>
          <div className="fileBrowserContent">
            {this.props.rootDir !== this.state.currentDir ? this.renderBackCell() : ''}
            {this.state.dirs.map(this.renderDirCell)}
            {this.state.images.map(this.renderFileCell)}
          </div>
        </div>
      </nav>
    );
  }
}

export default FileBrowser;
