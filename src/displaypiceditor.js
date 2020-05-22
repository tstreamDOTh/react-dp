'use strict';
import React from 'react';

export default class DisplayPicEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePositionX: 0,
      imagePositionY: 0,
    };

    this.onDragStart = this.onDragStart.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd() {
    const { offsetX, offsetY, imagePositionX, imagePositionY } = this.state;
    this.setState({
      offsetX: 0,
      offsetY: 0,
      imagePositionX: imagePositionX + offsetX,
      imagePositionY: imagePositionY + offsetY,
    });
    document.removeEventListener('mousemove', this.onDrag);
  }

  onDrag(event) {
    if (!this.animationFired) {
      this.animationStarted = true;
      requestAnimationFrame(() => {
        const { size } = this.props;
        const { startPointX, startPointY, imagePositionX, imagePositionY, offsetY, offsetX } = this.state;

        let calculatedOffsetX = event.clientX - startPointX;
        let calculatedOffsetY = event.clientY - startPointY;

        const { height: imageHeight, width: imageWidth } = this.image.getBoundingClientRect();

        if (calculatedOffsetX + imagePositionX > 0) {
          calculatedOffsetX = offsetX;
        }

        if (calculatedOffsetY + imagePositionY > 0) {
          calculatedOffsetY = offsetY;
        }

        if (calculatedOffsetX + imagePositionX < -(imageWidth - size)) {
          calculatedOffsetX = offsetX;
        }

        if (calculatedOffsetY + imagePositionY < -(imageHeight - size)) {
          calculatedOffsetY = offsetY;
        }

        this.setState({
          offsetX: calculatedOffsetX,
          offsetY: calculatedOffsetY,
        });

        this.animationStarted = false;
      });
    }
  }

  onDragStart(event) {
    this.setState({
      startPointX: event.clientX,
      startPointY: event.clientY,
    });
    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.onDragEnd);
  }

  componentDidMount() {
    this.interactionZone.addEventListener('mousedown', this.onDragStart);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onDragEnd);
  }

  saveAsImage() {
    const { size, src } = this.props;
    const { imagePositionX, imagePositionY } = this.state;

    const canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.canvas.width = size;
    context.canvas.height = size;

    var img = new Image();

    img.onload = () => {
      context.drawImage(img, imagePositionX, imagePositionY);
      console.log(canvas.toDataURL());
    };
    img.setAttribute('crossorigin', 'anonymous');
    img.setAttribute('src', src);
  }

  render() {
    const { src, size, boundryOffset = 20, ref } = this.props;
    const { imagePositionX, imagePositionY, offsetX, offsetY, isImageLoaded, isPotrait } = this.state;
    return (
      <div
        ref={ref}
        style={{
          height: `${size + boundryOffset * 2}px`,
          width: `${size + boundryOffset * 2}px`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'black',
          overflow: 'hidden',
          position: 'relative',
        }}>
        <div
          style={{ height: `${size}px`, width: `${size}px`, position: 'relative', cursor: 'move', background: 'black' }}
          ref={(ref) => {
            this.interactionZone = ref;
          }}>
          <img
            ref={(ref) => {
              this.image = ref;
            }}
            draggable={false}
            src={src}
            onLoad={(event) => {
              this.setState({
                isImageLoaded: true,
                isPotrait: event.target.naturalHeight > event.target.naturalWidth,
              });
            }}
            style={{
              ...(isPotrait ? { width: '100%' } : { height: '100%' }),
              display: isImageLoaded ? 'initial' : 'none',
              position: 'absolute',
              transform: `translate(${imagePositionX + offsetX}px, ${imagePositionY + offsetY}px)`,
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            border: ` ${boundryOffset}px solid #000000b5`,
            pointerEvents: 'none',
          }}></div>
      </div>
    );
  }
}
