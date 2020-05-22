'use strict';
import React from 'react';
import { noop } from './utils';

const getClient = (event) => {
  if (event.clientX) {
    return event;
  } else {
    return event.touches[0];
  }
};

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

  onDragEnd(event) {
    const { offsetX, offsetY, imagePositionX, imagePositionY } = this.state;
    this.setState({
      offsetX: 0,
      offsetY: 0,
      imagePositionX: imagePositionX + offsetX,
      imagePositionY: imagePositionY + offsetY,
    });
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('touchmove', this.onDrag);
  }

  onDrag(event) {
    event.preventDefault();
    if (!this.animationFired) {
      this.animationStarted = true;
      requestAnimationFrame(() => {
        this.animationStarted = false;
        const { size } = this.props;
        const { startPointX, startPointY, imagePositionX, imagePositionY, offsetY, offsetX } = this.state;

        const { clientX, clientY } = getClient(event);

        let calculatedOffsetX = clientX - startPointX;
        let calculatedOffsetY = clientY - startPointY;

        const { height: imageHeight, width: imageWidth } = this.image.getBoundingClientRect();

        if (calculatedOffsetX + imagePositionX > 0) {
          calculatedOffsetX = -imagePositionX;
        }

        if (calculatedOffsetY + imagePositionY > 0) {
          calculatedOffsetY = -imagePositionY;
        }

        if (calculatedOffsetX + imagePositionX < -(imageWidth - size)) {
          calculatedOffsetX = -(imageWidth - size) - imagePositionX;
        }

        if (calculatedOffsetY + imagePositionY < -(imageHeight - size)) {
          calculatedOffsetY = -(imageHeight - size) - imagePositionY;
        }

        this.setState({
          offsetX: calculatedOffsetX,
          offsetY: calculatedOffsetY,
        });
      });
    }
  }

  onDragStart(event) {
    this.setState({
      startPointX: getClient(event).clientX,
      startPointY: getClient(event).clientY,
    });
    document.addEventListener('mousemove', this.onDrag, { passive: false });
    document.addEventListener('mouseup', this.onDragEnd);
    document.addEventListener('touchmove', this.onDrag, { passive: false });
    document.addEventListener('touchend', this.onDragEnd);
  }

  componentDidMount() {
    this.interactionZone.addEventListener('mousedown', this.onDragStart);
    this.interactionZone.addEventListener('touchstart', this.onDragStart);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onDragEnd);
    document.removeEventListener('touchend', this.onDragEnd);
  }

  saveAsImage() {
    const { size, src, overlay, enableDownload = true, onExportCallback = noop } = this.props;
    const { imagePositionX, imagePositionY } = this.state;
    const { height: imageHeight, width: imageWidth } = this.image.getBoundingClientRect();

    const canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.canvas.width = size;
    context.canvas.height = size;

    if (enableDownload) {
      var baseImage = new Image();

      baseImage.onload = () => {
        context.drawImage(baseImage, imagePositionX, imagePositionY, imageWidth, imageHeight);
        var overlayImage = new Image();

        if (overlay) {
          overlayImage.onload = () => {
            context.drawImage(overlayImage, 0, 0, size, size);

            window.location.href = canvas.toDataURL().replace('image/png', 'image/octet-stream');
          };
          overlayImage.setAttribute('crossorigin', 'anonymous');
          overlayImage.setAttribute('src', overlay);
        } else {
          window.location.href = canvas.toDataURL().replace('image/png', 'image/octet-stream');
        }
      };

      baseImage.setAttribute('crossorigin', 'anonymous');
      baseImage.setAttribute('src', src);
    }

    onExportCallback({
      imagePositionX,
      imagePositionY,
      imageWidth,
      imageHeight,
      size,
    });
  }

  render() {
    const { src, size, boundryOffset = 20, ref, overlay } = this.props;
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
              top: imagePositionY,
              left: imagePositionX,
              transform: `translate(${offsetX}px, ${offsetY}px)`,
            }}
          />
          {overlay && (
            <img
              draggable={false}
              src={overlay}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                objectFit: 'contain',
                pointerEvents: 'none',
              }}
            />
          )}
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
