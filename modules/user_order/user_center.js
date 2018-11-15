define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		$rootScope.htmlname = '';
		document.title = '用户中心';
		$scope.headimg = decodeURIComponent(getCookie('headimgurl'));
		$scope.nick = decodeURIComponent(getCookie('nickname'));
		
		
		$scope.sc = GetRequest();
		//用户信息
		$http.post(webset.apiurl + 'users/homepage.json?token=' + '123' + '&cpid=' + '123'+ '&otherId=' + $scope.sc.otherId, {}).success(function (res) {
			if (res && res.response.responseHeader.code == 200) {
				$scope.mine = res.response.responseBody;
				$scope.is_like = res.response.responseBody.status == '1' ? true : false; //是否点赞
			}
		});
		$scope.seting = {
			"pageNo": 1,
			"pageSize": 5
		};
		$scope.list = [];
		//看单列表
		$scope.getlist = function () {
			$http.post(webset.apiurl + 'users/watchingform/list.json?token=' + '123' + '&cpid=' + '123'+ '&otherId=' + $scope.sc.otherId + '&pageNo=' + $scope.seting.pageNo + '&pageSize=' + $scope.seting.pageSize, {}).success(function (res) {
				$scope.li = res.response.responseBody;
				if (res.response.responseBody) {
					$scope.list = $scope.list.concat(res.response.responseBody.list);
					$scope.bs.fisrt = true;
					$scope.bs.isc = true;
					if (res.response.responseBody.list.length == $scope.seting.pageSize) {
						$scope.bs.isc = true;
						$scope.loadtext = '正在加载...';
					} else {
						$scope.bs.isc = false;
						$scope.loadtext = '';
					}
				} else {
					$scope.bs.isc = false;
					$scope.loadtext = '';
				}

			});
		};
		$scope.getlist();
		//点击关注
		$scope.like = function () {
			$scope.pac($scope.is_like);
		};
		$scope.pac = function (yn) {
			var value;
			if (yn) value = 0;
			else value = 1;
			//关注
			$http.post(webset.apiurl + 'users/relation/update.json?status=' + value + '&cpid=' + '123'+ '&id=' + $scope.sc.otherId + '&token=' + '123', {}).success(function (res) {
				if (res && res.response.responseHeader.code == "200") {
					var msg = $scope.is_like ? '取消关注' : '关注成功';
					$.tipshow({
						'msg': msg,
						'type': 'success'
					});
					$scope.is_like = !$scope.is_like;
				} else {
					var msg;
					msg = $scope.is_like ? '关注失败' : '关注失败';
					$.tipshow({
						'msg': msg,
						'type': 'warning'
					});
				}
			});
		};

		$scope.bs = new botscroll(0, 0); // 滚动事件
		$scope.bs.getbot = function () {
			$scope.bs.isc = false;
			$scope.seting.pageNo++;
			$scope.getlist()
		};

		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			$scope.bs.setmax($('.html').height());

		});
	}
	return {
		controller: controller,
		tpl: tpl
	};
});