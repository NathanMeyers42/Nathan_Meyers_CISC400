// Vertex shader program
let VSHADER_SOURCE = `
	attribute vec4 a_Position;
	uniform mat4 u_ModelMatrix;
	attribute vec4 a_Color;
	varying vec4 v_Color;
	
	void main() {
		gl_Position = u_ModelMatrix * a_Position;
		v_Color = a_Color;
	}
`;

// Fragment shader program
let FSHADER_SOURCE = `
	#ifdef GL_ES
		precision mediump float;
	#endif
	
	varying vec4 v_Color;
	
	void main() {
		gl_FragColor = v_Color;
	}
`;

// Mesh data.
let MESH = [
	0.500000, 0.500000, -0.500000, 0, 0, 1,
	0.500000, -0.500000, -0.500000, 0, 1, 0,
	-0.500000, -0.500000, -0.500000, 1, 0, 0,
	0.500000, -0.500000, 0.500000, 0, 0, 1,
	-0.500000, -0.500000, 0.500000, 0, 1, 0,
	-0.500000, -0.500000, -0.500000, 1, 0, 0,
	-0.500000, -0.500000, 0.500000, 0, 0, 1,
	-0.500000, 0.500000, 0.500000, 0, 1, 0,
	-0.500000, 0.500000, -0.500000, 1, 0, 0,
	0.500000, 0.500000, 0.500000, 0, 0, 1,
	0.500000, -0.500000, 0.500000, 0, 1, 0,
	0.500000, -0.500000, -0.500000, 1, 0, 0,
	-0.500000, 0.500000, 0.500000, 0, 0, 1,
	0.500000, 0.500000, 0.500000, 0, 1, 0,
	0.500000, 0.500000, -0.500000, 1, 0, 0,
	-0.500000, 0.500000, 0.500000, 0, 0, 1,
	0.500000, -0.500000, 0.500000, 0, 1, 0,
	0.500000, 0.500000, 0.500000, 1, 0, 0,
	-0.500000, -0.500000, 0.500000, 0, 0, 1,
	-0.500000, 0.500000, -0.500000, 0, 1, 0,
	-0.500000, -0.500000, -0.500000, 1, 0, 0,
	-0.500000, 0.500000, 0.500000, 0, 0, 1,
	0.500000, 0.500000, -0.500000, 0, 1, 0,
	-0.500000, 0.500000, -0.500000, 1, 0, 0,
	0.500000, 0.500000, -0.500000, 0, 0, 1,
	-0.500000, -0.500000, -0.500000, 0, 1, 0,
	-0.500000, 0.500000, -0.500000, 1, 0, 0,
	-0.500000, 0.500000, 0.500000, 0, 0, 1,
	-0.500000, -0.500000, 0.500000, 0, 1, 0,
	0.500000, -0.500000, 0.500000, 1, 0, 0,
	0.500000, 0.500000, 0.500000, 0, 0, 1,
	0.500000, -0.500000, -0.500000, 0, 1, 0,
	0.500000, 0.500000, -0.500000, 1, 0, 0,
	0.500000, -0.500000, 0.500000, 0, 0, 1,
	-0.500000, -0.500000, -0.500000, 0, 1, 0,
	0.500000, -0.500000, -0.500000, 1, 0, 0,
];

// Main function
let main = () => {
	let canvas = getCanvas()
	let gl = getGlEnvironment(canvas);
	gl.enable(gl.DEPTH_TEST);


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
	//let rotation = 0.0;
	//let rotation2 = 0.0;
	let secondTimer = new Timer(1, true); // Repeats every second
	let rotateBy = {x:0, y:0, z:0};
	let rotation = {x:0, y:0, z:0};
	
	secondTimer.finishedCallback = (deltaTime) => {
		rotateBy = {
			x: randomInt(-1, 1),
			y: randomInt(-1, 1),
			z: randomInt(-1, 1)
		};

		rotation.x = Math.round(rotation.x);
		rotation.y = Math.round(rotation.y);
		rotation.z = Math.round(rotation.z);
	};

	secondTimer.callback = (deltaTime) => {
		rotation.x = (rotation.x + rotateBy.x * deltaTime) % 4;
		rotation.y = (rotation.y + rotateBy.y * deltaTime) % 4;
		rotation.z = (rotation.z + rotateBy.z * deltaTime) % 4;
	};

	// Start drawing
	let tick = () => {
		// Calculate the elapsed time
		let currentTime = Date.now();
		let deltaTime = (currentTime - previousTime) / 1000.0;
		previousTime = currentTime;
		Timer.updateAll(deltaTime);
		/*// Update the rotation based on user input
		rotation = (rotation + inputAxisX()*180*deltaTime) % 360;
		rotation2 = (rotation2 + inputAxisY()*180*deltaTime) % 360;*/


		draw(gl, n, rotation, modelMatrix, u_ModelMatrix);
		requestAnimationFrame(tick, canvas); // Request that the browser calls tick
	};

	tick();
}

// This method returns a random integer from min to max.
let randomInt = (min, max) => {
	// The maximum and minimum are both inclusive
	min = Math.ceil(min);
	max = Math.floor(max) + 1;
	return Math.floor(Math.random() * (max - min) + min);
}

// This class implements a timer, which can be started, stopped,
// set to end after a certain amount of time has elapsed, etc.
class Timer {
	static timers = [];
	
	time = 0; // The current time on the timer, in seconds.
	running = false; // Whether the timer should update.
	endTime = 0; // When the timer should end, in seconds elapsed from the start of the timer.
	repeating = false; // Whether the timer should automatically restart.
	finishedCallback = undefined;
	callback = undefined;

	// Constructor method. endTime is given in seconds.
	constructor(endTime, repeat) {
		this.endTime = endTime;
		this.repeating = repeat;
		Timer.timers.push(this);
	}

	// This method restarts the timer.
	restart() {
		this.time = 0;
		this.running = true;
	}

	// This method pauses the timer.
	stop() {
		this.running = false;
	}

	// This method returns true if the time on the timer has passed
	// endTime.
	isFinished() {
		return (this.time >= this.endTime);
	}

	// This method updates the timer.
	update(deltaTime) {
		// Check if the timer has finished.
		if (this.callback) {
			this.callback(deltaTime);
		}

		if (this.isFinished()) {
			if (this.finishedCallback) {
				this.finishedCallback(deltaTime);
			}

			if (this.repeating) {
				this.restart()
			}
			else {
				this.stop()
			}
		}

		// Update the time on the timer.
		this.time += deltaTime;
	}

	// This method updates all timers.
	static updateAll(deltaTime) {
		for (let timer of Timer.timers) {
			timer.update(deltaTime);
		}
	}
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
	let n = vertex_array.length/6;

	// Create a buffer object
	var vertexBuffer = gl.createBuffer();	
	if (!vertexBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	// Write the vertex information and enable it
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	var FSIZE = vertices.BYTES_PER_ELEMENT;
	
	//Get the storage location of a_Position, assign and enable buffer
	var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if(a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return -1;
	}

	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
	gl.enableVertexAttribArray(a_Position);	// Enable the assignment of the buffer object

	// Get the storage location of a_Position, assign buffer and enable
	var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
	if(a_Color < 0) {
		console.log('Failed to get the storage location of a_Color');
		return -1;
	}
	// Assign the buffer object to a_Color variable
	gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
	gl.enableVertexAttribArray(a_Color); // Enable the assignment of the buffer object

	return n;
}

// Function to clear the screen and draw the model.
let draw = (gl, n, rotation, modelMatrix, u_ModelMatrix) => {
	// Set the rotation matrix
	modelMatrix.setRotate(0, 1, 1, 1);
	modelMatrix.rotate(rotation.x*90, 1, 0, 0);
	modelMatrix.rotate(rotation.y*90, 0, 1, 0);
	modelMatrix.rotate(rotation.z*90, 0, 0, 1);
 
	// Pass the rotation matrix to the vertex shader
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Draw the triangles
	gl.drawArrays(gl.TRIANGLES, 0, n);
}
