var model = {

	init: function() {
		var snake = {
				array: [
					[~~(model.game.options.dimension / 2) - 3, ~~(model.game.options.dimension / 2)],
					[~~(model.game.options.dimension / 2) - 2, ~~(model.game.options.dimension / 2)],
					[~~(model.game.options.dimension / 2) - 1, ~~(model.game.options.dimension / 2)],
					[~~(model.game.options.dimension / 2), ~~(model.game.options.dimension / 2)]
				],
				direction: "right",
				hasFlip: true
			};
		snake.head = snake.array.length - 1;
		snake.prev_direction = snake.direction;
		model.snake = snake;

		// Reset score on init()
		model.game.score = 0;
	},

	game: {
		score: 0,
		isPaused: true,
		options: {
			"speed": 100,
			"dimension": 15, // This is the variable that determines the number of quadrants of one side
			"theme": "theme1"
		},
		directions: ["right", "left", "up", "down"]
	},

	// Clever way to store all of the frog timeouts for clearing later. 
	frogTOs: []
};

var view = {

	init: function() {
		var dimension = controller.getBoardDimension();
		var snake = controller.getSnake();
		view.assignKeyControls();
		view.setupBoard(dimension, snake);
		view.mobileControls();
		view.userOptions();
		controller.makeFrog();
	},

	userOptions: function() {
		var needsReset = false;

		$('#options-form-submit').on('click', function(event) {

			$("#options-form input:checked").each(function() {
				if(this.name == "dimension" &&
					this.value != model.game.options.dimension) {
					needsReset = true;
				}
				model.game.options[this.name] = this.value;
			});

			if(needsReset) {
				controller.game.reset();
			}

			console.log("Resetting game with new Options..");
			console.log(model.game.options);
			event.preventDefault();
		});
	},

	setupBoard: function(dimension, snake) {
		// Set up the board and initialize the game
		$('.board').html('');
		var boardW = $('.board').width();
		$('.board').css('height', boardW);
		$('.score').text(model.game.score);
		$('.highscore').text(localStorage.highscore);
		$('.close, .closebtn').click(function() {
			$('.modal').hide();
			controller.game.reset();
			$('#postform').show();
			$('.closebtn').hide();
		});

		window.addEventListener("resize", function() {
			$('.board').css('height', $('.board').width());
		}, false);

		// Build board quadrants
		for (var y = 0; y < dimension; y++) {
			for (var x = 0; x < dimension; x++) {
				$('.board').append('<div class="quadrant" data-xcoord="' + x + '" data-ycoord="' + y + '"></div>');
			}
		}
		$('.quadrant').css({
			width: (boardW / dimension / boardW * 100) + "%",
			height: (boardW / dimension / boardW * 100) + "%"
		});
		view.quad(snake.array[snake.head]).addClass("snake snake-head").addClass(snake.direction);
		// Give new head position snake class
		view.quad(snake.array[snake.head - 1]).addClass("snake snake-body-1 flip").addClass(snake.direction);
		// Give new head position snake class
		view.quad(snake.array[snake.head - 2]).addClass("snake snake-body-main flip").addClass(snake.direction);
		// Give new head position snake class
		view.quad(snake.array[0]).addClass("snake snake-tail flip").addClass(snake.direction);
	},

	quad: function(coord) {
		// Takes coordinates and returns the quadrant 
		return $('[data-xcoord=' + coord[0] + '][data-ycoord=' + coord[1] + ']');
	},

	assignKeyControls: function() {
		// Take user input and set snake direction
		$(document).keydown(function(e) {

			
			switch (e.which) {
				case 37: // left
					if (model.game.isPaused) {
						controller.game.pause(model.snake);
						isPaused = false;
					}
					controller.moveSnake.left(model.snake);
					$('#left').addClass('pressed');
					break;

				case 38: // up
					if (model.game.isPaused) {
						controller.game.pause(model.snake);
						isPaused = false;
					}
					controller.moveSnake.up(model.snake);
					$('#up').addClass('pressed');
					break;

				case 39: // right
					if (model.game.isPaused) {
						controller.game.pause(model.snake);
						isPaused = false;
					}
					controller.moveSnake.right(model.snake);
					$('#right').addClass('pressed');
					break;

				case 40: // down
					if (model.game.isPaused) {
						controller.game.pause();
						isPaused = false;
					}
					controller.moveSnake.down(model.snake);
					$('#down').addClass('pressed');
					break;

				//case 80: // p
				//case 83: // s
				case 27: // escape
				case 32: // space
					controller.game.pause(model.snake);
					break;

				/*case 84: // r
					if($('#highscoreModal').css('display') == 'none') {
						controller.game.pause(model.snake);

						console.log('pussssh');
					}
					break;


				case 77: // m
					if($('#highscoreModal').css('display') == 'none') {
						view.makeFrogs();

						console.log('pussssh');
					}
					break;
				*/

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
	},


	mobileControls: function() {
		// Set button click functions
		$('#start_stop').on('tap', function() {
			if ($(this).text() == "Pause") {
				controller.game.pause(model.snake);
				return;
			}
			if ($(this).text() == "Resume") {
				controller.game.pause(model.snake);
				return;
			}
			if ($(this).text() == "Start") {
				$(this).text("Pause");
				isPaused = false;
				controller.moveSnake.go(model.snake);
				return;
			}
		});
		$('#reset').on('tap', function() {
			$('#start_stop').text("Start");
			controller.game.reset();
		});
		$('#more_frogs').on('tap', function() {
			controller.makeFrog();
		});

		// Game controller 
		$('#left').on('tap', function() {
			controller.moveSnake.left(model.snake);
		});
		$('#up').on('tap', function() {
			controller.moveSnake.up(model.snake);
		});
		$('#right').on('tap', function() {
			controller.moveSnake.right(model.snake);
		});
		$('#down').on('tap', function() {
			controller.moveSnake.down(model.snake);
		});

	}

};

var controller = {

	init: function() {
		console.log("Initializing game..");
		model.init();
		if(!localStorage.highscore) {
			localStorage.highscore = 0;
		}
		view.init();
	},

	getBoardDimension: function() {
		return model.game.options.dimension;
	},

	getSnake: function() {
		return model.snake;
	},

	setHighScore: function() {
		if (localStorage.highscore < model.game.score) {
			localStorage.highscore = model.game.score;
			$('.highscore').text(localStorage.highscore);
		}

		$('#highscoreModal').show();
	},

	game: {

		pause: function(snake) {
			if (!model.game.isPaused) {
				model.game.isPaused = true;
				$('#start_stop').html("Resume");

			} else {
				controller.moveSnake.go(snake);
				$('#start_stop').text("Pause");
				model.game.isPaused = false;
			}
		},

		// Test move to see if game has ended
		isOver: function(coord) {

			if (view.quad(coord).hasClass("snake")) {

				console.log("Over! Bit its tail! " + coord);
				controller.setHighScore();
				return true;
			}

			if (coord[0] >= model.game.options.dimension ||
				coord[1] >= model.game.options.dimension ||
				coord[0] < 0 ||
				coord[1] < 0) {
				console.log("Over! Crashed into the wall! " + coord);
				controller.setHighScore();
				return true;
			} else {
				return false;
			}
		},

		reset: function() {
			controller.cancelHops();
			model.init();
			view.setupBoard(model.game.options.dimension,model.snake);
			$('frog').removeClass().addClass('quadrant');
			controller.makeFrog();
		}
	},

	// Grow snake
	growSnake: function(new_pos, snake) {
		// Add new position to snake array
		snake.array.push(new_pos);

		// Reset head
		snake.head = snake.array.length - 1;
	},

	moveSnake: {

		up: function(snake) {
			if (snake.direction != "down") {
				snake.prev_direction = snake.direction;
				snake.direction = "up";
				//console.log('up');
			}
		},

		down: function(snake) {
			if (snake.direction != "up") {
				snake.prev_direction = snake.direction;
				snake.direction = "down";
				//console.log('down');
			}
		},

		left: function(snake) {
			if (snake.direction != "right") {
				snake.prev_direction = snake.direction;
				snake.direction = "left";
				//console.log('left');
			}
		},

		right: function(snake) {
			if (snake.direction != "left") {
				snake.prev_direction = snake.direction;
				snake.direction = "right";
				//console.log('right');
			}
		},

		go: function(snake) {

			var x = snake.array[snake.head][0],
				y = snake.array[snake.head][1],
				new_pos = [x, y];

			// "Hypothetically" moves the head one space ahead in current direction
			switch (snake.direction) {
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

				if (controller.game.isOver(new_pos)) {
					clearTimeout(progress_loop);
				} else {

					if (controller.isFrog(new_pos)) {
						// If new quadrant has a frog
						// Remove frog class and make a new frog
						view.quad(new_pos).removeClass("frog");
						controller.makeFrog();
						controller.growSnake(new_pos, snake);

					} else {
						// If new quadrant has no frog
						// Remove tail
						view.quad(snake.array[0]).removeClass().addClass('quadrant');

						// Move each snake coordinate up one place in snake array
						for (var i = 0; i < snake.array.length - 1; i++) {
							snake.array[i] = snake.array[i + 1];
						}

						// Gives the snake head new coords
						snake.array[snake.head] = new_pos;
					}

					// Give new head position snake class
					view.quad(snake.array[snake.head]).removeClass().addClass("quadrant snake snake-head").addClass(snake.direction);

					// Putting this after the isCorner conditionals makes allows the snake to progress
					// one space before creating the corner
					if (snake.prev_direction != snake.direction) {
						// This commented out line will delay the head turn by one iteration, but messes up the tail
						// turning at the corner. 
						view.quad(snake.array[snake.head]).removeClass().addClass("quadrant snake snake-head-2").addClass(snake.direction);
						controller.makeCorner(snake.array[snake.head]);
					}

					if (snake.hasFlip) {
						// Give first 3 snake quadrants and tail a mirror image from last iteration to maintain S shape
						view.quad(snake.array[snake.head], snake.array[snake.head - 1], snake.array[snake.head - 2], snake.array[0]).toggleClass("flip");
					}

					// Update rest of body images
					if (!(view.quad(snake.array[snake.head - 1])).hasClass('snake-corner')) {
						// Give give second position new snake class if not already a corner
						view.quad(snake.array[snake.head - 1]).addClass("snake snake-body-1").removeClass("snake-head-2, snake-head");
					} else {
						// Add alternate corner class for clean connection to head
						view.quad(snake.array[snake.head]).addClass("alternate-head");
						view.quad(snake.array[snake.head - 1]).removeClass("snake-head, snake-head-2");
					}
					if (!(view.quad(snake.array[snake.head - 2])).hasClass('snake-corner')) {
						// Give third position snake class snake class if not a corner
						view.quad(snake.array[snake.head - 2]).addClass("snake snake-body-main").removeClass("snake-body-1").toggleClass("flip");
					} else {
						// Remove alternate corner class meant just for connection to head
						view.quad(snake.array[snake.head - 1]).removeClass("alternate-head");
					}
					if ((view.quad(snake.array[0])).hasClass('snake-corner')) {
						// Give new tail position tail class
						view.quad(snake.array[0]).addClass("snake snake-tail").removeClass("snake-body-main snake-corner");
					} else {
						view.quad(snake.array[0]).addClass("snake snake-tail").removeClass("snake-body-main snake-corner").toggleClass("flip");
					}

					// Alternate snake body image
					snake.hasFlip = !snake.hasFlip;

					// Goes through the cycles again if not isPaused
					if (!model.game.isPaused) {
						controller.moveSnake.go(snake);
					}
				}
			}, model.game.options.speed);
		}
	},

	makeCorner: function(coords, snake) {
		// Make quadrant behind head a corner
		view.quad(coords).addClass("snake-corner");
		//console.log(prev_direction + " : " + direction + " " + coords);

		if ((model.snake.prev_direction == "up" && model.snake.direction == "right") ||
			(model.snake.prev_direction == "left" && model.snake.direction == "down")) {
			// Rotate 90
			view.quad(coords).addClass('right-corner');
		}
		if ((model.snake.prev_direction == "up" && model.snake.direction == "left") ||
			(model.snake.prev_direction == "right" && model.snake.direction == "down")) {
			// Rotate -90
			view.quad(coords).addClass('left-corner');
		}
		if ((model.snake.prev_direction == "down" && model.snake.direction == "right") ||
			(model.snake.prev_direction == "left" && model.snake.direction == "up")) {
			// Rotate -90
			view.quad(coords).addClass('down-right-corner');
		}
		if ((model.snake.prev_direction == "down" && model.snake.direction == "left") ||
			(model.snake.prev_direction == "right" && model.snake.direction == "up")) {
			// Rotate 180
			view.quad(coords).addClass('down-left-corner');
		}

		// Reset corner and prev_direction to avoid loop.
		model.snake.prev_direction = model.snake.direction;
	},

	// Tests to see if the quadrant the snake entered has frog
	isFrog: function(coord) {

		if (view.quad(coord).hasClass('frog')) {
			model.game.score++;
			$('.score').text(model.game.score);
			return true;
		}
		return false;
	},

	makeFrog: function() {
		var dimension = model.game.options.dimension,
			directions = model.game.directions,
			frog = null;
		// Randomly place a piece of frog on the board
		x = Math.floor(Math.random() * ((dimension - 1) - 0)) + 1;
		y = Math.floor(Math.random() * ((dimension - 1) - 0)) + 1;

		// Make new frog at random coords as long as the snake isn't there already
		if (view.quad([x, y]).hasClass('snake')) {
			controller.makeFrog();
		} else {
			frog = view.quad([x,y]);
			frog.addClass('frog').addClass(directions[Math.floor(Math.random() * directions.length)]);
		}

		controller.delayHop(frog, 2000);

		console.log("New Frog: " + x + "," + y);
	},

	frogHop: function(frog) {

		var x = frog.data("xcoord");
		var y = frog.data("ycoord");
		var new_pos = [x, y];
		var direction = null;
		
		model.game.directions.forEach(function(dir) {
			if (frog.hasClass(dir)) {
				direction = dir;
			}
		});

		switch (direction) {

			case "up":
				new_pos[1] -= 2;
				break;

			case "down":
				new_pos[1] += 2;

				break;
			case "left":
				new_pos[0] -= 2;
				break;

			case "right":
				new_pos[0] += 2;
				break;

			default:
				console.log("froghop failed: " + new_pos);
				break;
		}

		frog.removeClass('frog');
		frog = view.quad(new_pos);

		if (!frog.hasClass('snake') && frog.hasClass('quadrant')) {
			frog.addClass(direction + " frog");
			controller.delayHop(frog, 2000);
		}
		else {
			console.log("Stopped hop");
			if($('.frog').length < 1) controller.makeFrog();
		}
	},

	delayHop: function(frog, time) {
		model.frogTOs.push(setTimeout(function() {
			controller.frogHop(frog);
		}, time));
	},

	cancelHops: function() {
		for(var i = 0; i < model.frogTOs.length; i++) {
			clearTimeout(model.frogTOs[i]);
		}
		model.frogTOs = [];
	}
};

// Run the game
$(document).ready(function() {
	controller.init();
});