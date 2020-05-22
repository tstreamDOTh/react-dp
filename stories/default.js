import React, { useRef } from 'react';
import { storiesOf } from '@storybook/react';
import DisplayPicEditor from '../src/displaypiceditor';

storiesOf('DisplayPicEditor', module)
  .add('Landscape with Overlay', () => {
    const dpEditor = useRef();

    return (
      <>
        <DisplayPicEditor
          ref={dpEditor}
          src='https://media.kubric.io/api/assetlib/30d7c592-0196-4dbe-af37-4e28582e537f.jpg'
          overlay='https://media.kubric.io/api/assetlib/a80605c8-d308-4b59-9c13-15a9ad1952ac.png'
          size={400}
          backgroundColor='#666'
        />

        <button
          onClick={() => {
            dpEditor.current.saveAsImage();
          }}>
          Save Image
        </button>
      </>
    );
  })
  .add('Potrait with Overlay', () => (
    <DisplayPicEditor
      src='https://media.kubric.io/api/assetlib/83e20ab9-43ff-4a96-afd1-94f26f1b77f1.png'
      overlay='https://media.kubric.io/api/assetlib/a80605c8-d308-4b59-9c13-15a9ad1952ac.png'
      size={400}
      backgroundColor='#888'
    />
  ))
  .add('Potrait', () => {
    const dpEditor = useRef();

    return (
      <>
        <DisplayPicEditor
          ref={dpEditor}
          src='https://media.kubric.io/api/assetlib/83e20ab9-43ff-4a96-afd1-94f26f1b77f1.png'
          size={400}
          backgroundColor='#888'
        />
        <button
          onClick={() => {
            dpEditor.current.saveAsImage();
          }}>
          Save Image
        </button>
      </>
    );
  })
  .add('Landscape', () => (
    <DisplayPicEditor src='https://media.kubric.io/api/assetlib/30d7c592-0196-4dbe-af37-4e28582e537f.jpg' size={400} backgroundColor='#888' />
  ));
