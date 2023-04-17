// Vertex shader program
const VSHADER_SOURCE = `
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
const FSHADER_SOURCE = `
	#ifdef GL_ES
		precision mediump float;
	#endif
	
	varying vec4 v_Color;
	
	void main() {
		gl_FragColor = v_Color;
	}
`;

// Mesh data.
const MESH = [
	0.500000, 0.500000, -0.500000, 0.388, 0.496, 0.598,
	0.500000, -0.500000, -0.500000, 0.388, 0.496, 0.598,
	-0.500000, -0.500000, -0.500000, 0.388, 0.496, 0.598,
	0.500000, -0.500000, 0.500000, 0.388, 0.496, 0.598,
	-0.500000, -0.500000, 0.500000, 0.388, 0.496, 0.598,
	-0.500000, -0.500000, -0.500000, 0.388, 0.496, 0.598,
	-0.500000, -0.500000, 0.500000, 0.388, 0.496, 0.598,
	-0.500000, 0.500000, 0.500000, 0.388, 0.496, 0.598,
	-0.500000, 0.500000, -0.500000, 0.388, 0.496, 0.598,
	0.500000, 0.500000, 0.500000, 0.388, 0.496, 0.598,
	0.500000, -0.500000, 0.500000, 0.388, 0.496, 0.598,
	0.500000, -0.500000, -0.500000, 0.388, 0.496, 0.598,
	-0.500000, 0.500000, 0.500000, 0.754, 0.848, 0.887, // top
	0.500000, 0.500000, 0.500000, 0.754, 0.848, 0.887,  // top
	0.500000, 0.500000, -0.500000, 0.754, 0.848, 0.887, // top
	-0.500000, 0.500000, 0.500000, 0.388, 0.496, 0.598,
	0.500000, -0.500000, 0.500000, 0.388, 0.496, 0.598,
	0.500000, 0.500000, 0.500000, 0.388, 0.496, 0.598,
	-0.500000, -0.500000, 0.500000, 0.388, 0.496, 0.598,
	-0.500000, 0.500000, -0.500000, 0.388, 0.496, 0.598,
	-0.500000, -0.500000, -0.500000, 0.388, 0.496, 0.598,
	-0.500000, 0.500000, 0.500000, 0.754, 0.848, 0.887,  // top
	0.500000, 0.500000, -0.500000, 0.754, 0.848, 0.887,  // top
	-0.500000, 0.500000, -0.500000, 0.754, 0.848, 0.887, // top
	0.500000, 0.500000, -0.500000, 0.388, 0.496, 0.598,
	-0.500000, -0.500000, -0.500000, 0.388, 0.496, 0.598,
	-0.500000, 0.500000, -0.500000, 0.388, 0.496, 0.598,
	-0.500000, 0.500000, 0.500000, 0.388, 0.496, 0.598,
	-0.500000, -0.500000, 0.500000, 0.388, 0.496, 0.598,
	0.500000, -0.500000, 0.500000, 0.388, 0.496, 0.598,
	0.500000, 0.500000, 0.500000, 0.388, 0.496, 0.598,
	0.500000, -0.500000, -0.500000, 0.388, 0.496, 0.598,
	0.500000, 0.500000, -0.500000,  0.388, 0.496, 0.598,
	0.500000, -0.500000, 0.500000, 0.388, 0.496, 0.598,
	-0.500000, -0.500000, -0.500000, 0.388, 0.496, 0.598,
	0.500000, -0.500000, -0.500000, 0.388, 0.496, 0.598,
];

const LEVEL_LAYOUT = [
	0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
	0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
	0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
	0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

// Main function
let main = () => {
	let canvas = getCanvas();
	let gl = getGlEnvironment(canvas);
	gl.enable(gl.DEPTH_TEST); // Why is this off by default? This isn't the PS1 for feck's sake.

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
	//let modelMatrix = new Matrix4();

	let previousTime = Date.now();
	//let rotation = 0.0;
	//let rotation2 = 0.0;

	// Start drawing
	let tick = () => {
		// Calculate the elapsed time
		let currentTime = Date.now();
		let deltaTime = (currentTime - previousTime) / 1000.0;
		previousTime = currentTime;
		Timer.updateAll(deltaTime);
		GameObject.updateAll(deltaTime);
		/*// Update the rotation based on user input
		rotation = (rotation + inputAxisX()*180*deltaTime) % 360;
		rotation2 = (rotation2 + inputAxisY()*180*deltaTime) % 360;*/


		draw(gl, n, u_ModelMatrix);
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

const LEVEL_DIMENSIONS = new Vector2(16, 12);
const GLOBAL_SCALE = 0.1;
const GLOBAL_TRANSLATE = new Vector2(-0.75, 0.5);

let applyGlobalTranslate = (vector) => {
	return new Vector2(
		GLOBAL_TRANSLATE.x + vector.x,
		GLOBAL_TRANSLATE.y - vector.y
	);
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

// The following functions are a really stupid workaround for the fact that you can't 
// detect whether a key is held or not in any normal way.
// I expect nothing less from webdev.

// To hold held keys
let pressedKeys = {
	"a": false,
	"d": false,
	"w": false,
	"s": false,

	"ArrowLeft": false,
	"ArrowRight": false,
	"ArrowUp": false,
	"ArrowDown": false,
};

const KEY_MAP = {
	"P1_Left": "a",
	"P1_Right": "d",
	"P1_Jump": "w",
	"P1_Shoot": "s",

	"P2_Left": "ArrowLeft",
	"P2_Right": "ArrowRight",
	"P2_Jump": "ArrowUp",
	"P2_Shoot": "ArrowDown",
}

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

let playerInput = (playerIndex, inputName) => {
	return ("P" + playerIndex.toString() + "_" + inputName);
}


// This function returns true if the given input is held.
let isInputHeld = (input) => {
	return pressedKeys[KEY_MAP[input]];
}

// This function returns a value from -1 to 1, representing an axis formed from
// the two specified inputs.
let inputAxis = (input1, input2) => {
	return (isInputHeld(input1) - isInputHeld(input2));
}

class GameObject {
	static gameObjects = [];

	constructor() {
		this.position = new Vector2(0, 0);
		this.scale = new Vector2(1, 1);

		GameObject.gameObjects.push(this);
	}

	destroy() {
		// Remove this object from the gameObjects array
		/*let index = GameObject.gameObjects.indexOf(this)

		if (index !== -1) {
			GameObject.gameObjects = GameObject.gameObjects.splice(index, 1);
		}

		delete this;*/

		let newObjects = [];

		for (o of GameObject.gameObjects) {
			if (o !== this) {
				newObjects.push(o);
			}
		}

		GameObject.gameObjects = newObjects;
	}

	draw(gl, n, u_ModelMatrix) {
		let matrix = new Matrix4()
		let adjustedPosition = applyGlobalTranslate(this.position.multiply(GLOBAL_SCALE));
		let adjustedScale = this.scale.multiply(GLOBAL_SCALE);
		
		matrix.translate(adjustedPosition.x, adjustedPosition.y, 0);
		matrix.scale(adjustedScale.x, adjustedScale.y, 1);

		drawCube(gl, n, matrix, u_ModelMatrix);
	}

	update(deltaTime) {}

	static drawAll(gl, n, u_ModelMatrix) {
		for (let gameObj of GameObject.gameObjects) {
			gameObj.draw(gl, n, u_ModelMatrix);
		}
	}

	static updateAll(deltaTime) {
		for (let gameObj of GameObject.gameObjects) {
			gameObj.update(deltaTime);
		}

		console.log(GameObject.gameObjects);
	}

	static pointCollidesTerrain(point) {
		let index = Math.floor(point.y) * LEVEL_DIMENSIONS.x + Math.floor(point.x);

		return (LEVEL_LAYOUT[index] === 1);
	}

	getSize() {
		return this.scale;
	}
}

class Player extends GameObject {
	constructor(playerIndex) {
		super();
		this.scale = new Vector2(0.5, 1);
		this.playerIndex = playerIndex;
		this.velocity = new Vector2(0, 0);
		this.jumping = false;
		this.health = 3;
		this.shootTimer = new Timer(0.25, false); // 1/4 second to reload

		if (playerIndex === 2) {
			this.position.x = 15
		}
	}

	update(deltaTime) {
		this.updateWalking(deltaTime);
		this.updateJumpingAndFalling(deltaTime);
		this.updateShooting();
		this.updateHealth();
		this.moveAndCollide(this.velocity);
	}

	updateWalking(deltaTime) {
		const SPEED = 5;

		let moveAxis = inputAxis(
			playerInput(this.playerIndex, "Right"), 
			playerInput(this.playerIndex, "Left")
		);

		this.velocity.x = moveAxis * SPEED * deltaTime;
	}

	updateJumpingAndFalling(deltaTime) {
		const GRAVITY = 0.4;
		const TERMINAL_VELOCITY = 4;
		const JUMP_FORCE = 0.18;

		if (this.isOnGround()) {
			this.velocity.y = 0;
		}
		else {
			this.velocity.y += GRAVITY * deltaTime;
			
			if (this.velocity.y > TERMINAL_VELOCITY) {
				this.velocity.y = TERMINAL_VELOCITY;
			}
		}

		if (this.isNearGround(0.15) && isInputHeld(playerInput(this.playerIndex, "Jump"))) {
			this.velocity.y = - JUMP_FORCE;
			this.jumping = true;
		}

		if (this.velocity.y >= 0) {
			this.jumping = false;
		}
		else if (this.jumping) {
			if (!isInputHeld(playerInput(this.playerIndex, "Jump"))) {
				this.jumping = false;
				this.velocity.y *= 0.5;
			}
		}
	}

	updateShooting() {
		if (this.shootTimer.isFinished() && isInputHeld(playerInput(this.playerIndex, "Shoot"))) {
			this.shootTimer.restart();

			let direction = 1;
			let otherPlayer = (this.playerIndex === 1) ? player2 : player1;

			if (otherPlayer.position.x < this.position.x) {
				direction = -1;
			}

			new Projectile(this.position.add(new Vector2(direction*0.5, 0)), direction);
		}
	}

	updateHealth() {
		if (this.health <= 0) {
			//this.destroy(); // Die
		}
	}

	// These values are nonsense and had to be derived by trial and error.
	// Also they only work for the Player object's exact shape. Other shapes will fail.
	// Why?
	// This whole idea is a bust, just imagine these are constants that assume
	// the dimentions of the player character.
	getHalfSize() { return this.getSize().multiply(0.5); }
	getTop() { return this.position.y;}
	getBottom() { return this.position.y + this.getSize().y; }
	getLeft() { return this.position.x + this.getHalfSize().x; }
	getRight() {return this.position.x + this.getSize().x + this.getHalfSize().x; }

	getCorners() {
		return {
			topleft: new Vector2(this.getLeft(), this.getTop()),
			topright: new Vector2(this.getRight(), this.getTop()),
			bottomleft: new Vector2(this.getLeft(), this.getBottom()),
			bottomright: new Vector2(this.getRight(), this.getBottom()),
		};
	}

	isCollidingTerrain() {
		const CORNERS = this.getCorners();

		for (let corner in CORNERS) {
			if (GameObject.pointCollidesTerrain(CORNERS[corner])) {
				return true;
			}
		}

		return false;
	}

	moveAndCollide(offset) {
		// X
		let xDirection = Math.sign(offset.x);
		this.position.x += offset.x;

		while (this.isCollidingTerrain()) {
			this.position.x += 0.05 * -xDirection;
		}

		// Y
		let yDirection = Math.sign(offset.y);
		this.position.y += offset.y;

		while (this.isCollidingTerrain()) {
			this.position.y += 0.05 * -yDirection;
		}
	}

	isNearGround(distance) {
		const CORNERS = this.getCorners();
		let distanceVector = new Vector2(0, distance);
		let bottomleft = CORNERS.bottomleft.add(distanceVector);
		let bottomright = CORNERS.bottomright.add(distanceVector);

		return (
			GameObject.pointCollidesTerrain(bottomleft) ||
			GameObject.pointCollidesTerrain(bottomright)
		);
	}

	isOnGround() {
		return this.isNearGround(0.05);
	}
}

// Yucky globals
// Kinda necessary
let player1 = new Player(1);
let player2 = new Player(2);

class Projectile extends GameObject {
	constructor(position, direction) {
		super();

		this.position = position;
		this.direction = direction;
		this.scale = new Vector2(0.15, 0.1);

		this.despawnTimer = new Timer(5, false);
		this.despawnTimer.restart();
	}

	update(deltaTime) {
		if (this.despawnTimer.isFinished()) {
			//this.destroy(); // despawn the projectile
			// Destroy is fucking busted for mysterious js concurency reasons or something IDK
			// Can't even remove an element from an array in js without some bug happening
		}

		const SPEED = 16;
		this.position.x += SPEED * this.direction * deltaTime;

		if (GameObject.pointCollidesTerrain(this.position)) {
			this.position = new Vector2(-100, -100);
			// It will keep existing because bugs
			// Have fun with massive slowdown!
		}

		if (this.overlapsPlayer(player1)) {
			player1.health--;
			this.position = new Vector2(-100, -100);
		}

		if (this.overlapsPlayer(player2)) {
			player2.health--;
			this.position = new Vector2(-100, -100);
		}
	}

	overlapsPlayer(player) {
		return (
			this.position.x < player.getRight() &&
			this.position.x > player.getLeft() &&
			this.position.y > player.getTop() &&
			this.position.y < player.getBottom()
		);
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
	let vertexBuffer = gl.createBuffer();	
	if (!vertexBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	// Write the vertex information and enable it
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	let FSIZE = vertices.BYTES_PER_ELEMENT;
	
	//Get the storage location of a_Position, assign and enable buffer
	let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if(a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return -1;
	}

	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
	gl.enableVertexAttribArray(a_Position);	// Enable the assignment of the buffer object

	// Get the storage location of a_Position, assign buffer and enable
	let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
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
let draw = (gl, n, u_ModelMatrix) => {
	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);
	drawTerrain(gl, n, u_ModelMatrix);
	GameObject.drawAll(gl, n, u_ModelMatrix);
}

let drawCube = (gl, n, modelMatrix, u_ModelMatrix) => {
	// Pass the transform matrix to the vertex shader
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

	// Draw the triangles
	gl.drawArrays(gl.TRIANGLES, 0, n);
}

let drawTerrain = (gl, n, u_ModelMatrix) => {
	for (let x = 0; x < LEVEL_DIMENSIONS.x; x++) {
		for (let y = 0; y < LEVEL_DIMENSIONS.y; y++) {
			if (LEVEL_LAYOUT[y*LEVEL_DIMENSIONS.x + x] == 1) {
				let matrix = new Matrix4()
				let translateVector = applyGlobalTranslate(new Vector2(x, y).multiply(GLOBAL_SCALE));
				
				matrix.translate(translateVector.x, translateVector.y, 0);
				matrix.scale(GLOBAL_SCALE, GLOBAL_SCALE, GLOBAL_SCALE);
				matrix.rotate(-20, 1, 0, 0);
				
				drawCube(gl, n, matrix, u_ModelMatrix);
			}
		}
	}
}