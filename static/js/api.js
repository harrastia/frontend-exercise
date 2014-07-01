'use strict';

/* API */
var serverApi = angular.module('api', []);

// Note: We should to use ngResource module, but this case is overkill
serverApi.service('api', function($http, $q, $interval, $rootScope){
  var drivers = 'undefined';
  var intevalId;

  /* Return the list of the pilots from 'cache' or fetching them from the server if the cache is empty */
  this.getDriversList = function() {
    var deferred = $q.defer();

    if (drivers === 'undefined') {
      return this.fetchDrivers().then(function(data){
        drivers = data;
        return drivers;
      });
    }
    deferred.resolve(drivers);
    return deferred.promise;
  };

  /* Fetch pilots in json from server */
  this.fetchDrivers = function() {
    var request = $http({
      method: "get",
      url: '/api/standings.json'
    });

    return request.then(function(data){
      return data.data;
    });
  };

  /* Updates cache/fetch data from the server every 1 sec */
  this.updatePoints = function() {
    var self = this;
    intevalId = $interval(function(){
      self.fetchDrivers().then(function(data){
      drivers = data;
      $rootScope.$broadcast("event:pointsUpdated", data);
    })
  }, 1000);
  };

  /* Call function for  auto fetching the pilots if the interval object is undefined */
  if (!angular.isDefined(this.intevalId)) {
     this.updatePoints();
  }

  /* Return data of a team with specified ID */
  this.getTeamById = function(teamId) {
    var request = $http({
      method: "get",
      url: '/api/team/' + teamId + '.json'
    });

    return request.then(function(data) {
      return data.data;
    });
  }
});