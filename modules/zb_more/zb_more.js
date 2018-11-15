define(['angular', 'size', 'fun', 'slide'], function (angular, tpl) {
	controller.$inject = ['$scope', '$http', '$rootScope', '$location'];

	function controller($scope, $http, $rootScope, $location) {
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
		$scope._config = _modules_config;
		$scope.openId = getCookie('openId');
		$scope.boxId = getCookie('boxId');

//		$scope.orderStatus = function (ids) {
//			$http.get(webset.apiurl + 'users/videoReserve/status.json?cpid=' + '123'+ '&openId=' + $scope.openId + '&vodCombineId=' + ids, {}).success(function (res) {
//				for (var i = 0; i < res.response.responseBody.length; i++) {
//					$scope.coming[i].isorder = parseInt(res.response.responseBody[i])
//				}
//			})
//		}
//		$scope.be_coming = function () {
//			$http.post(webset.apiurl + 'vodHome/videoReserve.json?cpid=' + '123'+ "&pageNo=1&pageSize=6&openId=" + $scope.openId, {}).success(function (e) {
//				$scope.coming = e.response.responseBody.list;
//				//处理预约
//				var data = e.response.responseBody.list;
//				var arr = [];
//				for (var i = 0; i < data.length; i++) {
//					arr.push(data[i].vodCombineId);
//				}
//				$scope.orderStatus(arr.join(','))
//			});
//		}
//		$scope.be_coming();

		//点播预约
//		$scope.orderdb = function (data) {
//			// $scope.reserve= encodeURIComponent(angular.toJson(data));
//			// console.info($scope.reserve);
//			var orderUrl = webset.apiurl + 'users/videoReserve.json?openId=' + $scope.openId + '&cpid=' + '123'+ '&vodCombineId=' + data.vodCombineId + '&operation=0&title=' + data.title + '&kankeId=' + data.kankeId + '&image=' + data.image + '&edition=' + data.edition + '&videoType=' + data.videoType;
//			if (data.isorder) {
//				$http.post(orderUrl, {}).success(function (e) {
//					console.log('取消预约节目', e);
//					if (e.response.responseHeader.code == 200) {
//						data.isorder = false;
//						$.tipshow({
//							'msg': '取消预约成功',
//							'type': 'success'
//						});
//					} else {
//						$.tipshow({
//							'msg': '取消预约失败',
//							'type': 'warning'
//						});
//					}
//				});
//			} else {
//				orderUrl = webset.apiurl + 'users/videoReserve.json?openId=' + $scope.openId + '&cpid=' + '123'+ '&vodCombineId=' + data.vodCombineId + '&operation=1&title=' + data.title + '&kankeId=' + data.kankeId + '&image=' + data.image + '&edition=' + data.edition + '&videoType=' + data.videoType;
//				$http.post(orderUrl, {}).success(function (e) {
//					console.log('预约节目', e);
//					if (e && e.response.responseHeader.code == 200) {
//						data.isorder = true;
//						$.tipshow({
//							'msg': '预约成功',
//							'type': 'success'
//						});
//					} else {
//						$.tipshow({
//							'msg': '预约失败',
//							'type': 'warning'
//						});
//					}
//				});
//			}
//		};


		$scope.seting = {
			"pageNo": 0,
		};

		$scope.getAjax = function () {
			$scope.seting.pageNo++;
			$http.post(webset.apiurl + 'home/followingLive.json?pageNo=' + $scope.seting.pageNo + '&pageSize=6&type='+type, {}).success(function (res) {
				$scope.followingEpgList = res.response.responseBody.followingEpgList;
				$scope.nowEpgList = res.response.responseBody.nowEpgList;
			});
		};
		$scope.getAjax();

		$scope.list = {};
		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {

		});
	}
	return {
		controller: controller,
		tpl: tpl
	};
});