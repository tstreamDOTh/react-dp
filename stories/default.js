import React, { useRef } from 'react';
import { storiesOf } from '@storybook/react';
import DisplayPicEditor from '../src/displaypiceditor';

storiesOf('DisplayPicEditor', module)
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
