// Vertex shader program
let VSHADER_SOURCE = `
	attribute vec4 a_Position;
	uniform mat4 u_ModelMatrix;
	
	void main() {
		gl_Position = u_ModelMatrix * a_Position;
		gl_PointSize = 10.0;
	}
`;

// Fragment shader program
let FSHADER_SOURCE = `
	void main() {
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	}
`;

// Simple data structure to hold a 2D vector
class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

// Main function
let main = () => {
	let canvas = getCanvas()
	let gl = getGlEnvironment(canvas);

	// Write the positions of vertices to a vertex shader
	let n = initVertexBuffers(gl, [0, 0]);
	if (n < 0) {
		console.log('Failed to set the positions of the vertices');
		return;
	}

	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Get storage location of u_ModelMatrix
	let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	if (!u_ModelMatrix) { 
		console.log('Failed to get the storage location of u_ModelMatrix');
		return;
	}

	// Model matrix
	let modelMatrix = new Matrix4();

	// Start drawing
	let tick = () => {
		let currentPosition = animate(); // Update the position
		draw(gl, n, currentPosition, modelMatrix, u_ModelMatrix); // Draw the triangle
		requestAnimationFrame(tick, canvas); // Request that the browser calls tick
	};

	tick();
}

// Function to get the canvas DOM object
let getCanvas = () => {
	return document.getElementById('webgl');
}

// Function to set up and get the WebGL Context.
let getGlEnvironment = (canvas) => {
	// Get the rendering context for WebGL
	let gl = getWebGLContext(canvas);
	if (!gl) {
		console.log('Failed to get the rendering context for WebGL');
		return;
	}

	// Initialize shaders
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Failed to intialize shaders.');
		return;
	}

	return gl
}

// Function to initialize the vertex buffers.
let initVertexBuffers = (gl, vertex_array) => {
	let vertices = new Float32Array(vertex_array);
	let n = vertex_array.length/2;

	// Create a buffer object
	let vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	// Bind the buffer object to target
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	// Write data into the buffer object
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	// Assign the buffer object to a_Position variable
	let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if(a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return -1;
	}
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

	// Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);

	return n;
}

// Function to clear the screen and draw the model.
let draw = (gl, n, position, modelMatrix, u_ModelMatrix) => {
	// Set the rotation matrix
	modelMatrix.setTranslate(position.x, position.y, 0);
 
	// Pass the rotation matrix to the vertex shader
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Draw the point
	gl.drawArrays(gl.POINTS, 0, n);
}


const START_TIME = Date.now(); // Used in timing calculations
const MOVE_STEP = 0.5; // The distance to move per second?

let animate = () => {
	// Calculate the elapsed time since the start of the program.
	let elapsed = Date.now() - START_TIME;
	
	// Calculate the x position of the point, 
	//with 0 being the left side of the screen.
	let x = ((1.0 + (MOVE_STEP * elapsed) / 1000.0)) % 4;

	// Mirror and go in reverse if x > 2.
	if (x > 2) {
		x = 2 - x%2;
	}

	// Create the position vector
	let position = new Vector2(x - 1, 0); // Mubtract 1 from x to change bounds from (0, 2) to (-1, 1).
	position.y = Math.sin(position.x * 10) / 5; // Move y in a sinusoid pattern as a function of x

	return position;
}
