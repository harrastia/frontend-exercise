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

app.controller("StandingsController", function($scope, standingsService) {
    $scope.standingsService = standingsService;
});

app.service('standingsService', ['$http', '$interval', function($http, $interval) {
    var me = this;
    me.getData = function() {
        return $http.get('api/standings.json');
    };
    me.refreshData = function() {
        me.getData().then(
            function(data) {
                me.error = ''
                me.standings = data.data.sort(function(a, b) {return a.position - b.position});
            },
            function(data) {
                me.error = 'Failed to refresh data!'
            });
    };
    $interval(me.refreshData, 1000);
    me.refreshData();
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

app.filter("teamFilter", function() {
    return function(input, teamId) {
        function filter_team(value) {
            return value.team == teamId
        }
        return input.filter(filter_team).sort(function(a, b) {return a.position - b.position});
    };
});

app.controller("TeamController", function($scope, $http, $routeParams, standingsService) {
    $http.get('api/team/' + $routeParams.teamId + '.json').then(function(res) {
        $scope.team_data = res.data;
    });
    $scope.standingsService = standingsService;
    $scope.teamId = $routeParams.teamId;
});
