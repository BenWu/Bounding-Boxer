import React, { Component } from 'react';
import { Stage, Layer, Image } from 'react-konva';

import '../css/ImageLabeler.css'
import ResizableRectLayer from './ResizableRectLayer';

import Datastore from 'nedb';

const db = new Datastore({ filename: 'annotations.db' });

db.loadDatabase(err => {
  if (err) console.error(err);
});

//db.remove({}, { multi: true }, function (err, numRemoved) {
//  if (!err) {
//    console.log(`Removed ${numRemoved} annotations`);
//  }
//});

class ImageLabeler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      imageWidth: 0,
      imageHeight: 0,
      isValidImage: false,
      containerWidth: 0,
      containerHeight: 0,
      annotations: [],
      scale: 1
    };

    this.imageFrame = React.createRef();
    this.annotationLayer = React.createRef();

    this.onStageClick = this.onStageClick.bind(this);
    this.onStageDblClick = this.onStageDblClick.bind(this);
    this.updateAnnotation = this.updateAnnotation.bind(this);
    this.loadAnnotations = this.loadAnnotations.bind(this);

    this.scale = 1;
  }

  loadAnnotations() {
    db.find({ file: this.props.selectedFile, deleted: false }, (err, docs) => {
      if (err) {
        console.error(err);
      } else {
        this.setState({ annotations: docs });
        for (let doc of docs) {
          doc.x *= this.scale;
          doc.y *= this.scale;
          doc.width *= this.scale;
          doc.height *= this.scale;
        }
        this.annotationLayer.current.updateRects(docs);
      }
    });
  }

  exportAnnotationsToCsv() {
    db.find({ deleted: false }).sort({ file: 1 }).exec((err, docs) => {
      if (err) {
        console.error(err);
      } else {
        const headers = ['filepath', 'x', 'y', 'width', 'height'];
        const csvRows = [''];
        for (let doc of docs) {
          csvRows.push([doc.file, doc.x, doc.y, doc.width, doc.height].join(','));
        }
        csvRows.push('');
        const csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + csvRows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'annotations.csv');
        link.click();
      }
    });
  }

  componentDidMount() {
    this.setState({
      containerWidth: this.imageFrame.current.offsetWidth,
      containerHeight: this.imageFrame.current.offsetHeight
    });

    this.loadAnnotations();
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

          this.loadAnnotations();
        });
      };
    }
  }

  updateAnnotation(annotation) {
    db.findOne({
      file: this.props.selectedFile,
      name: annotation.name
    }, (err, doc) => {
      if (err) {
        console.error(err);
      } else {
        annotation.file = this.props.selectedFile;
        annotation.x = Math.round(annotation.x / this.scale);
        annotation.y = Math.round(annotation.y / this.scale);
        annotation.width = Math.round(annotation.width / this.scale);
        annotation.height = Math.round(annotation.height / this.scale);
        if (!doc) {
          db.insert(annotation, () => {
            this.loadAnnotations();
          });
        } else {
          db.update(doc, annotation, () => {
            this.loadAnnotations();
          });
        }
      }
    })
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

    this.scale = scale;

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
                              onUpdateRect={this.updateAnnotation}
                              rectangles={this.state.annotations}/>
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

        <button onClick={this.exportAnnotationsToCsv}>Save Annotations</button>

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
            Click the save button to export all annotation data to a CSV file
          </div>
        ) : ''
        }

      </div>
    );
  }
}

export default ImageLabeler;
