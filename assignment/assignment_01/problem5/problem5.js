// This function gets input from the text input box.
let getInput = () => {
	return document.getElementById("input").value;
}

// This function changes the text inside the area paragraph.
let setAreaText = (text) => {
	document.getElementById("area").innerHTML = text;
}

// This function calculates the area of a circle given its
// radius.
let areaOfCircle = (radius) => {
	return Math.PI * radius * radius;
}

// This is a callback function for the input box's onKeypress.
// When the user types anything in the input, this function
// is run.
let inputChanged = () => {
	// Waiting is necessary because onKeypress fires this
	// function BEFORE the element's value propery changes
	setTimeout(updateArea, 1); // ONE (1) millisecond
}

// This function updates the area paragraph based on the user's
// input. If they input a number, it tells them the radius.
// Incidentally, this works with hex numbers like 0xDEAD.
let updateArea = () => {
	let input = getInput();

	if (isNaN(input) || input == "") { // Apparently empty string is a number
		setAreaText("Please enter a number.");
	}
	else {
		setAreaText("Area: " + areaOfCircle(+input).toString());
	}
}