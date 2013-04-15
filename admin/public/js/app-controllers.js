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

	/**
	 * On create resource button click.
	 */
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

function ResourceCtrl($scope, $http, $route, $routeParams, $location) {

	$scope.deleteDisabled = true;

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

	/**
	 * On save changes button click.
	 */
	$scope.save = function() {
		$http({
			method: 'PUT',
			url: '/api/resource',
			params: $scope.resource
		}).
		success(function(data, status, headers, config) {
			$location.path('/');
		}).
		error(function() {
			$location.path('/');
		});
	};

	/**
	 * On confirm and delete button click
	 */
	$scope.del = function() {
		$http({
			method: 'DELETE',
			url: '/api/resource',
			params: {
				name: $scope.resource.name
			}
		}).
		success(function(data, status, headers, config) {
			$location.path('/');
		}).
		error(function() {
			$location.path('/');
		});
	};

	/**
	 * On confirm input key up.
	 */
	$scope.validate = function() {
		var value = angular.element('#confirmName').val();
		$scope.deleteDisabled = $scope.resource.name != value;		
	};
}

function ModelCtrl($scope, $http) {
	// body...
}

function ErrorCtrl($scope) {

}