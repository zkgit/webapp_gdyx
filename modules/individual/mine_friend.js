define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		$rootScope.htmlname = 'index_my_fans bgcffffff pt60';
		$scope.openId = getCookie('openId');
		$scope.loadtext = '';
		$scope.sc = GetRequest();
		
		
		$scope.userId = getCookie('userId');
		var title = $scope.sc.otherId != $scope.userId ? '他的好友' : '我的好友';
		document.title = title;
		$scope.seting = {
			pageNo: 1,
			pageSize: 15
		}
		$scope.loadtext = '正在加载...';
		$scope.list = [];
		$scope.bs = new botscroll(100, 85); // 滚动事件
		$scope.getlist = function () {
			$http.post(webset.apiurl + "users/relation.json?cpid=" + '123'+ "&token=" + '123' + "&relation=2&pageNo=" + $scope.seting.pageNo + '&pageSize=' + $scope.seting.pageSize + '&otherId=' + ($scope.sc.otherId ? $scope.sc.otherId : 0), {}).success(function (e) {
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

		$scope.update = function (v, eq) {
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
					$scope.list.splice(eq, 1);
					if (!$scope.list.length) {
						$scope.loadtext = "暂无数据";
					}
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
		//初始化
		$scope.resetstate = function () {
			$scope.deleteState = false;
			$scope.deleteCommit = false;
		}

		$scope.resetstate();
		$scope.stopBubble = function ($event) {
			$event.stopPropagation();
		}
		$scope.deletefcn = function () {
			$("input[type=checkbox]").removeAttr("checked");
			//			顶部删除
			$scope.deleteState = !$scope.deleteState;

		}
		$scope.checkAll = function () {
			$scope.allSelect = !$scope.allSelect;
			if ($scope.allSelect) {
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
			//			底部删除
			if ($('input:checkbox:checked').length == 0) {
				$.tipshow({
					'msg': '请选择节目',
					'type': 'warning'
				});
				return;
			}
			$scope.deleteCommit = true;
		}
		$scope.deleteList = [];
		$scope.deleteConfirm = function () {
			$scope.deleteList = [];
			var liList = $('input:checkbox:checked');
			var len = liList.length ? liList.length : 0;
			for (var i = 0; i < len; i++) {
				$scope.deleteList.push($(liList[i]).data('list'));
			}
			$scope.reserve_arr = JSON.stringify($scope.deleteList);
			if ($scope.deleteList) {
				$scope.commitdel(true, $scope.reserve_arr);
			} else {
				$scope.commitdel(false, $scope.reserve_arr);
			}

		}
		$scope.commitdel = function (m, reserve) {
			var data = {
				"openId": $scope.openId,
				"isReserve": '0',
				"reserve": $scope.reserve_arr
			};
			var transform = function (data) {
				return $.param(data);
			};
			var orderUrl = webset.base + "tran?DEEPURL=";
			orderUrl += testapiServerBase + 'api/v1/user/reserveLive.json';
			$http.post(orderUrl, data, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				transformRequest: transform
			}).success(function (e) {
				console.log('取消预约节目', e);
				if (m == true) {
					$scope.resetstate();
					if (e.response.responseHeader.code == 200) {
						$.tipshow({
							'msg': '取消预约成功',
							'type': 'success'
						});
					} else {
						$.tipshow({
							'msg': '取消预约失败',
							'type': 'warning'
						});
					}
				}
				$scope.orderList();
			});
		}
	}
	return {
		controller: controller,
		tpl: tpl
	};
});