var direction, snake, head, paused, score, prev_direction;
var isFlip = true,
	isTurn = false,
	isCorner = false;
var gameOptions = {
	"speed" : 100,
	"dimension" : 15, // This is the variable that determines the number of quadrants of one side
	"theme" : "theme1"
};


// Takes coordinates and returns the quadrant 
function quad(coord) {
	return $('[data-xcoord=' + coord[0] + '][data-ycoord=' + coord[1] + ']');
}

// Randomly place a piece of frog on the board
function makeFrogs() {
	var x = Math.floor(Math.random() * ((gameOptions.dimension - 1) - 0)) + 1;
	var y = Math.floor(Math.random() * ((gameOptions.dimension - 1) - 0)) + 1;

	// Make new frog at random coords as long as the snake isn't there already
	if(quad([x,y]).hasClass('snake')) {
		makeFrogs();
	}
	else {
		quad([x, y]).addClass('frog');
	}
	console.log("New Frog: " + x + "," + y);
}

// Set up the board and initialize the game
function setup() {
	$('.board').html('');
	var boardW = $('.board').width();
	$('.board').css('height', boardW);
	score = 0;
	$('#score').text(score);
	paused = true;
	direction = "right";
	prev_direction = direction;
	snake = [
		[~~(gameOptions.dimension / 2) - 3, ~~(gameOptions.dimension / 2)],
		[~~(gameOptions.dimension / 2) - 2, ~~(gameOptions.dimension / 2)],
		[~~(gameOptions.dimension / 2) - 1, ~~(gameOptions.dimension / 2)],
		[~~(gameOptions.dimension / 2), ~~(gameOptions.dimension / 2)]
	];
	head = snake.length - 1;

	// Build board quadrants
	for (var y = 0; y < gameOptions.dimension; y++) {
		for (var x = 0; x < gameOptions.dimension; x++) {
			$('.board').append('<div class="quadrant" data-xcoord="' + x + '" data-ycoord="' + y + '"></div>');
		}
	}
	$('.quadrant').css({
		width: (boardW/gameOptions.dimension/boardW*100)+"%",
		height: (boardW/gameOptions.dimension/boardW*100)+"%"
	});
	makeFrogs();
	quad(snake[head]).addClass("snake snake-head").addClass(direction);
	// Give new head position snake class
	quad(snake[head - 1]).addClass("snake snake-body-1 flip").addClass(direction);
	// Give new head position snake class
	quad(snake[head - 2]).addClass("snake snake-body-main flip").addClass(direction);
	// Give new head position snake class
	quad(snake[0]).addClass("snake snake-tail flip").addClass(direction);
}

function pauseGame() {
	if (!paused) {
		paused = true;
		$('#start_stop').html("Resume");

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

	if (coord[0] >= gameOptions.dimension || coord[1] >= gameOptions.dimension || coord[0] < 0 || coord[1] < 0) {
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

function makeCorner(coords) {
	// Make quadrant behind head a corner
	quad(coords).addClass("snake-corner");
	//console.log(prev_direction + " : " + direction + " " + coords);

	if ((prev_direction == "up" && direction == "right") ||
		(prev_direction == "left" && direction == "down")) {
		// Rotate 90
		quad(coords).addClass('right-corner');
	}
	if ((prev_direction == "up" && direction == "left") ||
		(prev_direction == "right" && direction == "down")) {
		// Rotate -90
		quad(coords).addClass('left-corner');
	}
	if ((prev_direction == "down" && direction == "right") ||
		(prev_direction == "left" && direction == "up")) {
		// Rotate -90
		quad(coords).addClass('down-right-corner');
	}
	if ((prev_direction == "down" && direction == "left") ||
		(prev_direction == "right" && direction == "up")) {
		// Rotate 180
		quad(coords).addClass('down-left-corner');
	}

	// Reset corner and prev_direction to avoid loop.
	prev_direction = direction;
}

// Tests to see if the quadrant the snake entered has frog
function isfrog(coord) {

	if (quad(coord).hasClass('frog')) {
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

	// "Hypothetically" moves the head one space ahead in current direction
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

			if (isfrog(new_pos)) {
				// If new quadrant has a frog
				// Remove frog class and make a new frog
				quad(new_pos).removeClass("frog");
				makeFrogs();
				growSnake(new_pos);

			} else {
				// If new quadrant has no frog
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

			// Putting this after the isCorner conditionals makes allows the snake to progress
			// one space before creating the corner
			if (prev_direction != direction) {
				// This commented out line will delay the head turn by one iteration, but messes up the tail
				// turning at the corner. 
				//quad(snake[head]).removeClass().addClass("quadrant snake snake-head").addClass(prev_direction);
				makeCorner(snake[head]);
			}

			if (isFlip) {
				// Give first 3 snake quadrants and tail a mirror image from last iteration to maintain S shape
				quad(snake[head], snake[head - 1], snake[head - 2], snake[0]).toggleClass("flip");
			}

			// Update rest of body images
			if (!(quad(snake[head - 1])).hasClass('snake-corner')) {
				// Give give second position new snake class if not already a corner
				quad(snake[head - 1]).addClass("snake snake-body-1").removeClass("snake-head");
			} else {
				// Add alternate corner class for clean connection to head
				quad(snake[head]).addClass("alternate-head");
				quad(snake[head - 1]).removeClass("snake-head");
			}
			if (!(quad(snake[head - 2])).hasClass('snake-corner')) {
				// Give third position snake class snake class if not a corner
				quad(snake[head - 2]).addClass("snake snake-body-main").removeClass("snake-body-1").toggleClass("flip");
			} else {
				// Remove alternate corner class meant just for connection to head
				quad(snake[head - 1]).removeClass("alternate-head");
			}
			if ((quad(snake[0])).hasClass('snake-corner')) {
				// Give new tail position tail class
				quad(snake[0]).addClass("snake snake-tail").removeClass("snake-body-main snake-corner");
			} else {
				quad(snake[0]).addClass("snake snake-tail").removeClass("snake-body-main snake-corner").toggleClass("flip");
			}

			// Alternate snake body image
			isFlip = !isFlip;

			// Goes through the cycles again if not paused
			if (!paused) {
				progress_snake(snake);
			}
		}
	}, gameOptions.speed);
}

function goUp() {
	if (direction != "down") {
		prev_direction = direction;
		direction = "up";
		//console.log('up');
	}
}

function goDown() {
	if (direction != "up") {
		prev_direction = direction;
		direction = "down";
		//console.log('down');
	}
}

function goLeft() {
	if (direction != "right") {
		prev_direction = direction;
		direction = "left";
		//console.log('left');
	}
}

function goRight() {
	if (direction != "left") {
		prev_direction = direction;
		direction = "right";
		//console.log('right');
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
		makeFrogs();
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

	$('#options-form-submit').on('click', function(event) {
		$("#options-form input:checked").each(function(){
			gameOptions[this.name] = this.value;
		});
		console.log(gameOptions);
		event.preventDefault();
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
		case 83: // s
		case 27: // escape
		case 32: // space
			pauseGame();
			break;

		case 84: // space
			setup();
			break;

		case 77: // m
			makeFrogs();
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