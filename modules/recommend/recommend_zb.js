define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		$rootScope.htmlname = 'pglist  pb60';
		
		$scope.sc = GetRequest();
		$scope.pinyinCity = getCookie('pinyinCity');
		$scope.seting = {
			"pageNo": 1,
			"pageSize": 15
		};

		$scope.elm = {
			"J_second_tr": $('#J_second_tr')
		};
		$scope.hotlist = [];
		$scope.toptil = $scope.sc.tags;

		$scope.bs = new botscroll(100, 85); // 滚动事件

		$scope.getAjax = function () {
			var ituUrl = webset.apiurl + 'vod/mylives.json';
			data = {
				"appKey": "34DB874AF269B539",
				"appScrect": "40",
				"token": '123',
				"pageSize": 15,
				"pageNo": $scope.seting.pageNo,
				"dtid": $scope.pinyinCity
			};

			var transform = function (data) {
				return $.param(data);
			};
			$http.post(ituUrl, data, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				transformRequest: transform
			}).success(function (res) {
				console.log('结果', res);
				$scope.hotlist = $scope.hotlist.concat(res.response.responseBody.list);
				$scope.bs.fisrt = true;
				$scope.bs.isc = true;
				if (res.response.responseBody.list.length == 15) {
					$scope.bs.isc = true;
				} else {
					$scope.bs.isc = false;
					$scope.loadtext = '无更多内容';
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