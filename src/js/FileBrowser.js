import React, { Component } from 'react';
import backIcon from '../img/back.png'
import fileIcon from '../img/file.png'
import folderIcon from '../img/folder.png'
import '../css/FileBrowser.css';

const electron = window.require('electron');
const fs = electron.remote.require('fs');
const os = electron.remote.require('os');

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault();
};

document.body.ondrop = (ev) => {
  ev.preventDefault();
};

class FileBrowser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentDir: props.rootDir,
      images: [],
      dirs: [],
      selectedFile: null,
      prevState: null,
      dragOver: false
    };

    this.goBack = this.goBack.bind(this);
    this.renderDirCell = this.renderDirCell.bind(this);
    this.renderFileCell = this.renderFileCell.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
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
      inputDir = 'input_images/';
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
      prevState: state
    }), () => this.updateFileList(this.state.currentDir));
  }

  renderDirCell(name) {
    return (
      <div className="fileCell"
           onClick={() => this.onDirSelected(name)}
           key={name}>
        <img className="cellIcon" src={folderIcon} alt=""/>
        {name}
      </div>
    )
  }

  onFileSelected(name) {
    this.setState({selectedFile: name});
    this.props.onFileSelected(this.state.currentDir + name);
  }

  renderFileCell(name) {
    const selected = name === this.state.selectedFile;
    return (
      <div className={`fileCell ${selected ? 'selectedFileCell' : ''}`}
           onClick={() => this.onFileSelected(name)}
           key={name}>
        <img className="cellIcon" src={fileIcon} alt=""/>
        <div>{name}</div>
      </div>
    )
  }

  goBack() {
    if (this.state.prevState !== null) {
      const prevState = this.state.prevState;
      prevState.selectedFile = this.state.selectedFile;
      this.setState(prevState);
    }
  }

  renderBackCell() {
    return (
      <div className="fileCell backCell" onClick={this.goBack}>
        <img className="cellIcon" src={backIcon} alt=""/>
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

  onDragLeave(e) {
    this.setState({dragOver: false});
    e.preventDefault();
  }

  onDragOver(e) {
    this.setState({dragOver: true});
    e.preventDefault();
  }

  onDrop(e) {
    try { // Exception if not file
      const divider = os.platform() === 'win32' ? '\\' : '/';
      let path = e.dataTransfer.files[0].path;
      console.log(path);
      this.setState({dragOver: false}, () => {
        fs.stat(path, (err, stats) => {
          if (!err) {
            if (stats.isFile()) {
              const subdirs = path.split(divider);
              console.log(subdirs);
              subdirs.splice(subdirs.length - 1, 1);
              path = subdirs.join(divider)
            }
            path += divider;
            this.setState((state, props) => ({
              currentDir: path,
              prevState: state,
            }), () => this.updateFileList(this.state.currentDir));
          } else {
            console.log(err);
          }
        });
      });
    } catch (e) {}
    e.preventDefault();
  }

  componentDidMount() {
    this.updateFileList(this.props.rootDir);
  }

  renderDropPrompt() {
    return (
      <div className="fileBrowser">
        <div className="fileBrowserDropPrompt">Drop to add</div>
      </div>
    );
  }

  renderFileBrowser() {
    return (
      <div className="fileBrowser">
        <div className="fileBrowserHeader">
          {this.state.currentDir.slice(1)}
        </div>
        <div className="fileBrowserContent">
          {this.state.prevState !== null ? this.renderBackCell() : ''}
          {this.state.dirs.map(this.renderDirCell)}
          {this.state.images.map(this.renderFileCell)}
        </div>
        <div className="fileBrowserDragPrompt">Drop folders here to go to them</div>
      </div>
    );
  }

  render() {
    return (
      <nav id="sidebar" onDragOver={this.onDragOver}
           onDragLeave={this.onDragLeave} onDrop={this.onDrop}>
        {(this.state.dragOver) ? this.renderDropPrompt()
          : this.renderFileBrowser()}
      </nav>
    );
  }
}

export default FileBrowser;
