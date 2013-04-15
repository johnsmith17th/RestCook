function AppCtrl($scope, $http) {

}

function ResourcesCtrl($route, $scope, $http, $window, $location) {
	$http({
		method: 'GET',
		url: '/api/resources'
	}).
	success(function(data) {
		$scope.resources = data.message;
	}).
	error(function(data) {
		$scope.resources = null;
		$scope.error = data;
		$location.path('/error');
	});

	/**
	 * On create resource button click.
	 */
	$scope.create = function() {
		$http.post('/api/resource', $scope.creation).
		success(function(data, status, headers, config) {
			$route.reload();
		}).
		error(function(data) {
			$scope.error = data;
			$location.path('/error');
		});
	};
}

function ResourceCtrl($scope, $http, $routeParams, $location) {

	$scope.deleteDisabled = true;

	$http({
		method: 'GET',
		url: '/api/resource',
		params: {
			name: $routeParams.resource
		}
	}).
	success(function(data) {
		$scope.resource = data.message;
	}).
	error(function(data) {
		$scope.resource = null;
		$scope.error = data;
		$location.path('/error');
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
		error(function(data) {
			$scope.error = data;
			$location.path('/error');
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
		error(function(data) {
			$scope.error = data;
			$location.path('/error');
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

function ModelCtrl($route, $scope, $http, $location, $routeParams) {

	$scope.resource = {
		name: $routeParams.resource
	};

	$http({
		method: 'GET',
		url: '/api/resource/model',
		params: {
			name: $routeParams.resource
		}
	}).
	success(function(data) {
		$scope.model = data.message;
	}).
	error(function(data) {
		$scope.model = null;
		$scope.error = data;
		console.log(data);
		$location.path('/error');
	});

	$scope.save = function() {
		$http({
			method: 'PUT',
			url: '/api/resource/model',
			params: {
				name: $routeParams.resource,
				model_name: $scope.model.name,
				model_collection: $scope.model.collection
			}
		}).
		success(function(data, status, headers, config) {
			$route.reload();
		}).
		error(function(data) {
			$scope.model = null;
			$scope.error = data;
			$location.path('/error');
		});
	};

	$scope.putField = function() {
		$http({
			method: 'DELETE',
			url: '/api/resource/model/schema',
			params: {
				name: $routeParams.resource,
				model_name: $scope.model.name,
				model_collection: $scope.model.collection
			}
		}).
		success(function(data, status, headers, config) {
			$route.reload();
		}).
		error(function(data) {
			$scope.model = null;
			$scope.error = data;
			$location.path('/error');
		});
	};

	$scope.delField = function() {
		$http({
			method: 'DELETE',
			url: '/api/resource/model/schema',
			params: {
				name: $routeParams.resource,
				model_name: $scope.model.name,
				model_collection: $scope.model.collection
			}
		}).
		success(function(data, status, headers, config) {
			$route.reload();
		}).
		error(function(data) {
			$scope.model = null;
			$scope.error = data;
			$location.path('/error');
		});
	};
}

function ErrorCtrl($scope) {

}