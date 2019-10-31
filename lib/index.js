"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClassificationModel = exports.ObjectDetectionModel = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var tf = _interopRequireWildcard(require("@tensorflow/tfjs"));

var Model =
/*#__PURE__*/
function () {
  function Model() {
    (0, _classCallCheck2["default"])(this, Model);
  }

  (0, _createClass2["default"])(Model, [{
    key: "loadModelAsync",
    value: function () {
      var _loadModelAsync = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(modelUrl) {
        var options,
            _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 1 && _args[1] !== undefined ? _args[1] : null;
                _context.next = 3;
                return tf.loadGraphModel(modelUrl, options);

              case 3:
                this.model = _context.sent;

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadModelAsync(_x) {
        return _loadModelAsync.apply(this, arguments);
      }

      return loadModelAsync;
    }()
  }, {
    key: "dispose",
    value: function dispose() {
      this.model.dispose();
    }
  }, {
    key: "executeAsync",
    value: function () {
      var _executeAsync = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(pixels) {
        var inputs, outputs;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                inputs = pixels instanceof tf.Tensor ? pixels : this._preprocess(tf.browser.fromPixels(pixels, 3));
                outputs = this.model.execute(inputs);
                _context2.t0 = this;
                _context2.next = 5;
                return outputs.array();

              case 5:
                _context2.t1 = _context2.sent;
                _context2.next = 8;
                return _context2.t0._postprocess.call(_context2.t0, _context2.t1);

              case 8:
                return _context2.abrupt("return", _context2.sent);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function executeAsync(_x2) {
        return _executeAsync.apply(this, arguments);
      }

      return executeAsync;
    }()
  }]);
  return Model;
}();

var ObjectDetectionModel =
/*#__PURE__*/
function (_Model) {
  (0, _inherits2["default"])(ObjectDetectionModel, _Model);

  function ObjectDetectionModel() {
    var _this;

    (0, _classCallCheck2["default"])(this, ObjectDetectionModel);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ObjectDetectionModel).call(this));
    _this.ANCHORS = [0.573, 0.677, 1.87, 2.06, 3.34, 5.47, 7.88, 3.53, 9.77, 9.17];
    _this.INPUT_SIZE = 416;
    return _this;
  }

  (0, _createClass2["default"])(ObjectDetectionModel, [{
    key: "_preprocess",
    value: function _preprocess(image) {
      var rgb_image = tf.image.resizeBilinear(image.expandDims().toFloat(), [this.INPUT_SIZE, this.INPUT_SIZE]);
      return rgb_image.reverse(-1); // RGB -> BGR
    }
  }, {
    key: "_postprocess",
    value: function () {
      var _postprocess2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(outputs) {
        var num_anchor, channels, height, width, num_class, boxes, scores, classes, grid_y, grid_x, offset, i, x, y, w, h, objectness, class_probabilities, max_index, selected_indices;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // TODO: Need more efficient implmentation
                num_anchor = this.ANCHORS.length / 2;
                channels = outputs[0][0][0].length;
                height = outputs[0].length;
                width = outputs[0][0].length;
                num_class = channels / num_anchor - 5;
                boxes = [];
                scores = [];
                classes = [];

                for (grid_y = 0; grid_y < height; grid_y++) {
                  for (grid_x = 0; grid_x < width; grid_x++) {
                    offset = 0;

                    for (i = 0; i < num_anchor; i++) {
                      x = (this._logistic(outputs[0][grid_y][grid_x][offset++]) + grid_x) / width;
                      y = (this._logistic(outputs[0][grid_y][grid_x][offset++]) + grid_y) / height;
                      w = Math.exp(outputs[0][grid_y][grid_x][offset++]) * this.ANCHORS[i * 2] / width;
                      h = Math.exp(outputs[0][grid_y][grid_x][offset++]) * this.ANCHORS[i * 2 + 1] / height;
                      objectness = tf.scalar(this._logistic(outputs[0][grid_y][grid_x][offset++]));
                      class_probabilities = tf.tensor1d(outputs[0][grid_y][grid_x].slice(offset, offset + num_class)).softmax();
                      offset += num_class;
                      class_probabilities = class_probabilities.mul(objectness);
                      max_index = class_probabilities.argMax();
                      boxes.push([x - w / 2, y - h / 2, x + w / 2, y + h / 2]);
                      scores.push(class_probabilities.max().dataSync()[0]);
                      classes.push(max_index.dataSync()[0]);
                    }
                  }
                }

                boxes = tf.tensor2d(boxes);
                scores = tf.tensor1d(scores);
                classes = tf.tensor1d(classes);
                _context3.next = 14;
                return tf.image.nonMaxSuppressionAsync(boxes, scores, 10);

              case 14:
                selected_indices = _context3.sent;
                _context3.next = 17;
                return boxes.gather(selected_indices).array();

              case 17:
                _context3.t0 = _context3.sent;
                _context3.next = 20;
                return scores.gather(selected_indices).array();

              case 20:
                _context3.t1 = _context3.sent;
                _context3.next = 23;
                return classes.gather(selected_indices).array();

              case 23:
                _context3.t2 = _context3.sent;
                return _context3.abrupt("return", [_context3.t0, _context3.t1, _context3.t2]);

              case 25:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _postprocess(_x3) {
        return _postprocess2.apply(this, arguments);
      }

      return _postprocess;
    }()
  }, {
    key: "_logistic",
    value: function _logistic(x) {
      if (x > 0) {
        return 1 / (1 + Math.exp(-x));
      } else {
        var e = Math.exp(x);
        return e / (1 + e);
      }
    }
  }]);
  return ObjectDetectionModel;
}(Model);

exports.ObjectDetectionModel = ObjectDetectionModel;

var ClassificationModel =
/*#__PURE__*/
function (_Model2) {
  (0, _inherits2["default"])(ClassificationModel, _Model2);

  function ClassificationModel() {
    var _this2;

    (0, _classCallCheck2["default"])(this, ClassificationModel);
    _this2 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ClassificationModel).call(this));
    _this2.INPUT_SIZE = 224;
    return _this2;
  }

  (0, _createClass2["default"])(ClassificationModel, [{
    key: "_postprocess",
    value: function () {
      var _postprocess3 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(outputs) {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", outputs);

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function _postprocess(_x4) {
        return _postprocess3.apply(this, arguments);
      }

      return _postprocess;
    }()
  }, {
    key: "_preprocess",
    value: function _preprocess(image) {
      // CenterCrop
      var _image$shape$slice = image.shape.slice(0, 2),
          _image$shape$slice2 = (0, _slicedToArray2["default"])(_image$shape$slice, 2),
          h = _image$shape$slice2[0],
          w = _image$shape$slice2[1];

      var top = h > w ? (h - w) / 2 : 0;
      var left = h > w ? 0 : (w - h) / 2;
      var size = Math.min(h, w);
      var rgb_image = tf.image.cropAndResize(image.expandDims().toFloat(), [[top / h, left / w, (top + size) / h, (left + size) / w]], [0], [this.INPUT_SIZE, this.INPUT_SIZE]);
      return rgb_image.reverse(-1); // RGB -> BGR;
    }
  }]);
  return ClassificationModel;
}(Model);

exports.ClassificationModel = ClassificationModel;