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

// Main function
let main = () => {
	let canvas = getCanvas()
	let gl = getGlEnvironment(canvas);

	let ball = new Ball(0.1);

	// Write the positions of vertices to a vertex shader
	let n = initVertexBuffers(gl, ball.mesh);
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
	// Start drawing
	let tick = () => {
		// Calculate the elapsed time
		let currentTime = Date.now();
		let deltaTime = (currentTime - previousTime) / 1000.0;
		previousTime = currentTime;

		ball.update(deltaTime);
		draw(gl, n, ball.position, modelMatrix, u_ModelMatrix);
		requestAnimationFrame(tick, canvas); // Request that the browser calls tick
		Timer.updateAll(deltaTime);
	};

	tick();
}

// Simple data structure to hold a 2D vector
class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	static ZERO = new Vector2(0, 0); // The zero vector

	// This method takes a magnitude and a direction in radians and
	// returns a Vector2.
	static fromAngle(direction, magnitude) {
		let x = magnitude * Math.cos(direction);
		let y = magnitude * Math.sin(direction);
		return new Vector2(x, y);
	}

	// This method compares if two Vector2's are equal
	equals(other) {
		return (this.x === other.x && this.y === other.y);
	}

	// This method sums two Vector2 objects.
	add(other) {
		return new Vector2(this.x + other.x, this.y + other.y);
	}

	// This method scales a Vector2 by a scalar. 
	multiply(scalar) {
		return new Vector2(this.x * scalar, this.y * scalar);
	}
}

// Draws an n-sided regular polygon. Sides is n and radius is the distance
// of each point from the center
let polygon = (radius, sides) => {
	vertices = new Float32Array(sides*3*2) // Each side is a triangle, like a pizza

	let center = Vector2.ZERO;
	let previous_vec = Vector2.ZERO;
	let current_vec = Vector2.fromAngle(0, radius);

	// For each side
	for (let i = 0; i < sides; i++) {
		// Calculate vectors
		previous_vec = current_vec
		current_vec = Vector2.fromAngle(2*Math.PI*((i+1)/sides), radius);

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
		if (this.isFinished()) {
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

// Ball class. Meant to be used as a singleton.
// The object literal syntax was being picky and annoying, so I opted for this.
class Ball {
	radius = 0; // Radius of the ball
	position = Vector2.ZERO; // Current position of the ball
	mesh = []; // The ball's mesh, as an array of vertex x and y positions.

	constructor(size) {
		this.radius = size;
		this.mesh = polygon(this.radius, 32);

		this.timer = new Timer(1.0, true); // Timer repeats every 1 second.
		this.timer.restart();
	}

	// This method updates the position of the ball.
	update(dt) {
		if (this.timer.isFinished()) {	// Every 1 second.		
			let moveVector = Vector2.ZERO; // Represents one of 8 directions

			// Generate new potential moveVector until a valid one is generated.
			// This is a quick and dirty way to prevent the ball from not moving.
			while (moveVector.equals(Vector2.ZERO)) {
				moveVector = new Vector2(randomInt(-1, 1), randomInt(-1, 1));
			}

			moveVector = moveVector.multiply(this.radius);
			this.moveAndCollide(moveVector);
		}
	}

	// This method moves the ball by deltaPosition iff the ball would not collide
	// at its new position.
	moveAndCollide(deltaPosition) {
		if (!this.isCollisionAtOffset(deltaPosition)) {
			this.position = this.position.add(deltaPosition);
		}
	}

	// This method checks for a collision at the given position.
	isCollisionAtPosition(checkPosition) {
		return (
			checkPosition.x < (-1.0 + this.radius) ||
			checkPosition.x > (1.0 - this.radius) ||
			checkPosition.y < (-1.0 + this.radius) ||
			checkPosition.y > (1.0 - this.radius)
		);
	}

	// This method checks if the ball is colliding at its current position.
	// (Unused)
	isColliding() {
		return this.isCollisionAtPosition(this.position);
	}

	// This method checks if the ball would collide at deltaPosition offset from
	// its current position.
	isCollisionAtOffset(deltaPosition) {
		return this.isCollisionAtPosition(this.position.add(deltaPosition));
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
	// Set the translation matrix
	modelMatrix.setTranslate(position.x, position.y, 0);
 
	// Pass the rotation matrix to the vertex shader
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Draw the point
	gl.drawArrays(gl.TRIANGLES, 0, n);
}
