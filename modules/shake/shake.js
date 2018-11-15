define(['angular', 'size', 'fun'], function(angular, tpl) {
	controller.$inject = ['$scope', '$http', '$rootScope'];

	function controller($scope, $http, $rootScope) {
		$scope._config = _modules_config;
		$rootScope.htmlname = 'shake  pb10';
		
		$scope.bs = new botscroll(100, 85); // 滚动事件
		$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
			$scope.bs.setmax($('.html').height());
			
		});
	}
	return {
		controller: controller,
		tpl: tpl
	};
});