var direction,snake,head,paused,score;

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
	$('.board').css('height', $('.board').width());
	score = 0;
	$('#score').text(score);
	paused = true;
	direction = "right";
	snake = [
		[24, 24]
	];
	head = snake.length - 1;

	// Build board quadrants
	for (var y = 0; y < 50; y++) {
		for (var x = 0; x < 50; x++) {
			$('.board').append('<div class="quadrant" data-xcoord="' + x + '" data-ycoord="' + y + '"></div>');
		}
	}
	makeFruits();
	quad(snake[0]).addClass("snake");
}

function pauseGame() {
	if (!paused) {
		paused = true;
		$('#start_stop').text("Resume");

	} else {
		progress_snake(snake);
		$('#start_stop').text("Pause");
		paused = false;
	}
}

// Test move to see if game has ended
function isOver(coord) {

	if (quad(coord).hasClass("snake")) {

		console.log("Over! Bit its tail! " + coord);
		return true;
	}

	if (coord[0] >= 50 || coord[1] >= 50 || coord[0] < 0 || coord[1] < 0) {
		console.log("Over! Crashed into the wall! " + coord);
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
		score++;
		$('#score').text(score);
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

		if (isOver(new_pos)) {
			clearTimeout(progress_loop);
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

			// Goes through the cycles again if not paused
			if (!paused) {
				progress_snake(snake);
			}
		}

	}, 100);

}

// Run the game
$(document).ready(function() {

	setup();

	// Set button click functions
	$('#start_stop').on('click', function() {
		if ($(this).text() == "Pause") {
			pauseGame();
			return;
		} 
		if ($(this).text() == "Resume"){
			pauseGame();
			return;
		}
		if ($(this).text() == "Start") {
			$(this).text("Pause");
			paused = false;
			progress_snake(snake);
			return;
		}
	});
	$('#reset').on('click', function() {
		$('#start_stop').text("Start");
		setup();
	});
	$('#more_frogs').on('click', function() {
		makeFruits();
	});

	// Game controller 
	$('#left').on('click', function() {
		if (direction != "right") {
			direction = "left";
			console.log('left');
		}
	});
	$('#up').on('click', function() {
		if (direction != "down") {
			direction = "up";
			console.log('up');
		}
	});
	$('#right').on('click', function() {
		if (direction != "left") {
			direction = "right";
			console.log('right');
		}
	});
	$('#down').on('click', function() {
		if (direction != "up") {
			direction = "down";
			console.log('down');
		}
	});

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

		case 80: // p
		case 27: //escape
			pauseGame();
			break;

		default:
			return; // exit this handler for other keys
	}
	e.preventDefault(); // prevent the default action (scroll / move caret)
});