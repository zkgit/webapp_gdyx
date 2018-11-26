define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {

		$scope.pinyinCity = getCookie('pinyinCity');
		$scope.sc = GetRequest();
		var type = $scope.sc.type;
		if (type == 'arts') {
			document.title = '综艺娱乐';
		} else if (type == 'film') {
			document.title = '电影';
		} else if (type == 'tv') {
			document.title = '电视剧';
		} else if (type == 'anime') {
			document.title = '卡通';
		} else if (type == 'documentary') {
			document.title = '探索';
		}
		
		$scope.seting = {
			"pageNo": 1,
			"pageSize": 12
		};
		$scope.list = [];

		$scope.getAjax = function () {		
			$http.post(webset.apiurl + 'home/allHot.json?pageNo=' + $scope.seting.pageNo + '&pageSize=12&type='+type, {}).success(function (e) {
				$scope.isc = true;
				if (e.response.responseBody.list.length > 0) {
					$scope.list = $scope.list.concat(e.response.responseBody.list);
					if (e.response.responseBody.list.length == 12) {
						$scope.isc = false;
						$scope.seting.pageNo++;
						$scope.loadtext = '正在加载...';
					} else {
						$scope.loadtext = '无更多内容';
					}
				} else {
					if ($scope.list.length > 0) {
						$scope.loadtext = '无更多内容';
					} else {
						$scope.loadtext = '暂无数据';
					}

				}
			});
		}
		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {});

		$scope.getAjax();

		$scope.$on("$destroy", function () {})
	}
	return {
		controller: controller,
		tpl: tpl
	};
});