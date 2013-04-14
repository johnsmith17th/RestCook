angular.module('AdminApp', ['AdminApp.filters', 'AdminApp.services', 'AdminApp.directives']).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: 'partial/resources',
		controller: ResourcesCtrl
	});
	$routeProvider.when('/resource', {
		templateUrl: 'partial/resource',
		controller: ResourceCtrl
	});
	$routeProvider.when('/resource/model', {
		templateUrl: 'partial/model',
		controller: ModelCtrl
	});
	$routeProvider.otherwise({
		redirectTo: '/'
	});
	$locationProvider.html5Mode(true);
}]);