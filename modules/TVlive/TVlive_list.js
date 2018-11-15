define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$http', '$rootScope'];

	function controller($scope, $http, $rootScope) {
		$scope._config = _modules_config;
		$scope.pinyinCity = getCookie('pinyinCity')

		$scope.sc = GetRequest();
		$scope.toptil = $scope.sc.t ? ['正在播', '即将播', '今晚播'][$scope.sc.t] : '参数获取失败'
		$scope.time = $scope.sc.t ? ['now', 'late', 'tonight'][$scope.sc.t] : '参数获取失败'
		$scope.bs = new botscroll(100, 85); // 滚动事件

		$scope.list = [];
		$scope.loadtext = '正在加载···';
		$scope.getAjax = function () {
			$http.post(webset.apiurl + 'vod/hottypes.json?type=' + $scope.sc.classId + '&times=' + $scope.time + '&did=' + $scope.pinyinCity, {}).success(function (res) {
				console.log('直播分类-' + $scope.sc.classId + ':', res.response.responseBody[0]);
				$scope.list = res.response.responseBody.list;
				$scope.loadtext = '无更多内容';
			});
		}
		$scope.getAjax();
		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			$scope.bs.setmax($('.html').height());

		});
	}
	return {
		controller: controller,
		tpl: tpl
	};
});