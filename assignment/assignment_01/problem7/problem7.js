let getInput = () => {
	let input = document.getElementById("input").value;
	
	try {
		return eval?.(`"use strict";(${input})`); // Bad idea, but I'm not going to write a parser
	}
	catch (e) {
		return null;
	}	
}

let setOutput = (text) => {
	document.getElementById("output").innerHTML = text;
}

// This is a callback function for the input box's onKeypress.
// When the user types anything in the input, this function
// is run.
let inputChanged = () => {
	// Waiting is necessary because onKeypress fires this
	// function BEFORE the element's value propery changes
	setTimeout(testMatrix, 1); // ONE (1) millisecond
}

let testMatrix = () => {
	let text = "You have entered ";
	let data = getInput();

	console.log(data);

	if (data === null) {
		text += "gibberish.";
	}
	else {
		text += `${data}.`;
	}

	text += "<br>";

	if (!isMatrix(data)) {
		text += "This is not a matrix.";
	}
	else if (!isSquareMatrix(data)) {
		text += "This is not a square matrix.";
	}
	else if (!isDiagonalMatrix(data)) {
		text += "This is not a diagonal matrix.";
	}
	else {
		text += "This is a diagonal matrix!";
	}

	setOutput(text);
}

let isMatrix = (data) => {
	if (!Array.isArray(data)) {
		return false;
	}

	let testLength = 0;

	if (Array.isArray(data[0])) {
		testLength = data[0].length;
	}

	for (i of data) {
		if (i.length != testLength) {
			return false;
		}
	}

	return true;
}

let isSquareMatrix = (data) => {
	if (!isMatrix(data)) {
		return false;
	}

	return (data.length == data[0].length)
}

// This function assumes a square matrix.
let isDiagonalMatrix = (matrix) => {
	if (!isSquareMatrix(matrix)) {
		return false;
	}

	let length = matrix.length
	
	for (let i = 0; i < length; i++) {
		for (let j = 0; j < length; j++) {
			// Skip elements on the diagonal
			if (i != j && matrix[i][j] != 0) {
				return false;
			} 
		}
	}

	return true;
}