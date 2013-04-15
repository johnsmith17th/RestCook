angular.module('AdminApp.directives', []).
directive('appVersion', ['version', function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}]).
directive('ngKeyup', function(version) {
	return function(scope, elm, attrs) {
		elm.bind("keyup", function() {
			scope.$apply(attrs.ngKeyup);
		});
	};
}).
directive('ngBlur', function(version) {
	return function(scope, elm, attrs) {
		elm.bind("blur", function() {
			scope.$apply(attrs.ngBlur);
		});
	};
});