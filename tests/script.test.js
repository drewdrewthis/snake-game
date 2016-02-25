describe('Snake Game Initialization', function() {

  beforeEach(function() {
    jasmine.getFixtures().set('<div class="board"></div>');
    setup();
  });

  describe('Start of game', function() {

    it('should make snake at start', function() {
      expect(snake.length).toBeGreaterThan(0);
    });

    it('should make fruit at start', function() {
      expect($('.fruit')).toExist();
    });

    it('should make the game board at start', function() {
      expect(quad([25, 25])).toHaveClass('quadrant');
    });

    xit('should count seconds of play', function() {

    });

  });

  describe('Snake', function() {

    xit('should turn based on user commands', function() {

    });

    xit('should turn be able to stop and start on pause', function() {

    });

  });

  describe('Fruit', function() {

    it('should be on the board', function() {
      expect($('.fruit')).toExist();
    });

  });
});

describe('Game Run', function() {

  beforeEach(function(done) {
    jasmine.getFixtures().set('<div class="board"></div>');
    setup();
    progress_snake(snake);
    setTimeout(function() {
      value = 0;
      done();
    }, 1000);
  });

  describe('The snake', function() {

    it('should move', function(done) {
      expect(quad([24, 24])).not.toHaveClass('snake');
      done();
    });

    xit('should grow when it eats fruit', function(done) {
      quad([26, 24]).addClass('fruit');
    });

  });

  it('should be able to be reset', function(done) {

    var x = $('.fruit').attr('data-xcoord');
    var y = $('.fruit').attr('data-ycoord');

    setup();

    expect(quad([x, y])).not.toHaveClass('fruit');
    expect(quad([26, 24])).not.toHaveClass('snake');
    done();
  });
});

describe('End of game', function() {

  beforeEach(function() {
    jasmine.getFixtures().set('<div class="board"></div>');
    setup();
  });

  describe('When snake goes left', function() {
    beforeEach(function(done) {
      direction = "left";
      progress_snake(snake);
      setTimeout(function() {
        value = 0;
        done();
      }, 3000);
    });

    it('should happen when snake head hits board edge', function(done) {
      expect(isOver(snake[head])).toBe(true);
      done();
    });

  });

  describe('When snake goes up', function() {
    beforeEach(function(done) {
      direction = "up";
      progress_snake(snake);
      setTimeout(function() {
        value = 0;
        done();
      }, 3000);
    });

    it('should happen when snake head hits board edge', function(done) {
      expect(isOver(snake[head])).toBe(true);
      done();
    });

  });

  describe('When snake goes right', function() {
    beforeEach(function(done) {
      direction = "right";
      progress_snake(snake);
      setTimeout(function() {
        value = 0;
        done();
      }, 3000);
    });

    it('should happen when snake head hits board edge', function(done) {
      expect(isOver(snake[head])).toBe(true);
      done();
    });

  });

  describe('When snake goes down', function() {
    beforeEach(function(done) {
      direction = "down";
      progress_snake(snake);
      setTimeout(function() {
        value = 0;
        done();
      }, 3000);
    });

    it('should happen when snake head hits board edge', function(done) {
      expect(isOver(snake[head])).toBe(true);
      done();
    });

  });

  xit('should happen when snake head touches snake body', function() {

  });
});

describe('Game During Run', function() {

  describe('The fruit', function() {

    beforeEach(function(done) {
      jasmine.getFixtures().set('<div class="board"></div>');
      setup();
      // Start with fruit right in front of snake
      $('.fruit').removeClass('fruit');
      expect($('.fruit')).not.toExist();

      quad([26, 24]).addClass('fruit');
      expect($('.fruit')).toExist();

      progress_snake(snake);

      setTimeout(function() {
        value = 0;
        done();
      }, 1000);
    });

    it('should get eaten and re-spawn', function(done) {

      expect($('.fruit')).toExist();
      expect(quad([26, 24])).not.toHaveClass('fruit');
      done();

    });

    xit('should not re-spawn on the snake body', function(done) {

    });
  });
});