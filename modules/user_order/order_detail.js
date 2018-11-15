define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		document.title = '看单详情';
		
		
		$scope.userId = getCookie('userId');
		$scope.sc = GetRequest();
		$scope.seting = {
			pageNo: 1
		}
		//直播标签记录问题处理
		setCookie('zbno', 0);
		$scope.list = [];
		$scope.getDetail = function () {
			$http.post(webset.apiurl + 'users/watch/detail.json?cpid=' + '123'+ '&token=' + '123' + '&id=' + $scope.sc.id + '&otherId=' + $scope.sc.otherId + '&pageNo=' + $scope.seting.pageNo + '&pageSize=10', {}).success(function (res) {
				if (res && res.response.responseHeader.code == 200 && res.response.responseBody) {
					if ($scope.seting.pageNo == 1) {
						$scope.detail = res.response.responseBody.result;
						$scope.mystate();
					}
					$scope.list = $scope.list.concat(res.response.responseBody.list);
					$scope.bs.fisrt = true;
					$scope.bs.isc = true
					if (res.response.responseBody.list.length == 10) {
						$scope.bs.isc = true;
					} else {
						$scope.bs.isc = false;
						$scope.loadtext = '无更多内容';
					}
				} else if (!$scope.list.length) {
					$scope.loadtext = '暂无数据';
				}
			});
		};
		$scope.getDetail();

		$scope.bs = new botscroll(100, 85); // 滚动事件
		//点赞 点踩 收藏状态
		$scope.mystate = function () {
			var stateurl = webset.apiurl + 'users/state/check.json?cpid=' + '123'+ '&type=2&id=' + $scope.detail.id + '&token=' + '123';
			$http.post(stateurl, {}).success(function (e) {
				console.log('节目点赞/点踩/收藏状态', e.response);
				if (e && e.response.responseHeader.code == 200) {
					$scope.states = e.response.responseBody;
					$scope.is_collect = $scope.states.isCollectioned == '1' ? true : false; //是否收藏
				}
			});
		}
		$scope.changepub = function () {
			$http.post(webset.apiurl + 'users/watchForm/status.json?token=' + '123' + '&cpid=' + '123'+ '&id=' + $scope.detail.id, {}).success(function (e) {
				$scope.is_showpub = false;
				if (e && e.response.responseHeader.code == 200) {
					$scope.detail.isPublic = 1;
					$.tipshow({
						'msg': '看单已公开',
						'type': 'warning'
					});
				} else {
					$.tipshow({
						'msg': '操作失败，请稍后再试',
						'type': 'warning'
					});
				}
			}).error(function () {
				$scope.is_showpub = false;
				$.tipshow({
					'msg': '操作失败，请稍后再试',
					'type': 'warning'
				});
			});
		}
		$scope.collect = function () {
			if (!$scope.detail) {
				$.tipshow({
					'msg': '无法添加收藏',
					'type': 'warning'
				});
				return false;
			}
			var urlscy;
			if (!$scope.is_collect) { //收藏
				urlscy = webset.apiurl + 'users/collect/save.json?token=' + '123' + '&cpid=' + '123'+ '&type=2&id=' + $scope.detail.id + '&operation=1' + '&title=' + $scope.detail.title + '&image=' + $scope.detail.image;
			} else { //取消收藏
				urlscy = webset.apiurl + 'users/collect/save.json?token=' + '123' + '&cpid=' + '123'+ '&type=2&id=' + $scope.detail.id + '&operation=-1' + '&title=' + $scope.detail.title + '&image=' + $scope.detail.image;
			}

			$http.post(urlscy, {}).success(function (e) {
				console.log('收藏', e);
				if (e && e.response.responseHeader.code == "200") {
					var msg = $scope.is_collect ? '取消收藏' : '收藏成功';
					$.tipshow({
						'msg': msg,
						'type': 'success'
					});
					$scope.is_collect = !$scope.is_collect;
				} else {
					var msg = $scope.is_collect ? '取消收藏失败' : '收藏失败';
					$.tipshow({
						'msg': msg,
						'type': 'warning'
					});
				}
			});
		}
		$scope.shareKan = function () {
			$http.post(webset.apiurl + 'users/shares.json?cpid=' + '123'+ '&type=2&id=' + $scope.detail.id + '&title=' + $scope.detail.title + '&image=' + $scope.detail.image + '&token=' + '123', {}).success(function (e) {
				console.log('分享动态', e);
				if (e.response.responseHeader.code == '200') {
					$.tipshow({
						'msg': '分享至动态成功',
						'type': 'success'
					});
				} else {
					$.tipshow({
						'msg': '分享至动态失败',
						'type': 'warning'
					});
				}
				$scope.is_showshare = false;
			}).error(function () {
				$.tipshow({
					'msg': '分享至动态失败',
					'type': 'warning'
				});
				$scope.is_showshare = true;
			});
		}



		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			$scope.bs.setmax($('.html').height());

		});
		$scope.bs.getbot = function () {
			$scope.bs.isc = false;
			$scope.seting.pageNo++;
			$scope.getDetail();
		}
	}
	return {
		controller: controller,
		tpl: tpl
	};
});