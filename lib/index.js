"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObjectDetectionModel = exports.ClassificationModel = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var tf = _interopRequireWildcard(require("@tensorflow/tfjs"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Model = /*#__PURE__*/function () {
  function Model() {
    (0, _classCallCheck2.default)(this, Model);
    this.NEW_OD_OUTPUT_TENSORS = ['detected_boxes', 'detected_scores', 'detected_classes'];
  }

  (0, _createClass2.default)(Model, [{
    key: "loadModelAsync",
    value: function () {
      var _loadModelAsync = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(modelUrl) {
        var options,
            _args = arguments;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 1 && _args[1] !== undefined ? _args[1] : null;
                _context.next = 3;
                return tf.loadGraphModel(modelUrl, options);

              case 3:
                this.model = _context.sent;
                this.input_size = this.model.inputs[0].shape[1];
                this.is_new_od_model = this.model.outputs.length == 3;
                this.is_rgb_input = this.model.metadata && this.model.metadata['Image.BitmapPixelFormat'] == 'Rgb8' || this.is_new_od_model;

              case 7:
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
      var _executeAsync = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(pixels) {
        var _this = this;

        var inputs, outputs, arrays;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                inputs = tf.tidy(function () {
                  return pixels instanceof tf.Tensor ? pixels : _this._preprocess(tf.browser.fromPixels(pixels, 3));
                });
                _context2.next = 3;
                return this.model.executeAsync(inputs, this.is_new_od_model ? this.NEW_OD_OUTPUT_TENSORS : null);

              case 3:
                outputs = _context2.sent;
                tf.dispose(inputs);
                _context2.next = 7;
                return !Array.isArray(outputs) ? outputs.array() : Promise.all(outputs.map(function (t) {
                  return t.array();
                }));

              case 7:
                arrays = _context2.sent;
                tf.dispose(outputs);
                return _context2.abrupt("return", this._postprocess(arrays));

              case 10:
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
  }, {
    key: "_postprocess",
    value: function () {
      var _postprocess2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(outputs) {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", outputs);

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function _postprocess(_x3) {
        return _postprocess2.apply(this, arguments);
      }

      return _postprocess;
    }()
  }]);
  return Model;
}();

var ObjectDetectionModel = /*#__PURE__*/function (_Model) {
  (0, _inherits2.default)(ObjectDetectionModel, _Model);

  var _super = _createSuper(ObjectDetectionModel);

  function ObjectDetectionModel() {
    var _this2;

    (0, _classCallCheck2.default)(this, ObjectDetectionModel);
    _this2 = _super.call(this);
    _this2.ANCHORS = [0.573, 0.677, 1.87, 2.06, 3.34, 5.47, 7.88, 3.53, 9.77, 9.17];
    return _this2;
  }

  (0, _createClass2.default)(ObjectDetectionModel, [{
    key: "_preprocess",
    value: function _preprocess(image) {
      var rgb_image = tf.image.resizeBilinear(image.expandDims().toFloat(), [this.input_size, this.input_size]);
      return this.is_rgb_input ? rgb_image : rgb_image.reverse(-1); // RGB->BGR for old models
    }
  }, {
    key: "_postprocess",
    value: function () {
      var _postprocess3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(outputs) {
        var _this3 = this;

        var _tf$tidy, _tf$tidy2, boxes, scores, classes, selected_indices, tensor_results, results;

        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(outputs.length == 3)) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt("return", outputs);

              case 2:
                _tf$tidy = tf.tidy(function () {
                  // TODO: Need more efficient implmentation
                  var num_anchor = _this3.ANCHORS.length / 2;
                  var channels = outputs[0][0][0].length;
                  var height = outputs[0].length;
                  var width = outputs[0][0].length;
                  var num_class = channels / num_anchor - 5;
                  var boxes = [];
                  var scores = [];
                  var classes = [];

                  for (var grid_y = 0; grid_y < height; grid_y++) {
                    for (var grid_x = 0; grid_x < width; grid_x++) {
                      var offset = 0;

                      for (var i = 0; i < num_anchor; i++) {
                        var x = (_this3._logistic(outputs[0][grid_y][grid_x][offset++]) + grid_x) / width;
                        var y = (_this3._logistic(outputs[0][grid_y][grid_x][offset++]) + grid_y) / height;
                        var w = Math.exp(outputs[0][grid_y][grid_x][offset++]) * _this3.ANCHORS[i * 2] / width;
                        var h = Math.exp(outputs[0][grid_y][grid_x][offset++]) * _this3.ANCHORS[i * 2 + 1] / height;
                        var objectness = tf.scalar(_this3._logistic(outputs[0][grid_y][grid_x][offset++]));
                        var class_probabilities = tf.tensor1d(outputs[0][grid_y][grid_x].slice(offset, offset + num_class)).softmax();
                        offset += num_class;
                        class_probabilities = class_probabilities.mul(objectness);
                        var max_index = class_probabilities.argMax();
                        boxes.push([x - w / 2, y - h / 2, x + w / 2, y + h / 2]);
                        scores.push(class_probabilities.max().dataSync()[0]);
                        classes.push(max_index.dataSync()[0]);
                      }
                    }
                  }

                  boxes = tf.tensor2d(boxes);
                  scores = tf.tensor1d(scores);
                  classes = tf.tensor1d(classes);
                  return [boxes, scores, classes];
                }), _tf$tidy2 = (0, _slicedToArray2.default)(_tf$tidy, 3), boxes = _tf$tidy2[0], scores = _tf$tidy2[1], classes = _tf$tidy2[2];
                _context4.next = 5;
                return tf.image.nonMaxSuppressionAsync(boxes, scores, 10);

              case 5:
                selected_indices = _context4.sent;
                tensor_results = [boxes.gather(selected_indices), scores.gather(selected_indices), classes.gather(selected_indices)];
                _context4.next = 9;
                return tensor_results[0].array();

              case 9:
                _context4.t0 = _context4.sent;
                _context4.next = 12;
                return tensor_results[1].array();

              case 12:
                _context4.t1 = _context4.sent;
                _context4.next = 15;
                return tensor_results[2].array();

              case 15:
                _context4.t2 = _context4.sent;
                results = [_context4.t0, _context4.t1, _context4.t2];
                tf.dispose([boxes, scores, classes]);
                tf.dispose(selected_indices);
                tf.dispose(tensor_results);
                return _context4.abrupt("return", results);

              case 21:
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

var ClassificationModel = /*#__PURE__*/function (_Model2) {
  (0, _inherits2.default)(ClassificationModel, _Model2);

  var _super2 = _createSuper(ClassificationModel);

  function ClassificationModel() {
    (0, _classCallCheck2.default)(this, ClassificationModel);
    return _super2.apply(this, arguments);
  }

  (0, _createClass2.default)(ClassificationModel, [{
    key: "_preprocess",
    value: function _preprocess(image) {
      // CenterCrop
      var _image$shape$slice = image.shape.slice(0, 2),
          _image$shape$slice2 = (0, _slicedToArray2.default)(_image$shape$slice, 2),
          h = _image$shape$slice2[0],
          w = _image$shape$slice2[1];

      var top = h > w ? (h - w) / 2 : 0;
      var left = h > w ? 0 : (w - h) / 2;
      var size = Math.min(h, w);
      var rgb_image = tf.image.cropAndResize(image.expandDims().toFloat(), [[top / h, left / w, (top + size) / h, (left + size) / w]], [0], [this.input_size, this.input_size]);
      return this.is_rgb_input ? rgb_image : rgb_image.reverse(-1); // RGB->BGR for old models
    }
  }]);
  return ClassificationModel;
}(Model);

exports.ClassificationModel = ClassificationModel;