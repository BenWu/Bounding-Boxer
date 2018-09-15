import React, { Component } from 'react';
import '../css/ImageLabeler.css'

class ImageLabeler extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loadedImage: null
    }
  }

  renderPreviewImage() {
    if (this.props.selectedFile && (
      this.props.selectedFile.endsWith('.jpg') ||
      this.props.selectedFile.endsWith('.png'))) {
      return (
        <img className="previewImage"
             src={'file://' + this.props.selectedFile}
             alt="Preview Image"/>
      );
    } else {
      return '';
    }
  }

  render() {
    return (
      <div className="toolView">

        <div className="labelerHeader">
          {this.props.selectedFile || 'Placeholder'}
        </div>

        <div className="imageFrame">
          {this.renderPreviewImage()}
        </div>

      </div>
    );
  }
}

export default ImageLabeler;
