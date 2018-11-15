define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		document.title = '我的直播';
		$rootScope.htmlname = 'pglist  pb60';
		$scope.pinyinCity = getCookie('pinyinCity');
		$scope.sc = GetRequest();
		
		$scope.seting = {
			"pageNo": 1,
			"pageSize": 12
		};
		$scope.list = [];

		$scope.getAjax = function () {
			$http.post(webset.apiurl + 'home/hotLive.json?pageNo=' + $scope.seting.pageNo + '&pageSize=12', {}).success(function (e) {
				$scope.isc = true;
				if (e.response.responseBody.list.length > 0) { 
					$scope.list = $scope.list.concat(e.response.responseBody.list);
					if (e.response.responseBody.list.length == 15) {
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
		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {

		});

		$scope.getAjax();
		$scope.$on("$destroy", function () {
		})
	}
	return {
		controller: controller,
		tpl: tpl
	};
});