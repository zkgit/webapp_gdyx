define(['angular', 'wxshare', 'size', 'fun', 'slide'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		
		
		$scope.userId = getCookie('userId');

		$scope.fr_ky = true;
		$scope.fr_hy = false;
		$scope.seting = {
			"pageNo": 1,
			"pageSize": 5
		};
		$scope.tip = function () {
			$scope.fr_ky = !$scope.fr_ky;
			$scope.fr_hy = !$scope.fr_hy;
			$scope.seting.pageNo = 1;
			$scope.res = [];
			if ($scope.fr_ky) {
				$scope.getky();
				$scope.loadtext = '正在加载...';
			} else {
				$scope.gethy();
			}
		};
		$scope.selectIndex = -1;
		$scope.selectArr = ['全部', '关注', '粉丝', '好友'];
		$scope.changeSelect = function (eq) {
			$scope.selectIndex = eq;
			$scope.is_showselect = false;
			$scope.res = [];
			$scope.seting.pageNo = 1;
			$scope.getky();
		}
		$scope.res = [];
		$scope.getky = function () {
			$http.post(webset.apiurl + 'home/friendShow.json?cpid=' + '123'+ '&type=1&pageNo=' + $scope.seting.pageNo + '&pageSize=5&relation=' + $scope.selectIndex + '&token=' + '123', {}).success(function (res) {
				$scope.res = $scope.res.concat(res.response.responseBody.list);
				$scope.bs.fisrt = true;
				$scope.bs.isc = true;
				if (res.response.responseBody.list.length == 5) {
					$scope.bs.isc = true;
					$scope.loadtext = '正在加载...';
				} else {
					$scope.bs.isc = false;
					$scope.loadtext = '无更多内容';
				}
			});
		};

		$scope.gethy = function () {
			$http.post(webset.apiurl + 'home/friendShow.json?cpid=' + '123'+ '&type=2&relation=2&pageNo=1&pageSize=5&token=' + '123', {}).success(function (res) {
				$scope.list = res.response.responseBody.list;
			});
		};
		$scope.getky();
		$scope.like = function (v) {
			$scope.is_like = v.likeStatus == '0' ? false : true; //是否点赞
			var value = $scope.is_like ? -1 : 1;
			$http.post(webset.apiurl + 'users/like.json?cpid=' + '123'+ '&operation=' + value + '&type=' + v.type + '&id=' + v.id + '&tag=F' + '&token=' + '123' + '&otherId=' + $scope.userId, {}).success(function (e) {
				if (e && e.response.responseHeader.code == "200") {
					var msg = $scope.is_like ? '取消点赞' : '点赞成功';
					$.tipshow({
						'msg': msg,
						'type': 'success'
					});
					if (!$scope.is_like) {
						v.count = parseInt(v.count) + 1;
						v.likeStatus = 1;
					} else {
						if (parseInt(v.count) == 0 || !v.count) {
							v.count = 0;
						} else {
							v.count = parseInt(v.count) - 1;
						}
						v.likeStatus = 0;
					}
					$scope.is_like = !$scope.is_like;
				} else {
					var msg;
					msg = $scope.is_like ? '取消失败' : '点赞失败';
					$.tipshow({
						'msg': msg,
						'type': 'warning'
					});
				}
			});
		};

		$scope.del = function (index, v) {
			$http.post(webset.apiurl + 'users/moment/del.json?cpid=' + '123'+ '&token=' + '123' + '&momentIds=' + v.id, {}).success(function (e) {
				if (e && e.response.responseHeader.code == "200") {
					$.tipshow({
						'msg': '删除成功',
						'type': 'success'
					});
					$scope.res.splice(index, 1);
				} else {
					$.tipshow({
						'msg': '删除失败',
						'type': 'warning'
					});
				}
			})
		}
		$scope.bs = new botscroll(100, 85); // 滚动事件
		$scope.bs.getbot = function () {
			$scope.bs.isc = false;
			$scope.seting.pageNo++;
			if ($scope.fr_ky) {
				$scope.getky()
			} else {

			}
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