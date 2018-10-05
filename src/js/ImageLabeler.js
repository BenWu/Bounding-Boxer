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

  componentWillUpdate(nextProps, nextState, nextContext) {
    if (nextProps.selectedFile !== this.props.selectedFile) {
      this.annotationLayer.current.clearRects();
    }
  }

  saveAnnotations() {
    console.log('s');
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
                              width={calculatedWidth}
                              height={calculatedHeight}
                              onUpdateRects={this.saveAnnotations}
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
          {this.props.selectedFile || 'Start by opening the menu and selecting an image'}
        </div>

        {this.renderImage()}

        {this.props.selectedFile ? (
          <div className="labelerInstructions">
            Double click the image to add a bounding box
            <br/>
            Drag a box to move it
            <br/>
            Select a box by clicking on it to resize it
            <br/>
            Double click an existing box to delete it
            <br/>
            Changes are saved as they are made
            <br/>
            Click the save button to export all the data to a CSV file
          </div>
        ) : ''
        }

      </div>
    );
  }
}

export default ImageLabeler;
