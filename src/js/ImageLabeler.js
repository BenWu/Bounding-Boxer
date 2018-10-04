import React, { Component } from 'react';
import { Stage, Layer, Image } from 'react-konva';

import '../css/ImageLabeler.css'
import ResizableRectLayer from './ResizableRectLayer';

class ImageLabeler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      imageWidth: 0,
      imageHeight: 0,
      isValidImage: false,
      containerWidth: 0,
      containerHeight: 0
    };

    this.imageFrame = React.createRef();
    this.annotationLayer = React.createRef();

    this.onStageClick = this.onStageClick.bind(this);
    this.onStageDblClick = this.onStageDblClick.bind(this);
  }

  componentDidMount() {
    this.setState({
      containerWidth: this.imageFrame.current.offsetWidth,
      containerHeight: this.imageFrame.current.offsetHeight
    }, () => {
      console.log(`width: ${this.state.containerWidth} height: ${this.state.containerHeight}`);
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.selectedFile !== this.props.selectedFile) {
      let image = new window.Image();
      image.src = 'file://' + this.props.selectedFile;
      image.onload = () => {
        this.setState({
          isValidImage: true,
          image
        }, () => {
          this.setState({
            imageWidth: this.state.image.width,
            imageHeight: this.state.image.height,
            containerWidth: this.imageFrame.current.offsetWidth,
            containerHeight: this.imageFrame.current.offsetHeight
          });
        });
      };
    }
  }

  onStageClick(e) {
    this.annotationLayer.current.onClick(e);
  }

  onStageDblClick(e) {
    this.annotationLayer.current.onDblClick(e);
  }

  renderImage() {
    const padding = 96;
    const maxWidth = this.state.containerWidth - padding;
    const maxHeight = this.state.containerHeight - padding;

    const imageWidth = this.state.imageWidth;
    const imageHeight = this.state.imageHeight;

    const widthScale = imageWidth === 0 ? 1 : Math.min(imageWidth, maxWidth) / imageWidth;
    const heightScale = imageHeight === 0 ? 1 : Math.min(imageHeight, maxHeight) / imageHeight;
    const scale = Math.min(widthScale, heightScale);

    const calculatedWidth = imageWidth * scale;
    const calculatedHeight = imageHeight * scale;

    return (
      <div style={{width: calculatedWidth, height: calculatedHeight}}
           className={"imageFrame " + (this.state.isValidImage ? '' : 'hiddenImage')}>
        <Stage width={calculatedWidth}
               height={calculatedHeight}
               onClick={this.onStageClick}
               onDblClick={this.onStageDblClick}>
          <Layer>
            <Image width={calculatedWidth}
                   height={calculatedHeight}
                   image={this.state.image}/>
          </Layer>

          <ResizableRectLayer ref={this.annotationLayer}
                              rectangles={[
                                // TODO: load shapes from DB
                              ]}/>

        </Stage>
      </div>
    )
  }

  render() {
    return (
      <div className="toolView" ref={this.imageFrame}>

        <div className="labelerHeader">
          {this.props.selectedFile || 'Placeholder'}
        </div>

        {this.renderImage()}

      </div>
    );
  }
}

export default ImageLabeler;
