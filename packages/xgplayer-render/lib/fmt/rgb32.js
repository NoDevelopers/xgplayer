'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _filter = require('../filter');

var _filter2 = _interopRequireDefault(_filter);

var _glutil = require('../glutil');

var _glutil2 = _interopRequireDefault(_glutil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rgb32 = function (_Filter) {
  _inherits(Rgb32, _Filter);

  function Rgb32(config) {
    _classCallCheck(this, Rgb32);

    var _this = _possibleConstructorReturn(this, (Rgb32.__proto__ || Object.getPrototypeOf(Rgb32)).call(this));

    _this.vShader = ['attribute vec4 vertexPos;', 'attribute vec2 texturePos;', 'varying vec2 textureCoord;', 'void main()', '{', '  gl_Position = vertexPos;', '  textureCoord = texturePos;', '}'].join('\n');
    _this.fShader = ['precision highp float;', 'varying highp vec2 textureCoord;', 'uniform sampler2D sampler;', 'void main(void) {', '  vec4 color = texture2D(sampler, textureCoord);', '  gl_FragColor = vec4(color[2],color[1],color[0],color[3]);', '}'].join('\n');
    return _this;
  }

  _createClass(Rgb32, [{
    key: 'init',
    value: function init(render) {
      this.rend = render;
      this.canvas = render.canvas;
      var gl = this.gl = render.gl;
      this.pw = _glutil2.default.createProgram(gl, this.vShader, this.fShader);
      this.program = this.pw.program;

      gl.useProgram(this.program);
      // vertexPos
      var vertexPosBuffer = _glutil2.default.createBuffer(gl, new Float32Array([1, 1, -1, 1, 1, -1, -1, -1]));
      _glutil2.default.bindAttribute(gl, vertexPosBuffer, this.pw.vertexPos, 2);

      // texturePos
      this.texturePosBuffer = _glutil2.default.createBuffer(gl, new Float32Array([1, 0, 0, 0, 1, 1, 0, 1]));
      _glutil2.default.bindAttribute(gl, this.texturePosBuffer, this.pw.texturePos, 2);

      var textureRef = _glutil2.default.createTexture(gl, gl.LINEAR);
      gl.uniform1i(this.pw.sampler, 0);

      this.inputTextures.push(textureRef);
    }
  }, {
    key: 'render',
    value: function render(data, width, height) {
      data = data[0];
      var gl = this.gl;
      var program = this.program;
      var textureRef = this.inputTextures[0];

      if (this.width !== width || this.height !== height) {
        this.width = width;
        this.height = height;
        this.outputTexuture = _glutil2.default.createTexture(gl, gl.LINEAR, new Uint8Array(width * height * 4), width, height);
      }

      if (!this.outputTexuture) {
        this.outputTexuture = _glutil2.default.createTexture(gl, gl.LINEAR, new Uint8Array(width * height * 4), width, height);
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, this.rend.fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.outputTexuture, 0);

      gl.useProgram(program);
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textureRef);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      return {
        texture: this.outputTexuture,
        width: width,
        height: height
      };
    }
  }]);

  return Rgb32;
}(_filter2.default);

exports.default = Rgb32;