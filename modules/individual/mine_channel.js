define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		$scope.openId = getCookie('openId');
		$rootScope.htmlname = 'index_my_his  pt60';

		$scope.resetstate = function () {
			$scope.deleteState = false;
		}
		$scope.resetstate();
		$scope.deletefcn = function () {
			$("input[type=checkbox]").removeAttr("checked");
			//顶部删除
			$scope.deleteState = !$scope.deleteState;
		}

		$scope.loadtext = '';
		
		$scope.getCollectList = function () {
			$http.post(webset.apiurl + 'user/oftenReadChannelList/' + $scope.openId + '.json', {}).success(function (res) {
				if (res && res.response.responseHeader.code == "SCC_002") {
					console.log('常看频道', res);
					$scope.list = res.response.responseBody;
					if (res.response.responseBody.length == '0') {
						$scope.loadtext = "暂无常看频道"
					} else {
						$scope.loadtext = ""
					}
				} else {
					$scope.loadtext = "暂无常看频道"
				}
			});
		}
		$scope.getCollectList();
		// $scope.checkAll = function() {
		// 	$scope.allSelect=!$scope.allSelect;
		// 	if($scope.allSelect){
		// 		$("input[type='checkbox']").each(function () {
		// 			$(this)[0].checked = true;
		// 		})
		// 	}else{
		// 		$("input[type='checkbox']").each(function () {
		// 			$(this)[0].checked = false;
		// 		})
		// 	}
		// }
		$scope.delAllnum = '0';
		$scope.checkAll = function () {
			$scope.allSelect = !$scope.allSelect;
			if ($scope.allSelect) {
				$scope.delAllnum = '1';
				$("input[type='checkbox']").each(function () {
					$(this)[0].checked = true;
				})
			} else {
				$("input[type='checkbox']").each(function () {
					$(this)[0].checked = false;
				})
			}
		}

		$scope.deleteButton = function () {
			//底部删除
			if ($('input:checkbox:checked').length == 0) {
				$.tipshow({
					'msg': '请选择节目',
					'type': 'warning'
				});
				return;
			}
			$scope.deleteConfirm();
			//$scope.deleteCommit = true;
		}
		$scope.deleteConfirm = function () {
			var liList = $('input:checkbox:checked').parent();
			var l = liList.length ? liList.length : 0;
			for (var i = 0; i < l; i++) {
				var channelId = $(liList[i]).data('channelid');
				var channelName = $(liList[i]).data('channelname');
				if (channelId) {
					console.log(channelId);
					console.log(channelName);
					if (i == l - 1) {
						$scope.commitdel(channelId, true, channelName, true);
					} else {
						$scope.commitdel(channelId, false, channelName, false);
					}
				} else {
					continue;
				}
			}
		}
		$scope.commitdel = function (channelId, m, channelName, f) {
			$http.post(webset.apiurl + 'user/deleteoftenWatchChannel/' + $scope.openId + '/' + channelId + '.json?channelName=' + channelName + '&delAll=' + $scope.delAllnum, {}).success(function (res) {
				console.log('删除节目', res);
				if (m == true || f == true) {
					$scope.resetstate();
					if (res.response.responseHeader.code != "SCC_002") {
						$.tipshow({
							'msg': '节目删除失败',
							'type': 'warning'
						});
					} else {
						$.tipshow({
							'msg': '节目删除成功',
							'type': 'success'
						});
					}
					$scope.getCollectList();
				}
			});
		}
	}
	return {
		controller: controller,
		tpl: tpl
	};
});