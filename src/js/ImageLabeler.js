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
      const reader = new FileReader();
      //reader.addEventListener('load',
      //  () => {this.setState({loadedImage: reader.result})}, false);
      //reader.readAsDataURL(this.props.selectedFile);
      return (
        <img src={'file://' + this.props.selectedFile} alt="Preview Image"/>
      );
    } else {
      return '';
    }
  }

  render() {
    return (
      <div className="toolView">
        {this.props.selectedFile || 'Placeholder'}
        {this.renderPreviewImage()}
      </div>
    );
  }
}

export default ImageLabeler;
