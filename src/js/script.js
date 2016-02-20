var direction;

$(document).ready(function() {



	function setup() {
		for (var y = 0; y < 50; y++) {
			for (var x = 0; x < 50; x++) {
				$('.board').append('<div class="quadrant" data-xcoord="' + x + '" data-ycoord="' + y + '"></div>');
			}
		}
	}

	function progress_snake(xcoord, ycoord) {

		$('[data-xcoord =' + xcoord + '][data-ycoord =' + ycoord + ']').addClass("litup");

		setTimeout(function() {
			$('[data-xcoord =' + xcoord + '][data-ycoord =' + ycoord + ']').removeClass("litup");
			xcoord++;
			progress_snake(xcoord,ycoord);
		}, 100);
	}

	setup();
	progress_snake(0,0);

});

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        direction = "left";
        console.log('left');
        break;

        case 38: // up
        direction = "up";
        console.log('up');
        break;

        case 39: // right
        direction = "right";
        console.log('right');
        break;

        case 40: // down
        direction = "down";
        console.log('down');
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});
