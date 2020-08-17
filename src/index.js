import * as tf from '@tensorflow/tfjs';

class Model {
  constructor() {
    this.NEW_OD_OUTPUT_TENSORS = ['detected_boxes', 'detected_scores', 'detected_classes'];
  }

  async loadModelAsync(modelUrl, options = null) {
    this.model = await tf.loadGraphModel(modelUrl, options);
    this.input_size = this.model.inputs[0].shape[1];
    this.is_new_od_model = this.model.outputs.length == 3;
  }

  dispose() {
    this.model.dispose();
  }

  async executeAsync(pixels) {
    const inputs = pixels instanceof tf.Tensor ? pixels : this._preprocess(tf.browser.fromPixels(pixels, 3));
    const outputs = await this.model.executeAsync(inputs, this.is_new_od_model ? this.NEW_OD_OUTPUT_TENSORS : null);
    const arrays = !Array.isArray(outputs) ? outputs.array() : Promise.all(outputs.map(t => t.array()));
    return await this._postprocess(await arrays);
  }

  async _postprocess(outputs) {
    return outputs;
  }
}

export class ObjectDetectionModel extends Model {
  constructor() {
    super();
    this.ANCHORS = [0.573, 0.677, 1.87, 2.06, 3.34, 5.47, 7.88, 3.53, 9.77, 9.17];
  }

  _preprocess(image) {
    const rgb_image = tf.image.resizeBilinear(image.expandDims().toFloat(), [this.input_size, this.input_size]);
    return this.is_new_od_model ? rgb_image : rgb_image.reverse(-1); // RGB->BGR for old models
  }

  async _postprocess(outputs) {
    if (outputs.length == 3) {
        return outputs; // New model doesn't need post processing.
    }

    // TODO: Need more efficient implmentation
    const num_anchor = this.ANCHORS.length / 2;
    const channels = outputs[0][0][0].length;
    const height = outputs[0].length;
    const width = outputs[0][0].length;

    const num_class = channels / num_anchor - 5;

    let boxes = [];
    let scores = [];
    let classes = [];

    for (var grid_y = 0; grid_y < height; grid_y++) {
      for (var grid_x = 0; grid_x < width; grid_x++) {
        let offset = 0;

        for (var i = 0; i < num_anchor; i++) {
          let x = (this._logistic(outputs[0][grid_y][grid_x][offset++]) + grid_x) / width;
          let y = (this._logistic(outputs[0][grid_y][grid_x][offset++]) + grid_y) / height;
          let w = Math.exp(outputs[0][grid_y][grid_x][offset++]) * this.ANCHORS[i * 2] / width;
          let h = Math.exp(outputs[0][grid_y][grid_x][offset++]) * this.ANCHORS[i * 2 + 1] / height;

          let objectness = tf.scalar(this._logistic(outputs[0][grid_y][grid_x][offset++]));
          let class_probabilities = tf.tensor1d(outputs[0][grid_y][grid_x].slice(offset, offset + num_class)).softmax();
          offset += num_class;

          class_probabilities = class_probabilities.mul(objectness);
          let max_index = class_probabilities.argMax();
          boxes.push([x - w / 2, y - h / 2, x + w / 2, y + h / 2]);
          scores.push(class_probabilities.max().dataSync()[0]);
          classes.push(max_index.dataSync()[0]);
        }
      }
    }

    boxes = tf.tensor2d(boxes);
    scores = tf.tensor1d(scores);
    classes = tf.tensor1d(classes);

    const selected_indices = await tf.image.nonMaxSuppressionAsync(boxes, scores, 10);
    return [await boxes.gather(selected_indices).array(), await scores.gather(selected_indices).array(), await classes.gather(selected_indices).array()];
  }

  _logistic(x) {
    if (x > 0) {
        return (1 / (1 + Math.exp(-x)));
    } else {
        const e = Math.exp(x);
        return e / (1 + e);
    }
  }
}

export class ClassificationModel extends Model {
  _preprocess(image) {
    // CenterCrop
    const [h, w] = image.shape.slice(0, 2);
    const top = h > w ? (h - w) / 2 : 0;
    const left = h > w ? 0 : (w - h) / 2;
    const size = Math.min(h, w);
    const rgb_image = tf.image.cropAndResize(image.expandDims().toFloat(), [[top / h, left / w, (top+size) / h, (left+size) / w]], [0], [this.input_size, this.input_size]);
    return rgb_image.reverse(-1); // RGB -> BGR;
  }
}
