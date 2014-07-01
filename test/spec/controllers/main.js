describe('Unit: PilotsController', function() {
  beforeEach(module('racingBoard'));

  var ctrl, scope;
  var routeParams;

  routeParams = jasmine.createSpy('routeParams');
  routeParams.view_name = 'standings';

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    ctrl = $controller('PilotsController', {
      $scope: scope,
      $routeParams: routeParams
    });
  }));

  it('Should change "currentView" when call "showView"',
    function() {
      expect(scope.currentView).toEqual('standings');
      scope.showView("pilots");
      expect(scope.currentView).toEqual("pilots");
    });
});

describe('Unit: api', function() {
  var _api_, $httpBackend, $teamsJSON;
  beforeEach(module('api', 'mockedDrivers', 'mockedTeams'));

  beforeEach(inject(function ($injector, _api_, driversJSON, teamsJSON) {
    api = _api_;
    $teamsJSON = teamsJSON;
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.when('GET', "/api/standings.json").respond(driversJSON);

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it("Should to have 11 items/drivers", function(){
    api.getDriversList().then(function(result){
      expect(result.length).toBe(11);
    });
    $httpBackend.flush();
  });

  it("Should to get team by id", function(){
    var teamId = 3;
    $httpBackend.expectGET("/api/team/" + teamId + ".json").respond($teamsJSON[teamId-1]);

    api.getTeamById(teamId).then(function(data){
      expect(data).toEqual({
        "id": 3,
        "team": "Infiniti Red Bull Racing",
        "car": "Renault Energy F1-2014"
      });
    });

    $httpBackend.flush();
  })
});