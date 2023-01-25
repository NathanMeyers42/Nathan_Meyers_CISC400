// This function writes a string containing the time to
// the "time" element.
let setTimeText = (text) => {
	document.getElementById("time").innerHTML = text;
}

// This function takes a number and returns a string
// padded to two digits.
let twoDigits = (number) => {
	return number.toString().padStart(2, '0');
}

// This function takes a number from 0 to 6 and returns
// the day as a string
let numToDayName = (number) => {
	console.log(number);
	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	return days[number];
}

// This function takes a number from 0 to 11 and returns
// the month as a string
let numToMonthName = (number) => {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	return months[number];
}

// This function takes a Date object and returns a string
// containing the date and time converted to a format
// that none of the JS Date format functions support.
let timeToString = (date) => {
	let text = "";
	// Write the date in the format:
	// Monday, 25 January 2016
	text += numToDayName(date.getDay()) + ", "; // value depends on browser.
	text += date.getDate().toString() + " ";
	text += numToMonthName(date.getMonth()) + " ";
	text += date.getFullYear().toString();

	text += " -- ";

	// Write the current time in 24 hour time
	text += twoDigits(date.getHours()) + ":";
	text += twoDigits(date.getMinutes()) + ":";
	text += twoDigits(date.getSeconds());

	// Good god I hate dates in javascript.

	return text;
}

// This function updates the time on the web page.
let updateTime = () => {
	setTimeText(timeToString(new Date()));
}

// Call these functions on script load.
updateTime();
setInterval(updateTime, 1000);