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
		gl_FragColor = vec4(1.0, 0.82, 0.0, 1.0);
	}
`;

// Mesh data.
// The mesh is rotated wrong because which axis means which direction is a complete
// crapshoot in computer graphics.
let MESH = [
	0.000000, -0.050000, 0.500000,
	-0.250000, -0.050000, 0.100000,
	0.250000, -0.050000, 0.100000,
	-0.250000, -0.050000, 0.100000,
	-0.500000, -0.050000, -0.300000,
	0.000000, -0.050000, -0.300000,
	0.250000, -0.050000, 0.100000,
	0.000000, -0.050000, -0.300000,
	0.500000, -0.050000, -0.300000,
	0.000000, 0.050000, 0.500000,
	0.250000, 0.050000, 0.100000,
	-0.250000, 0.050000, 0.100000,
	-0.250000, 0.050000, 0.100000,
	0.000000, 0.050000, -0.300000,
	-0.500000, 0.050000, -0.300000,
	0.250000, 0.050000, 0.100000,
	0.500000, 0.050000, -0.300000,
	0.000000, 0.050000, -0.300000,
	0.000000, -0.050000, -0.300000,
	-0.500000, 0.050000, -0.300000,
	0.000000, 0.050000, -0.300000,
	0.250000, -0.050000, 0.100000,
	-0.250000, 0.050000, 0.100000,
	0.250000, 0.050000, 0.100000,
	-0.250000, -0.050000, 0.100000,
	-0.500000, 0.050000, -0.300000,
	-0.500000, -0.050000, -0.300000,
	0.000000, -0.050000, 0.500000,
	-0.250000, 0.050000, 0.100000,
	-0.250000, -0.050000, 0.100000,
	0.250000, -0.050000, 0.100000,
	0.000000, 0.050000, -0.300000,
	0.000000, -0.050000, -0.300000,
	0.250000, -0.050000, 0.100000,
	0.000000, 0.050000, 0.500000,
	0.000000, -0.050000, 0.500000,
	0.500000, -0.050000, -0.300000,
	0.250000, 0.050000, 0.100000,
	0.250000, -0.050000, 0.100000,
	0.000000, -0.050000, -0.300000,
	-0.250000, 0.050000, 0.100000,
	-0.250000, -0.050000, 0.100000,
	0.500000, -0.050000, -0.300000,
	0.000000, 0.050000, -0.300000,
	0.500000, 0.050000, -0.300000,
	0.000000, -0.050000, -0.300000,
	-0.500000, -0.050000, -0.300000,
	-0.500000, 0.050000, -0.300000,
	0.250000, -0.050000, 0.100000,
	-0.250000, -0.050000, 0.100000,
	-0.250000, 0.050000, 0.100000,
	-0.250000, -0.050000, 0.100000,
	-0.250000, 0.050000, 0.100000,
	-0.500000, 0.050000, -0.300000,
	0.000000, -0.050000, 0.500000,
	0.000000, 0.050000, 0.500000,
	-0.250000, 0.050000, 0.100000,
	0.250000, -0.050000, 0.100000,
	0.250000, 0.050000, 0.100000,
	0.000000, 0.050000, -0.300000,
	0.250000, -0.050000, 0.100000,
	0.250000, 0.050000, 0.100000,
	0.000000, 0.050000, 0.500000,
	0.500000, -0.050000, -0.300000,
	0.500000, 0.050000, -0.300000,
	0.250000, 0.050000, 0.100000,
	0.000000, -0.050000, -0.300000,
	0.000000, 0.050000, -0.300000,
	-0.250000, 0.050000, 0.100000,
	0.500000, -0.050000, -0.300000,
	0.000000, -0.050000, -0.300000,
	0.000000, 0.050000, -0.300000,
];

// Main function
let main = () => {
	let canvas = getCanvas()
	let gl = getGlEnvironment(canvas);


	// Write the positions of vertices to a vertex shader
	let n = initVertexBuffers(gl, MESH);
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

	let previousTime = Date.now();
	let rotation = 0.0;
	// Start drawing
	let tick = () => {
		// Calculate the elapsed time
		let currentTime = Date.now();
		let deltaTime = (currentTime - previousTime) / 1000.0;
		previousTime = currentTime;

		// Update the rotation based on user input
		rotation = (rotation + inputAxisX()*180*deltaTime) % 360;

		draw(gl, n, rotation, modelMatrix, u_ModelMatrix);
		requestAnimationFrame(tick, canvas); // Request that the browser calls tick
	};

	tick();
}

// The following functions are a really stupid workaround for the fact that you can't 
// detect whether a key is held or not in any normal way.
// I expect nothing less from webdev.

// To hold held keys
let pressedKeys = {
	"ArrowLeft": false,
	"ArrowRight": false,
};

document.onkeyup = (ev) => {
	if (ev.key in pressedKeys) {
		pressedKeys[ev.key] = false;
	}
}

document.onkeydown = (ev) => {
	if (ev.key in pressedKeys) {
		pressedKeys[ev.key] = true;
	}
}

// This function returns true if the given key is held.
let isKeyHeld = (key) => {
	return pressedKeys[key];
}

// This function returns a value from -1 to 1, representing the left/right
// input axis.
let inputAxisX = () => {
	return (isKeyHeld("ArrowRight") - isKeyHeld("ArrowLeft"));
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
	let n = vertex_array.length/3;

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
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0); // 3D this time

	// Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);

	return n;
}

// Function to clear the screen and draw the model.
let draw = (gl, n, rotation, modelMatrix, u_ModelMatrix) => {
	// Set the rotation matrix
	modelMatrix.setRotate(-90, 1, 0, 0); // Exported the model wrong. Rotating to fix it lol.
	modelMatrix.rotate(rotation, 0, 0, 1); // Rotating Z instead of Y because of poorly exported mesh.
 
	// Pass the rotation matrix to the vertex shader
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Draw the triangles
	gl.drawArrays(gl.TRIANGLES, 0, n);
}
