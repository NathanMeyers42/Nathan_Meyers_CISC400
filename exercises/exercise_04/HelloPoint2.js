// HelloPint2.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = 
	'attribute vec4 a_Position;\n' + // attribute variables
	'attribute float a_PointSize;\n' + 
	'void main() {\n' +
	'	gl_Position = a_Position;\n' +
	'	gl_PointSize = a_PointSize;\n' +
	'}\n'; 

// Fragment shader program
var FSHADER_SOURCE = 
	'void main() {\n' +
	'	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
	'}\n';

let getAttributeLoc = (context, attributeName) => {
	let location = context.getAttribLocation(context.program, attributeName);
	
	if (location < 0) {
		console.log("Failed to get the storage location of " + attributeName);
		return -1;
	}

	return location;
}

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

	// Get the storage locations
	a_Position = getAttributeLoc(gl, "a_Position")
	a_PointSize = getAttributeLoc(gl, "a_PointSize")

	// Pass vertex position and point size to attribute variables
	gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
	gl.vertexAttrib1f(a_PointSize, 42.0);

	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);
		
	// Draw
	gl.drawArrays(gl.POINTS, 0, 1);
}
