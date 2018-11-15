define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		$rootScope.htmlname = 'pglist  pb60';
		$scope.sc = GetRequest();
		
		
		$scope.seting = {
			"pageNo": 1,
			"pageSize": 15
		};
		$scope.elm = {
			"J_second_tr": $('#J_second_tr')
		};
		$scope.list = [];

		$scope.getAjaxList = function () {
			$http.post(webset.apiurl + 'home/myvideo.json?cpid=' + '123'+ '&pageNo=' + $scope.seting.pageNo + '&pageSize=' + $scope.seting.pageSize + '&token=' + '123' + '&scope=1&type=' + $scope.sc.type, {}).success(function (res) {
				$scope.list = $scope.list.concat(res.response.responseBody.list);
				$scope.bs.fisrt = true;
				$scope.bs.isc = true;
				if (res.response.responseBody.list.length == $scope.seting.pageSize) {
					$scope.bs.isc = true;
					$scope.loadtext = '正在加载...';
					if (res.response.responseBody.totalrecords == "0") {
						$scope.loadtext = '暂无内容';
					}
				} else {
					$scope.bs.isc = false;
					$scope.loadtext = '无更多内容';
				}
			});
		};
		$scope.getAjaxList();

		$scope.bs = new botscroll(100, 85); // 滚动事件

		$scope.bs.getbot = function () {
			$scope.bs.isc = false;
			$scope.seting.pageNo++;
			$scope.getAjaxList();
		};
		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			$scope.bs.setmax($('.html').height());

		});
		$scope.$on("$destroy", function () {
			$scope.bs.isc = false;
		})
	}
	return {
		controller: controller,
		tpl: tpl
	};
});