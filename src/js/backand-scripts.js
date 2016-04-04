//app.js
var highscores = {};

var snakegame = angular.module('snakegame', ['backand'])

//Update Angular configuration section
.config(function(BackandProvider) {
	BackandProvider.setAppName('snakegame');
	BackandProvider.setSignUpToken('f2b442ed-11a5-4ac0-90d8-5b15a7b746c6');
	BackandProvider.setAnonymousToken('e8fe4247-b670-48a4-9caa-4fa99f9820ab');
})
.run(function ($http, Backand) {
		var vm = this;
		var highscores = {};
		//get the object name and optional parameters
		vm.getList = function(name, sort, filter) {
			name = 'highscores';
			return $http({
				method: 'GET',
				url: Backand.getApiUrl() + '/1/objects/' + name,
				params: {
					pageSize: 20,
					pageNumber: 1,
					filter: filter || '',
					sort: sort || ''
				}
			}).then(function(data) {
				var datArr = data.data.data;
				var count = 1;
				console.log('Got data');
				datArr.sort(function(a,b) {
					if (a.score < b.score) {
					    return 1;
					  }
					  if (a.score > b.score) {
					    return -1;
					  }
					  return 0;
				});
				console.log(datArr);
				//localStorage.highscores = JSON.stringify(datArr);
				$('#leaderboard ol').text('');
				datArr.forEach(function(item) {
					$('#leaderboard ol').append("<li>" +
						item.user + " " +
						item.score + "</li>");
				});
			});
		};

		vm.updateList = function(username, score) {
			var name = 'highscores',
				today = new Date();
				today = today.toISOString();
			return $http({
				method: 'POST',
				url: Backand.getApiUrl() + '/1/objects/' + name,
				data: 
					{
						"user" : username,
						"score" : score,
						"created" : today
					}
			}).then(function() {
				vm.getList();
			});
		};

		$('#postform').submit(function(e) {
			e.preventDefault();
			var name = $('#postform input[name="name"]').val();
			var score = $('#postform input[name="score"]').val();
			console.log('submit' + name);
			console.log(model.game.score);
			vm.updateList(name, model.game.score);
			$('#postform').trigger('reset').hide();
			$('.closebtn').show();
		});

		vm.getList();

	}
);
