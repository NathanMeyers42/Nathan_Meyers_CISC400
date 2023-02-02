// This script approximates a circle by drawing a 128-sided polygon.
// x^2 + y^2 = r^2 would be useful for calculating a vector magnitude given points on a circle,
// but I did the reverse: calculating the x and y coordinates of a vector given a direction and magnitude.
// This approach makes it easy to add points in a circle around a center point.

let VSHADER_SOURCE = `
	attribute vec4 a_Position; // attribute variables

	void main() {
		gl_Position = a_Position;
	}
`;

// Fragment shader program
let FSHADER_SOURCE = `
	void main() {
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	}
`;

// Get the location ID number of a shader attribute
let getAttributeID = (context, attributeName) => {
	let location = context.getAttribLocation(context.program, attributeName);
	
	if (location < 0) {
		console.log("Failed to get the storage location of " + attributeName);
		return -1;
	}

	return location;
}

// Initializes the vertex buffer
let initVertexBuffer = (gl) => {
	// Create a buffer object
	var vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	// Bind the buffer object to target
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	var a_Position = getAttributeID(gl, "a_Position");

	// Assign the buffer object to a_Position variable
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

	// Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);
}

let drawTriangles = (gl, vertices) => {
	var n = vertices.length / 2; // The number of vertices

	// Write date into the buffer object
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	gl.drawArrays(gl.TRIANGLES, 0, n);
}

// This function takes a magnitude and a direction in radians and
// returns a pair of coordinates corresponding to the location of
// the given vector
let vector2 = (direction, magnitude) => {
	return {
		x: magnitude * Math.cos(direction),
		y: magnitude * Math.sin(direction),
	};
}

// Draws an n-sided regular polygon. Sides is n and radius is the distance
// of each point from the center
let polygon = (radius, sides) => {
	vertices = new Float32Array(sides*3*2) // Each side is a triangle, like a pizza

	let center = vector2(0, 0);
	let previous_vec = vector2(0, 0);
	let current_vec = vector2(0, radius);

	// For each side
	for (let i = 0; i < sides; i++) {
		// Calculate vectors
		previous_vec = current_vec
		current_vec = vector2(2*Math.PI*((i+1)/sides), radius);

		// Add vertices to the array
		vertices[i*6 + 0] = center.x;
		vertices[i*6 + 1] = center.y;
		vertices[i*6 + 2] = previous_vec.x;
		vertices[i*6 + 3] = previous_vec.y;
		vertices[i*6 + 4] = current_vec.x;
		vertices[i*6 + 5] = current_vec.y;
	}

	return vertices;
}

// Main function
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

	initVertexBuffer(gl);

	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);
		
	drawTriangles(gl, polygon(0.5, 128));
}