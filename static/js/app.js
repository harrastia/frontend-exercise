var app = angular.module("standings", ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
      .when('/', {
          templateUrl: '/static/partial/standings.html',
          controller: 'StandingsController'
      }).when('/team/:teamId', {
          templateUrl: '/static/partial/team.html',
          controller: 'TeamController'
      });
  });

app.controller("StandingsController", function($scope, $http, $interval, standingsService) {
    $scope.refreshData = function() {
        standingsService.getData().then(
            function(data) {
                $scope.error = ''
                $scope.standings = data.data.sort(function(a, b) {return a.position - b.position});
            },
            function(data) {
                $scope.error = 'Failed to refresh data!'
            });
    };
    $interval($scope.refreshData, 1000);
    $scope.refreshData();
});

app.service('standingsService', ['$http', function($http) {
    this.getData = function() {
        return $http.get('api/standings.json');
    };
}]);

app.filter('search_driver', function() {
    return function(input, query) {
        if (input == undefined || query == undefined) {
            return input;
        }
        function q_filter(value) {
            ret = value.driver.indexOf(query) > -1;
            return ret;
        }
        return input.filter(q_filter);
    };
});
app.controller("TeamController", function($scope, $http, $routeParams) {
    $http.get('api/team/' + $routeParams.teamId + '.json').then(function(res) {
        $scope.team_data = res.data;
    });

    $http.get('api/standings.json').then(function(res) {
        function filter_team(value) {
            return (value.team == $routeParams.teamId)
        }
        $scope.drivers = res.data.filter(filter_team).sort(function(a, b) {return a.position - b.position});
    });
});
