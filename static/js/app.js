'use strict';

var racingBoard = angular.module('racingBoard', [
  'ngRoute',
  'raceControllers'
]);

/* Router */
racingBoard.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/:view_name', {
        templateUrl: 'static/templates/pilots.html',
        controller: 'PilotsController'
      }).
      when('/standings/:team_id', {
        templateUrl: 'static/templates/standings_board.html',
        controller: 'StandingsBoardController'
      }).
      otherwise({
        redirectTo: '/pilots'

      });
  }]);

/* Filters */
/*
* Filter the pilots of the team
* @param teamId {number}  the number/id of the team
* @return {object} the list of pilots of the team,
* */
racingBoard.filter('byTeam', function(){
  return function(input, teamId){
    if (typeof input === 'undefined') {
      return false;
    }
    var pilots = function(item) {
      return item.team == teamId;
    };

    return input.filter(pilots);
  };
});