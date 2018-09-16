import React, { Component } from 'react';
import $ from "jquery";

import '../css/ImageLabeler.css'

class ImageLabeler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedImage: null,
      isValidImage: false,
      imageLoadListenerBound: false
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('update');
    if (prevProps.selectedFile !== this.props.selectedFile) {
      const previewImage = $('#previewImage');
      if (previewImage) {
        if (!this.state.imageLoadListenerBound) {
          previewImage.on('load', () => {
            console.log(previewImage.height());
            this.setState({
              isValidImage: true
            });
          }).on('error', () => {
            // TODO: Return error for invalid files
            this.setState({
              isValidImage: false
            });
          });
          this.setState({
            imageLoadListenerBound: true
          });
        }
        if (this.props.selectedFile !== null) {
          previewImage.attr('src', 'file://' + this.props.selectedFile);
        }
      }
    }
  }

  render() {
    return (
      <div className="toolView">

        <div className="labelerHeader">
          {this.props.selectedFile || 'Placeholder'}
        </div>

        <div className={"imageFrame " + (this.state.isValidImage ? '' : 'hiddenImage')}>
          <img id="previewImage" alt=""/>
        </div>

      </div>
    );
  }
}

export default ImageLabeler;
