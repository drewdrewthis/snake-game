var direction = "right",
	snake = [],
	head = 1;

// Takes coordinates and returns the quadrant 
function quad(coord) {
	return $('[data-xcoord=' + coord[0] + '][data-ycoord=' + coord[1] + ']');
}

// Randomly place a piece of fruit on the board
function makeFruits() {
	var x = Math.floor(Math.random() * (49 - 0)) + 1;
	var y = Math.floor(Math.random() * (49 - 0)) + 1;

	quad([x, y]).addClass('fruit');
	console.log("New Fruit: " + x + "," + y);
}

// Set up the board and initialize the game
function setup() {
	$('.board').html('');
	direction = "right";
	snake = [
		[24, 24]
	];
	head = snake.length - 1;
	tail = 0;
	for (var y = 0; y < 50; y++) {
		for (var x = 0; x < 50; x++) {
			$('.board').append('<div class="quadrant" data-xcoord="' + x + '" data-ycoord="' + y + '"></div>');
		}
	}
	makeFruits();
	quad(snake[0]).addClass("snake");
}

// Test move to see if game has ended
function isOver(coord) {

	if (coord[0] >= 50 || coord[1] >= 50 || coord[0] < 0 || coord[1] < 0) {
		return true;
	} else {
		return false;
	}
}

// Grow snake
function growSnake(new_pos) {
	// Add new position to snake array
	snake.push(new_pos);

	// Reset head
	head = snake.length - 1;
}

// Tests to see if the quadrant the snake entered has fruit
function isFruit(coord) {

	if (quad(coord).hasClass('fruit')) {
		return true;
	}
	return false;
}

// Test move to see if game has ended
function progress_snake(snake) {

	var x = snake[head][0];
	var y = snake[head][1];
	var new_pos = [x, y];

	// "Hypothetically" moves the head one space ahead.

	switch (direction) {
		case "left":
			new_pos[0]--;
			break;

		case "up": // up
			new_pos[1]--;
			break;

		case "right":
			new_pos[0]++;
			break;

		case "down": // down
			new_pos[1]++;
			break;
	}

	var progress_loop = setTimeout(function() {

		if (isOver(snake[head])) {
			clearTimeout(progress_loop);
			console.log("Over! " + x + "," + y);
		} else {

			if (isFruit(new_pos)) {

				// Remove fruit class and make a new fruit
				quad(new_pos).removeClass("fruit");
				makeFruits();
				growSnake(new_pos);

			} else {

				// Remove tail
				quad(snake[0]).removeClass("snake");

				// Move each snake coordinate up one place in snake array
				for (var i = 0; i < snake.length - 1; i++) {
					snake[i] = snake[i + 1];
				}

				// Gives the snake head new coords
				snake[head] = new_pos;
			}

			// Give new head position snake class
			quad(snake[head]).addClass("snake");

			// Goes through the cycles again
			progress_snake(snake);
		}

	}, 100);

}

// Run the game
$(document).ready(function() {

	setup();
	progress_snake(snake);

});

// Take user input and set snake direction
$(document).keydown(function(e) {
	switch (e.which) {
		case 37: // left
			if (direction != "right") {
				direction = "left";
				//console.log('left');
			}
			break;

		case 38: // up
			if (direction != "down") {
				direction = "up";
				//console.log('up');
			}
			break;

		case 39: // right
			if (direction != "left") {
				direction = "right";
				//console.log('right');
			}
			break;

		case 40: // down
			if (direction != "up") {
				direction = "down";
				//console.log('down');
			}
			break;

		default:
			return; // exit this handler for other keys
	}
	e.preventDefault(); // prevent the default action (scroll / move caret)
});