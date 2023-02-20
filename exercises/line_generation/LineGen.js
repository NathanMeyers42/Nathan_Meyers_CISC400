// MultiPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
	'attribute vec4 a_Position;\n' +
	'void main() {\n' +
	'	gl_Position = a_Position;\n' +
	'	gl_PointSize = 10.0;\n' +
	'}\n';

// Fragment shader program
var FSHADER_SOURCE =
	'void main() {\n' +
	'	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
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

	// Write the positions of vertices to a vertex shader
	var n = initVertexBuffers(gl);
	if (n < 0) {
		console.log('Failed to set the positions of the vertices');
		return;
	}

	// Specify the color for clearing <canvas>
	gl.clearColor(0, 0, 0, 1);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Draw three points
	gl.drawArrays(gl.POINTS, 0, n);
}

let generateLine = (x1, y1, x2, y2) => {
	let dx = x2 - x1;
	let dy = y2 - y1;
	let steps = Math.max(dx, dy);
	let xInc = dx / steps;
	let yInc = dy / steps;
	let array = [];

	for (let i = 0; i < steps; i++) {
		array.push(Math.round(x1), Math.round(y1));
		x1 += xInc;
		y1 += yInc;
	}

	return array;
}

function initVertexBuffers(gl) {
	let array = generateLine(-10, -10, 15, 10);

	for (let i in array) {
		array[i] /= 20;
	}

	var vertices = new Float32Array(array);
	var n = array.length / 2; // The number of vertices

	// Create a buffer object
	var vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	// Bind the buffer object to target
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	// Write date into the buffer object
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return -1;
	}
	// Assign the buffer object to a_Position variable
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

	// Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);

	return n;
}
