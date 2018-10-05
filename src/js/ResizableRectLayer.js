import React, { Component } from 'react';
import { Layer, Rect, Transformer } from 'react-konva';

class ResizableRect extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const shape = e.target;
    this.props.onTransform({
      x: shape.x(),
      y: shape.y(),
      width: shape.width() * shape.scaleX(),
      height: shape.height() * shape.scaleY(),
    });
  };

  render() {
    return (
      <Rect
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        scaleX={1}
        scaleY={1}
        fill={this.props.fill}
        stroke={this.props.stroke}
        opacity={this.props.opacity}
        name={this.props.name}
        onDragEnd={this.handleChange}
        onTransformEnd={this.handleChange}
        draggable
      />
    );
  }
}

class TransformerComponent extends Component {
  componentDidMount() {
    this.checkNode();
  }

  componentDidUpdate() {
    this.checkNode();
  }

  checkNode() {
    // here we need to manually attach or detach Transformer node
    const stage = this.transformer.getStage();
    const { selectedShapeName } = this.props;

    const selectedNode = stage.findOne('.' + selectedShapeName);
    // do nothing if selected node is already attached
    if (selectedNode === this.transformer.node()) {
      return;
    }

    if (selectedNode) {
      // attach to another node
      this.transformer.attachTo(selectedNode);
    } else {
      // remove transformer
      this.transformer.detach();
    }
    this.transformer.getLayer().batchDraw();
  }

  render() {
    return (
      <Transformer
        rotateEnabled={false}
        anchorSize={7}
        ref={node => {
          this.transformer = node;
        }}
      />
    );
  }
}

class ResizableRectLayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rectangles: props.rectangles,
      selectedShapeName: '',
      maxId: props.rectangles.length ? Math.max(...props.rectangles.map(r => Number(r.name))) : 0
    };

    this.onClick = this.onClick.bind(this);
    this.onDblClick = this.onDblClick.bind(this);
  }

  onClick(e) {
    if (e.target === e.target.getStage()) {
      this.setState({
        selectedShapeName: ''
      });
      return;
    }

    const clickedOnTransformer =
      e.target.getParent().className === 'Transformer';
    if (clickedOnTransformer) {

      return;
    }

    const name = e.target.name();
    const rect = this.state.rectangles.find(r => r.name === name);
    this.setState({
      selectedShapeName: rect ? name : ''
    });
  };

  onDblClick(e) {
    const name = e.target.name();
    const rect = this.state.rectangles.find(r => r.name === name);
    if (rect) {
      const updated = this.state.rectangles.filter(r => r.name === name)[0];
      updated.deleted = true;
      const rectangles = this.state.rectangles.filter(r => r.name !== name);
      this.setState({
        selectedShapeName: name,
        rectangles
      });
      this.props.onUpdateRect(updated);
    } else {
      const id = this.state.maxId + 1;
      const newRect = {
        x: e.evt.layerX - 25,
        y: e.evt.layerY - 25,
        width: 50,
        height: 50,
        fill: '#ff9e18',
        stroke: '#875400',
        strokeWidth: 5,
        opacity: 0.6,
        name: `${id}`,
        deleted: false
      };
      const rectangles = this.state.rectangles.slice();
      rectangles.push(newRect);
      this.setState({
        selectedShapeName: `${id}`,
        maxId: id,
        rectangles
      });
      this.props.onUpdateRect(newRect);
    }
  };

  handleRectChange = (index, newProps) => {
    const rectangles = this.state.rectangles.concat();
    newProps.width = Math.min(this.props.width, newProps.width);
    newProps.height = Math.min(this.props.height, newProps.height);
    newProps.x = Math.min(Math.max(newProps.x, 0), this.props.width - newProps.width);
    newProps.y = Math.min(Math.max(newProps.y, 0), this.props.height - newProps.height);
    rectangles[index] = {
      ...rectangles[index],
      ...newProps
    };

    this.setState({ rectangles });

    this.props.onUpdateRect(rectangles[index]);
  };

  updateRects(rectangles) {
    console.log('update');//
    this.setState({ rectangles })
  }

  render() {
    const rectangles = this.props.useExternalState ? this.props.rectangles : this.state.rectangles;

    return (
      <Layer>
        {rectangles.map((rect, i) => (
          <ResizableRect
            key={i}
            {...rect}
            onTransform={newProps => this.handleRectChange(i, newProps)}
          />
        ))}
        <TransformerComponent selectedShapeName={this.state.selectedShapeName}/>
      </Layer>
    );
  }
}

export default ResizableRectLayer;
