// HelloTriangle_FragCoord.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
	'attribute vec4 a_Position;\n' +
	'attribute vec4 a_Color;\n' +
	'varying vec4 v_Color;\n' +
	'void main() {\n' +
	'	gl_Position = a_Position;\n' +
	'	v_Color = a_Color;\n' +
	'}\n';

// Fragment shader program
var FSHADER_SOURCE =
	'precision mediump float;\n' +
	//'uniform float u_Width;\n' +
	//'uniform float u_Height;\n' +
	'varying vec4 v_Color;\n' +
	'void main() {\n' +
	//'	gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);\n' +
	'	gl_FragColor = v_Color;\n' +
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
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Draw the rectangle
	gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
	var vertices = new Float32Array([
		-0.5, -0.5, 1, 0, 0,
		-0.5, 0.5, 0, 1, 0,
		0.5, -0.5, 0, 0, 1,
		-0.5, 0.5, 0, 1, 0,
		0.5, -0.5, 0, 0, 1,
		0.5, 0.5, 1, 0, 1,
	]);
	var n = 6; // The number of vertices
	var FSIZE = vertices.BYTES_PER_ELEMENT;

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

	// Pass the position of a point to a_Position variable
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return -1;
	}
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);

	var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Color');
		return -1;
	}
	gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);

	// var u_Width = gl.getUniformLocation(gl.program, 'u_Width');
	// if (!u_Width) {
	// 	console.log('Failed to get the storage location of u_Width');
	// 	return;
	// }

	// var u_Height = gl.getUniformLocation(gl.program, 'u_Height');
	// if (!u_Height) {
	// 	console.log('Failed to get the storage location of u_Height');
	// 	return;
	// }

	// // Pass the width and hight of the <canvas>
	// gl.uniform1f(u_Width, gl.drawingBufferWidth);
	// gl.uniform1f(u_Height, gl.drawingBufferHeight);

	// Enable the generic vertex attribute array
	gl.enableVertexAttribArray(a_Position);
	gl.enableVertexAttribArray(a_Color);

	// Unbind the buffer object
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return n;
}
