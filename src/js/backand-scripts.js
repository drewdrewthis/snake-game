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
				console.log('Got data');
				localStorage.highscores = JSON.stringify(data.data.data);
				console.log(JSON.parse(localStorage.highscores));
				$('#leaderboard ul').text();
				JSON.parse(localStorage.highscores).forEach(function(item) {
					$('#leaderboard ul').append("<li>" +
						item.user + " " +
						item.score + "</li>");
				});

			});
		};

		vm.updateList = function(username, score) {
			var name = 'highscores';
			return $http({
				method: 'POST',
				url: Backand.getApiUrl() + '/1/objects/' + name,
				data: 
					{
						"user" : username,
						"score" : score
					}
			});
		};

		$('#postform').submit(function(e) {
			e.preventDefault();
			var name = $('#postform input[name="name"]').val();
			var score = $('#postform input[name="score"]').val();
			console.log('submit' + name+score);

			vm.updateList(name,score);
		});

		vm.getList();


	}
);
