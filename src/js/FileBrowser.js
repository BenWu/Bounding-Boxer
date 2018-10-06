import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import IconButton from "@material-ui/core/IconButton";
import ArrowBack from '@material-ui/icons/ArrowBack'
import FolderOutline from '@material-ui/icons/FolderOutlined'
import InsertDriveFileOutlined from '@material-ui/icons/InsertDriveFileOutlined'
import MenuIcon from "@material-ui/icons/Menu";

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
      files: [],
      dirs: [],
      selectedFile: null,
      prevState: null,
      dragOver: false
    };

    this.goToRelativeFolder = this.goToRelativeFolder.bind(this);
    this.goToFolder = this.goToFolder.bind(this);
    this.selectFile = this.selectFile.bind(this);
    this.goBack = this.goBack.bind(this);

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
  listFiles(inputDir, callback) {
    fs.readdir(inputDir, (err, files) => {
      if (err) {
        // Assume folder not found
        return;
      }
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

  goToRelativeFolder(name) {
    this.goToFolder(this.state.currentDir + name)
  }

  goToFolder(path) {
    this.setState({
      currentDir: path + '/',
      prevState: this.state
    }, () => this.updateFileList(this.state.currentDir));
  }

  selectFile(name) {
    this.setState({selectedFile: name});
    this.props.onFileSelected(this.state.currentDir + name);
  }

  goBack() {
    if (this.state.prevState !== null) {
      const prevState = this.state.prevState;
      prevState.selectedFile = this.state.selectedFile;
      this.setState(prevState);
    }
  }

  updateFileList(path) {
    this.listFiles(path, (inputDir, files, dirs) => {
      this.setState({
        currentDir: inputDir,
        files,
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
      this.setState({dragOver: false}, () => {
        fs.stat(path, (err, stats) => {
          if (!err) {
            if (stats.isFile()) {
              const subdirs = path.split(divider);
              subdirs.splice(subdirs.length - 1, 1);
              path = subdirs.join(divider)
            }
            this.goToFolder(path);
          } else {
            console.error(err);
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

  renderBrowserCell(name, onClick, icon, classNames='') {
    const Icon = icon;
    return (
      <div className={`fileCell ${classNames} waves-effect waves-dark-purple`}
           key={name} onClick={() => onClick(name)}>
        <Icon className="cellIcon"/>
        {name}
      </div>
    )
  }

  renderFileBrowser() {
    return (
      <div className="fileBrowser">
        <div className="fileBrowserTitle">
          <IconButton style={{backgroundColor: '#221266', color: '#ffffff'}}
                      aria-label="Menu"
                      onClick={this.props.toggleDrawer}>
            <MenuIcon className="fileBrowserMenuButton"/>
          </IconButton>
          <span className="fileBrowserTitleText">File Browser</span>
        </div>

        <div className="fileBrowserPath">
          {this.state.currentDir}
        </div>

        <div className="fileBrowserContent">
          {this.state.prevState !== null
            ? this.renderBrowserCell('Back to previous folder', this.goBack, ArrowBack, 'backCell') : ''}

          {this.state.dirs.map((name) =>
            this.renderBrowserCell(name, this.goToRelativeFolder, FolderOutline))}

          {this.state.files.map((name) => (
            this.renderBrowserCell(name, this.selectFile, InsertDriveFileOutlined,
              (name === this.state.selectedFile ? 'selectedFileCell' : '')
            )))}
        </div>

        <div className="fileBrowserInfo">Drop folders in the window to go to them</div>
      </div>
    );
  }

  render() {
    return (
      <Drawer open={this.props.isDrawerOpen}
              onClose={this.props.toggleDrawer}
              onDragOver={this.onDragOver}
              onDragLeave={this.onDragLeave}
              onDrop={this.onDrop}>
        <div id="sidebar">
          {(this.state.dragOver) ? this.renderDropPrompt()
            : this.renderFileBrowser()}
        </div>
      </Drawer>
    );
  }
}

export default FileBrowser;
