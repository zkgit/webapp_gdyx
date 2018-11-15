define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		$rootScope.htmlname = 'index_my_fans bgcffffff pt60';
		$scope.openId = getCookie('openId');
		$scope.loadtext = '';
		$scope.sc = GetRequest();
		
		
		$scope.userId = getCookie('userId');
		var title = $scope.sc.otherId != $scope.userId ? '他的粉丝' : '我的粉丝';
		document.title = title;
		$scope.seting = {
			pageNo: 1,
			pageSize: 15
		}
		$scope.loadtext = '正在加载...';
		$scope.list = [];
		$scope.bs = new botscroll(100, 85); // 滚动事件
		$scope.getlist = function () {
			$http.post(webset.apiurl + "users/relation.json?cpid=" + '123'+ "&token=" + '123' + "&relation=1&pageNo=" + $scope.seting.pageNo + '&pageSize=' + $scope.seting.pageSize + '&otherId=' + ($scope.sc.otherId ? $scope.sc.otherId : 0), {}).success(function (e) {
				if (e && e.response.responseHeader.code == 200 && e.response.responseBody.list.length) {
					$scope.list = $scope.list.concat(e.response.responseBody.list);
					$scope.bs.fisrt = true;
					$scope.bs.isc = true
					if (e.response.responseBody.list.length == 15) {
						$scope.bs.isc = true;
					} else {
						$scope.bs.isc = false;
						$scope.loadtext = '无更多内容';
					}
				} else {
					$scope.list = [];
					$scope.loadtext = "暂无数据";
				}
			});
		}
		$scope.getlist();

		$scope.update = function (v) {
			var status = 0; //取消关注
			if (v.status == 0) {
				//关注
				status = 1;
			}
			$http.post(webset.apiurl + "users/relation/update.json?cpid=" + '123'+ "&token=" + '123' + "&status=" + status + "&id=" + v.id, {}).success(function (e) {
				if (e && e.response.responseHeader.code == 200) {
					v.status = status == 1 ? 2 : 0;
					$.tipshow({
						'msg': e.response.responseHeader.msg,
						'type': 'success'
					});
				} else {
					$.tipshow({
						'msg': e.response.responseHeader.msg,
						'type': 'warning'
					});
				}
			});
		}
		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			$scope.bs.setmax($('.html').height());
		});
		$scope.bs.getbot = function () {
			$scope.bs.isc = false;
			$scope.seting.pageNo++;
			$scope.getlist();
		}

	}
	return {
		controller: controller,
		tpl: tpl
	};
});