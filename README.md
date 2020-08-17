# customvision-tfjs
NPM package for TensorFlow.js models exported from Custom Vision Service

This package is for web browsers. If you are looking for a library to run on Node.js environment, please use [customvision-tfjs-node](https://github.com/microsoft/customvision-tfjs-node).

## Install
```sh
npm install @microsoft/customvision-tfjs
```

Or, if you would like to use CDN,

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.2/dist/tf.min.js"></script>
<script src="https://unpkg.com/@microsoft/customvision-tfjs"></script>
```

## Usage

```html
<img id="image" src="test_image.jpg" />
```

### Classification
```js
import * as cvstfjs from '@microsoft/customvision-tfjs';

let model = new cvstfjs.ClassificationModel();
await model.loadModelAsync('model.json');
const image = document.getElementById('image');
const result = await model.executeAsync(image);
```

The result is a 1D-array of probabilities.

### Object Detection
```js
import * as cvstfjs from '@microsoft/customvision-tfjs';

let model = new cvstfjs.ObjectDetectionModel();
await model.loadModelAsync('model.json');
const image = document.getElementById('image');
const result = await model.executeAsync(image);
```

The result has 3 arrays.
```js

[
	[[0.1, 0.3, 0.4, 0.3], [0.2, 0.4, 0.8, 0.9]], // bounding boxes (x1, y1, x2, y2)
	[0.2, 0.3], // probabilities
	[1, 4] // class ids
]
```

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
