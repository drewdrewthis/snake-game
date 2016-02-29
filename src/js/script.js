var direction, snake, head, paused, score;
var isFlip = true,
	isTurn = false;
var bd = 25; // This is the variable that determines the number of quadrants

// Takes coordinates and returns the quadrant 
function quad(coord) {
	return $('[data-xcoord=' + coord[0] + '][data-ycoord=' + coord[1] + ']');
}

// Randomly place a piece of fruit on the board
function makeFruits() {
	var x = Math.floor(Math.random() * (bd - 1 - 0)) + 1;
	var y = Math.floor(Math.random() * (bd - 1 - 0)) + 1;

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
		[~~(bd / 2) - 3, ~~(bd / 2)],
		[~~(bd / 2) - 2, ~~(bd / 2)],
		[~~(bd / 2) - 1, ~~(bd / 2)],
		[~~(bd / 2), ~~(bd / 2)]
	];
	head = snake.length - 1;

	// Build board quadrants
	for (var y = 0; y < bd; y++) {
		for (var x = 0; x < bd; x++) {
			$('.board').append('<div class="quadrant" data-xcoord="' + x + '" data-ycoord="' + y + '"></div>');
		}
	}
	makeFruits();
	quad(snake[head]).addClass("snake snake-head").addClass(direction);
	// Give new head position snake class
	quad(snake[head - 1]).addClass("snake snake-body-1").addClass(direction);
	// Give new head position snake class
	quad(snake[head - 2]).addClass("snake snake-body-main").addClass(direction);
	// Give new head position snake class
	quad(snake[0]).addClass("snake snake-tail").addClass(direction);
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

	if (coord[0] >= bd || coord[1] >= bd || coord[0] < 0 || coord[1] < 0) {
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
				quad(snake[0]).removeClass().addClass('quadrant');

				// Move each snake coordinate up one place in snake array
				for (var i = 0; i < snake.length - 1; i++) {
					snake[i] = snake[i + 1];
				}

				// Gives the snake head new coords
				snake[head] = new_pos;
			}

			// Give new head position snake class
			quad(snake[head]).removeClass().addClass("quadrant snake snake-head").addClass(direction);
			// Give new head position snake class
			quad(snake[head - 1]).addClass("snake snake-body-1").removeClass("snake-head");
			// Give new head position snake class
			quad(snake[head - 2]).addClass("snake snake-body-main").removeClass("snake-body-1").toggleClass("flip");
			// Give new head position snake class
			quad(snake[0]).addClass("snake snake-tail").removeClass("snake-body-main").toggleClass("flip");

			if (isFlip) {
				quad(snake[head], snake[head - 1], snake[head - 2], snake[0]).toggleClass("flip");
			}

			isFlip = !isFlip;

			// Goes through the cycles again if not paused
			if (!paused) {
				progress_snake(snake);
			}
		}

	}, 100);

}

function goUp() {
	if (direction != "down") {
		direction = "up";
		console.log('up');
	}
}

function goDown() {
	if (direction != "up") {
		direction = "down";
		console.log('down');
	}
}

function goLeft() {
	if (direction != "right") {
		direction = "left";
		console.log('left');
	}
}

function goRight() {
	if (direction != "left") {
		direction = "right";
		console.log('right');
	}
}

// Run the game
$(document).ready(function() {

	setup();

	window.addEventListener("resize", function() {
		$('.board').css('height', $('.board').width());
	}, false);

	// Set button click functions
	$('#start_stop').on('tap', function() {
		if ($(this).text() == "Pause") {
			pauseGame();
			return;
		}
		if ($(this).text() == "Resume") {
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
	$('#reset').on('tap', function() {
		$('#start_stop').text("Start");
		setup();
	});
	$('#more_frogs').on('tap', function() {
		makeFruits();
	});

	// Game controller 
	$('#left').on('tap', function() {
		goLeft();
	});
	$('#up').on('tap', function() {
		goUp();
	});
	$('#right').on('tap', function() {
		goRight();
	});
	$('#down').on('tap', function() {
		goDown();
	});

});

// Take user input and set snake direction
$(document).keydown(function(e) {
	switch (e.which) {
		case 37: // left
			goLeft();
			$('#left').addClass('pressed');
			break;

		case 38: // up
			goUp();
			$('#up').addClass('pressed');			
			break;

		case 39: // right
			goRight();
			$('#right').addClass('pressed');	
			break;

		case 40: // down
			goDown();
			$('#down').addClass('pressed');	
			break;

		case 80: // p
		case 27: // escape
		case 32: // space
			pauseGame();
			break;

		default:
			return; // exit this handler for other keys
	}
	e.preventDefault(); // prevent the default action (scroll / move caret)
});

// Take user input and set snake direction
$(document).keyup(function(e) {
	switch (e.which) {
		case 37: // left

			$('#left').removeClass('pressed');
			break;

		case 38: // up

			$('#up').removeClass('pressed');
			break;

		case 39: // right

			$('#right').removeClass('pressed');
			break;

		case 40: // down

			$('#down').removeClass('pressed');
			break;

		default:
			return; // exit this handler for other keys
	}
	e.preventDefault(); // prevent the default action (scroll / move caret)
});