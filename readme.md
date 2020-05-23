# react-dp

<a href="https://www.npmjs.com/package/react-dp"><img alt="npm version" src="https://badge.fury.io/js/react-dp.svg"></a>
<a href="https://npmjs.org/package/react-dp"><img alt="Downloads" src="http://img.shields.io/npm/dm/react-dp.svg"></a>

Twitter like profile picture component & add custom overlay.
📸Export as base64 image using a clear user interface.

# Install

Just use yarn or npm to add it to your project:

```
yarn add react-dp
```

respective

```
npm install --save react-dp
```

# Usage

```javascript
import React, { useRef } from 'react';
import DisplayPicEditor from 'react-dp';

class MyEditor extends React.Component {
  render() {
    return (
      <DisplayPicEditor
        src='https://media.kubric.io/api/assetlib/83e20ab9-43ff-4a96-afd1-94f26f1b77f1.png'
        overlay='https://media.kubric.io/api/assetlib/a80605c8-d308-4b59-9c13-15a9ad1952ac.png'
        size={400}
        backgroundColor='#888'
      />
        <button
          onClick={() => {
            dpEditor.current.saveAsImage();
          }}>
          Save Image
        </button>˝
    );
  }
}

export default MyEditor;
```