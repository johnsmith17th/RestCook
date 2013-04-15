angular.module('AdminApp', ['AdminApp.filters', 'AdminApp.services', 'AdminApp.directives', '$strap.directives']).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: 'partial/resources',
		controller: ResourcesCtrl
	});
	$routeProvider.when('/resource/:resource', {
		templateUrl: 'partial/resource',
		controller: ResourceCtrl
	});
	$routeProvider.when('/resource/model', {
		templateUrl: 'partial/model',
		controller: ModelCtrl
	});
	$routeProvider.when('/error', {
		templateUrl: 'partial/error'
	});
	$routeProvider.otherwise({
		redirectTo: '/'
	});
	$locationProvider.html5Mode(true);
}]);