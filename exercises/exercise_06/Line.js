// ClickedPints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 5.0;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision highp float;\n' +
  'uniform vec4 u_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_Color;\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  let pointData = [];

  for (let i = 0; i <= 200; i++) {
  	let arrayPos = i * 5;
  	pointData[arrayPos] = (i-100)/100;
  	pointData[arrayPos+1] = -(i-100)/100;
  	pointData[arrayPos+2] = Math.random();
  	pointData[arrayPos+3] = Math.random();
  	pointData[arrayPos+4] = Math.random();
  }

  render(gl, canvas, pointData);
}

function render(gl, canvas, points) {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  var u_Color = gl.getUniformLocation(gl.program, "u_Color");

  var len = points.length;
  for(var i = 0; i < len; i += 5) {
    // Pass the position of a point to a_Position variable
    gl.vertexAttrib3f(a_Position, points[i], points[i+1], 0.0);
    gl.uniform4f(u_Color, points[i+2], points[i+3], points[i+4], 1.0);

    // Draw
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
