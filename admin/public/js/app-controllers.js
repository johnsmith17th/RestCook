function AppCtrl($scope, $http) {

}

function ResourcesCtrl($route, $scope, $http) {
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

function ResourceCtrl($scope, $http) {
	// body...
}

function ModelCtrl($scope, $http) {
	// body...
}