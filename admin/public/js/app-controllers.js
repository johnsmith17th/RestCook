function AppCtrl($scope, $http) {

}

function ResourcesCtrl($route, $scope, $http, $window, $location) {
	$http({
		method: 'GET',
		url: '/api/resources'
	}).
	success(function(data, status, headers, config) {
		$scope.resources = data.resources;
	}).
	error(function() {
		$scope.resources = null;
	});

	$scope.create = function() {
		$http.post('/api/resource', $scope.creation).
		success(function(data, status, headers, config) {
			$route.reload();
		}).
		error(function() {
			$route.reload();
		});
	};
}

function ResourceCtrl($scope, $http, $route, $routeParams) {
	$http({
		method: 'GET',
		url: '/api/resource',
		params: {
			resource: $routeParams.resource
		}
	}).
	success(function(data, status, headers, config) {
		$scope.resource = data.resource;
	}).
	error(function() {
		$scope.resource = null;
	});
}

function ModelCtrl($scope, $http) {
	// body...
}