define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		$rootScope.htmlname = 'index_my_order  pt60';
		document.title = '我的预约';
		$scope.openId = getCookie('openId');		
		$scope.boxId = getCookie('boxId');
		
		$scope.loadtext = '';
		$scope.type = 1;//直播1，点播0；现在只有直播
//		$scope.changeType = function (v) {
//			$scope.list = [];
//			$scope.type = v;
//			$scope.loadtext = "正在加载...";
//			$scope.orderList();
//			$scope.list = [];
//		}
		$scope.seting = {
			pageNo: 1
		}

		$scope.orderList = function () {
//			if ($scope.type == 0) {
//				//点播
//				$http.post(webset.apiurl + 'users/videoReserve/list.json?cpid=' + '123'+ '&openId=' + $scope.openId + "&pageNo=1&pageSize=100", {}).success(function (e) {
//					if ((e.response.responseHeader.code == 200) && e.response.responseBody && e.response.responseBody.list.length) {
//						$scope.list = e.response.responseBody.list;
//						$scope.loadtext = "";
//					} else {
//						$scope.loadtext = "暂无预约";
//					}
//
//
//				})
//			} else {
				//直播
				var orderlistUrl = webset.apiurl + 'users/userReserveInfo.json?type=' + $scope.type + '&openId=' + $scope.openId;
				$http.post(orderlistUrl, {}).success(function (e) {
					if (e && e.response.responseHeader.code == 200) {
						$scope.list = e.response.responseBody;
						console.info("预约列表", $scope.list)
						if (e.response.responseBody == null) {
							$scope.loadtext = "暂无预约";
						} else {
							$scope.loadtext = "";
						}
					} else {
						$scope.list = [];
						$scope.loadtext = "暂无预约";
					}
				})
//			}

		}
		$scope.orderList();

		//初始化
		$scope.resetDel = function () {
			$scope.dellen = 0;
			$scope.allSelect = false;
		}
		$scope.resetstate = function () {
			$scope.deleteState = false;
			$scope.deleteCommit = false;
			$scope.resetDel()
		}

		$scope.resetstate();

		$scope.stopBubble = function ($event) {
			$event.stopPropagation();
		}
		$scope.deletefcn = function () {
			$("input[type=checkbox]").removeAttr("checked");
			//			顶部删除
			$scope.deleteState = !$scope.deleteState;
			$scope.resetDel();
		}
		$scope.countdel = function () {
			$scope.dellen = $('input:checkbox:checked').length;
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
			$scope.dellen = $('input:checkbox:checked').length;
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
//			if ($scope.type == 0) {
//				//点播
//				for (var i = 0; i < len; i++) {
//					$scope.deleteList.push($(liList[i]).data('id'));
//				}
//				$scope.reserve_arr = $scope.deleteList.join(',');
//			} else {
				for (var i = 0; i < len; i++) {
					$scope.deleteList.push($(liList[i]).data('list'));
				}
				$scope.reserve_arr = encodeURIComponent(angular.toJson($scope.deleteList));
//			}

			$scope.commitdel($scope.reserve_arr);
		}
		$scope.commitdel = function (reserve) {
			var orderUrl;
//			if ($scope.type == 1) {
				orderUrl = webset.apiurl + 'users/myLiveReserve.json?isReserve=0&methodType=POST&openId=' + $scope.openId + '&reserve=' + reserve;
//			} else {
//				orderUrl = webset.apiurl + 'users/videoReserve/del.json?openId=' + $scope.openId + '&cpid=' + '123'+ '&ids=' + reserve;
//			}
			$http.post(orderUrl, {}).success(function (e) {
				$scope.resetstate();
				if (e && e.response.responseHeader.code == 200) {
					$.tipshow({
						'msg': '取消预约成功',
						'type': 'success'
					});
					$scope.orderList();
				} else {
					$.tipshow({
						'msg': '取消预约失败',
						'type': 'warning'
					});
				}
			}).error(function () {
				$scope.resetstate();
				$.tipshow({
					'msg': '取消预约失败',
					'type': 'warning'
				});
			});
		};
		
		//投屏
		$scope.gotoplay = function (v) {
            var urlpv = webset.base;
//          if(v.type == 0){//片库db:assetID providerID   openId boxId
//          	urlpv = 'random/sendVideoRemoteMsg?type=2&assetID=' + v.code +'&providerID='+ v.cpCode+ '&openId=' + $scope.openid + '&boxId=' + $scope.boxId;
//          }else{//频道zb:
            	urlpv = 'random/sendVideoRemoteMsg?type=1&channelId=' + v.channelId + '&openId=' + $scope.openId + '&boxId=' + $scope.boxId;
//          }
            $http.post(urlpv, {}).success(function (res) {
                $scope.addhistory(v);
                if (res && res.result == "0") {
                    $.tipshow({
                        'msg': '推送成功',
                        'type': 'success',
                        'lineheight':true
                    });
                } else {
                    $.tipshow({
                        'msg': '推送失败',
                        'type': 'warning',
                        'lineheight':true
                    })
                }
            }).error(function () {
				$.tipshow({
                    'msg': '推送失败',
                    'type': 'warning',
                    'lineheight':true
                 })
			});
        };
        
        $scope.addhistory = function (v){
            //增加首页推荐添加历史的标识---&recommend=1；
//          if (v.type == 1) {//zhibo  testapiurl
            	var endTime = v.endTime?v.endTime:'';
            	var urlscy = webset.apiurl + 'users/history/save.json?type=1&entityId=' + v.channelId + '&code=' + v.code +'&openId='+$scope.openId+'&endTime='+endTime
//          }
//          if(v.type == 0){
//          	var urlscy = webset.apiurl + 'users/history/save.json?type=0&id=' + v.entityId + '&code=' + v.code + '&openId='+$scope.openId +'&playNumber='+v.programNumber
//          }
            $http.post(urlscy, {}).success(function (e) {});
        };

		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {});
	}
	return {
		controller: controller,
		tpl: tpl
	};
});