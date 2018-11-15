define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$http', '$rootScope'];

	function controller($scope, $http, $rootScope) {
		document.title = '明星详情';
		$scope.sc = GetRequest();
		$scope.fold = true;
//		'123'= getCookie('cpid')
		$scope.unfold = function () {
			$scope.fold = !$scope.fold;
			if ($scope.fold) {
				$scope.introduce = $scope.actor0.introduction.slice(0, 40) + '...';
			} else {
				$scope.introduce = $scope.actor0.introduction;
			}
		}
		//明星列表
		$scope.actors = function () {
			var dmurl = webset.apiurl + 'recommend/star/profiles.json?starId=' + $scope.sc.actorId + '&name=' + $scope.sc.name;
			$http.post(dmurl, {}).success(function (e) {
				if (e.responseHeader.code == '200') {
					console.log('明星列表', e);
					$scope.detail = e.responseBody[0];
				}
			});
		};
		$scope.actors()

		$scope.seting = {
			"pageNo": 1,
			"pageSize": 12
		};

		$scope.tjlist = [];

		$scope.getAjaxList = function () {
			var urltj = webset.apiurl + 'recommend/people/related.json?type=' + $scope.sc.columnType + '&starId=' + $scope.sc.actorId + '&pageNo=' + $scope.seting.pageNo + '&pageSize=' + $scope.seting.pageSize;
			$scope.tjshow = true;
			$http.post(urltj, {}).success(function (res) {
				$scope.isc = true;
				if (res.responseBody) {
					$scope.tjlist = $scope.tjlist.concat(res.responseBody);
					if (res.responseBody.length == 12) {
						$scope.isc = false;
						$scope.seting.pageNo++;
						$scope.loadtext = '正在加载...';
					} else {
						$scope.loadtext = '无更多内容';
					}
				} else if (!$scope.tjlist.length) {
					$scope.loadtext = '暂无数据';
				} else {
					$scope.loadtext = '无更多内容';
				}
			});
		};

		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {});
		$scope.getAjaxList();

		$scope.$on("$destroy", function () {})

	}
	return {
		controller: controller,
		tpl: tpl
	};
});