'use strict';

/* Controllers */
var raceControllers = angular.module('raceControllers', ['api']);

/* View of the pilots */
raceControllers.controller('PilotsController', ['$scope', '$route', '$routeParams', 'api', '$location',
  function($scope, $route, $routeParams, api, $location) {
    var lastRoute = $route.current;
    var prevPredicate;
    var prevReverse;
    var prevView;
    $scope.predicate = 'points';
    $scope.reverse = true;

    $scope.currentView = $routeParams.view_name;


    $scope.$on('$locationChangeSuccess', function(event) {
      if($route.current.$$route.controller === 'PilotsController'){
        // It'll not load only if my view is already use the same controller
        $route.current = lastRoute;
      }
    });

    $scope.showView = function(viewName) {
      $location.url('/' + viewName);
      $scope.currentView = viewName;
      if (viewName === 'pilots') {
        if (prevView !== 'pilots') {
          prevView = 'pilots';
          prevPredicate = $scope.predicate;
          prevReverse = $scope.reverse;
        }
        $scope.predicate = 'driver';
        $scope.reverse = false;
      } else {
        $scope.predicate = prevPredicate;
        $scope.reverse = prevReverse;
      }
    };

    api.getDriversList().then(function(drivers){
      $scope.drivers = drivers;

      angular.forEach($scope.drivers, function(value, key) {
         api.getTeamById(value.team).then(function(team){
           $scope.drivers[key].teamName = team.team;
         });
       });
    });

    $scope.showTeam = function(teamId) {
      $location.path('/standings/' + teamId)
    };

    $scope.$on("event:pointsUpdated", function(event, args){
      angular.forEach(args, function(value, key){
        $scope.drivers[key].points = value.points;
      });
    });

    /* Styling helpers */
    $scope.isActive = function(viewName) {
      return viewName === $scope.currentView;
    }
  }
]);

/* View of the current standings on the race */
raceControllers.controller('StandingsBoardController', ['$scope', '$routeParams', 'api',
  function($scope, $routeParams, api) {
    $scope.predicate = 'points';
    $scope.reverse = true;

    api.getTeamById($routeParams.team_id).then(
      function(team){
        $scope.team = team;
      });

    api.getDriversList().then(function(drivers){
      $scope.drivers = drivers;
    });

    $scope.$on("event:pointsUpdated", function(event, args){
      angular.forEach(args, function(value, key){
        $scope.drivers[key].points = value.points;
      });
    });
  }
]);