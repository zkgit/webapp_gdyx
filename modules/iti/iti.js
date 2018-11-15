define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		document.title = '相关推荐';
		$rootScope.htmlname = 'pglist  pb60';
		$scope.pinyinCity = getCookie('pinyinCity');
		$scope.sc = GetRequest();
		
		$scope.seting = {
			"pageNo": 1,
			"pageSize": 12
		};
		$scope.list = [];

		$scope.bs = new botscroll(100, 85); // 滚动事件

		$scope.getAjax = function () {
			var urltj;
			if ($scope.sc.zb) {
				urltj = webset.apiurl + 'recommend/iti_vod.json?channelId=' + $scope.sc.channelID + '&pageNo=1&pageSize=6&id=&type=&cpid=' + '123';
			} else {
				urltj = webset.apiurl + 'recommend/iti_vod.json?channelId=&pageNo=' + $scope.seting.pageNo + '&pageSize=15&id=' + $scope.sc.id + '&type=' + $scope.sc.columnType + '&cpid=' + '123';
			}
			$http.post(urltj, {}).success(function (e) {
				console.log('相关推荐', e.response);
				if (e.response.responseBody.list.length > 0) {
					$scope.list = $scope.list.concat(e.response.responseBody.list);
					$scope.bs.fisrt = true;
					$scope.bs.isc = true;
					if (e.response.responseBody.list.length == 15) {
						$scope.bs.isc = true;
						$scope.loadtext = '正在加载...';
					} else {
						$scope.bs.isc = false;
						$scope.loadtext = '无更多内容';
					}
				} else {
					if ($scope.list.length > 0) {
						$scope.bs.isc = false;
						$scope.loadtext = '无更多内容';
					} else {
						$scope.loadtext = '暂无数据';
					}

				}
			});
		}
		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			$scope.bs.setmax($('.html').height());

		});

		$scope.getAjax();

		$scope.bs.getbot = function () {
			$scope.bs.isc = false;
			$scope.seting.pageNo++;
			$scope.getAjax();
		}
		$scope.$on("$destroy", function () {
			$scope.bs.isc = false;
		})
	}
	return {
		controller: controller,
		tpl: tpl
	};
});