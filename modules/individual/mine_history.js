define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		$rootScope.htmlname = 'index_my_his bgcffffff';
		document.title = '观看历史';
		$scope.loadtext = '';
		$scope.openId = getCookie('openId');
			
		$scope.boxId = getCookie('boxId');
		$scope.loadtext = '正在加载...';
		$scope.type = 1;
		$scope.seting = {
			pageNo: 1,
			pageSize: 15
		}

		$scope.list = [];
		$scope.tvlist = [];
		$scope.today = -1;
		$scope.yesterday = -1;//6天前
		$scope.earlier = -1;
		$scope.getlist = function () {
			$scope.isc = true;
			$http.post(webset.apiurl + 'users/history/list.json?openId=' + $scope.openId+ '&pageNo=' + $scope.seting.pageNo + '&pageSize=' + $scope.seting.pageSize+'&type='+$scope.type, {}).success(function (e) {
				if (e && e.response.responseHeader.code == 200 && e.response.responseBody.list.length) {
					$scope.isc = false;
					var list = e.response.responseBody.list;
					for (var i = 0; i < list.length; i++) {
						var tem = list[i].addTime.slice(0, 10);//获取当前时间的年月日
						if ($scope.today >= 0) {
							// continue;
						} else {
							if (GetDateStr(0) == tem) {
								$scope.today = i;
							}
						}
						if ($scope.yesterday >= 0) {
							// continue;
						} else {
							if (GetDateStr(-6) == tem) {
								$scope.yesterday = i;
								continue;
							}
						}

						if ($scope.earlier >= 0) {
							// continue;
						} else {
							if (GetDateStr(-1) > tem) {
								$scope.earlier = i;
								continue;
							}
						}
					}
					console.log('today=' + $scope.today + ';yesterday=' + $scope.yesterday + ';earlier=' + $scope.earlier)
					$scope.list = $scope.list.concat(e.response.responseBody.list);
					if ($scope.yesterday >= 0) {
						$scope.list[$scope.yesterday].yesterday = true;
					}
					if ($scope.today >= 0) {
						$scope.list[$scope.today].today = true;
					}
					if ($scope.earlier >= 0) {
						$scope.list[$scope.earlier].earlier = true;
					}
					if (e.response.responseBody.list.length == 15) {
						$scope.loadtext = '正在加载...';
					} else {
						$scope.loadtext = '无更多内容';
					}
				} else {
					$scope.list = [];
					$scope.loadtext = "暂无历史记录";
				}
			});
		}
		$scope.getlist();

//		$scope.gettv = function () {
//			$http.post(webset.apiurl + 'launcher/getViewHistories.json?cpid=' + '123'+ '&boxId=' + $scope.boxId + '&contenttype=', {}).success(function (e) {
//				if (e && e.response.responseHeader.code == 200 && e.response.responseBody.viewlist.length) {
//					var list = e.response.responseBody.viewlist;
//					for (var i = 0; i < list.length; i++) {
//						var tem = list[i].viewtime.slice(0, 10);
//						if ($scope.today >= 0) {} else {
//							if (GetDateStr(0) == tem) {
//								$scope.today = i;
//							}
//						}
//						if ($scope.yesterday >= 0) {} else {
//							if (GetDateStr(-1) == tem) {
//								$scope.yesterday = i;
//								continue;
//							}
//						}
//						if ($scope.earlier >= 0) {} else {
//							if (GetDateStr(-1) > tem) {
//								$scope.earlier = i;
//								continue;
//							}
//						}
//					}
//					$scope.tvlist = e.response.responseBody.viewlist;
//					if ($scope.yesterday >= 0) {
//						$scope.tvlist[$scope.yesterday].yesterday = true;
//					}
//					if ($scope.today >= 0) {
//						$scope.tvlist[$scope.today].today = true;
//					}
//					if ($scope.earlier >= 0) {
//						$scope.tvlist[$scope.earlier].earlier = true;
//					}
//					$scope.loadtext = '无更多内容';
//
//				} else {
//					$scope.tvlist = [];
//					$scope.loadtext = "暂无历史记录";
//				}
//			})
//		}
		$scope.changeType = function (v) {//1频道0片库
			$scope.list = [];
			$scope.seting.pageNo = 1;
			$scope.today = $scope.yesterday = $scope.earlier = -1;
			$scope.type = v;
			$scope.loadtext = '正在加载...';
			$scope.resetDel();
			if (v == 0) {
//				$scope.getlist();
				$scope.tbType == 'pd';
			} else {
//				$scope.gettv();
				$scope.tbType == 'pk'
			}
			$scope.getlist();
		};
		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
		});
		$scope.count = function (type) {
			$scope.dellen = $('input:checkbox:checked').length;
			var num = $("input[type='checkbox']").length;
			if ($scope.dellen == num) {
				$scope.allSelect = true;
			} else {
				$scope.allSelect = false;
			}
		}
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
			$scope.resetDel()
		}
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
			$scope.dellen = $('input:checkbox:checked').length;
		}
		$scope.deleteButton = function () {
			//			底部删除
			if ($('input:checkbox:checked').length == 0) {
				$.tipshow({
					'msg': '请选择历史记录',
					'type': 'warning'
				});
				return;
			}
			$scope.deleteCommit = true;
		}
		$scope.deleteList = new Array;
		$scope.deleteConfirm = function () {
			var liList = $('input:checkbox:checked');
			var l = liList.length ? liList.length : 0;
			var arr = [];
			var id;
			for (var i = 0; i < l; i++) {
				id = $(liList[i]).data('id');
				arr.push(id);
			}
			if (arr.length) {
//				var idStr = arr.join(',')
//				$scope.commitdel(idStr.slice(0,idStr.length-1));
				$scope.commitdel(arr.join(','));
			}
		}

		$scope.isedit = false;
		$scope.goedit = function () {
			$scope.isedit = !$scope.isedit;
		};

		$scope.commitdel = function (ids) {
			$http.post(webset.apiurl + "users/history/delete.json?openId=" + $scope.openId+ "&id=" + ids, {}).success(function (res) {
				console.log('删除历史', res);
				$scope.resetstate();
				if (res.response.responseHeader.code == 200) {
					$.tipshow({
						'msg': '删除历史成功',
						'type': 'success'
					});
					$scope.list = [];
					$scope.seting.pageNo = 1;
					$scope.today = $scope.yesterday = $scope.earlier = -1;
					$scope.getlist();
				} else {
					$.tipshow({
						'msg': '删除历史失败',
						'type': 'warning'
					});
				}
				$scope.deleteCommit = false;
			}).error(function () {
				$scope.deleteCommit = false;
				$scope.resetstate();
				$.tipshow({
					'msg': '删除历史失败',
					'type': 'warning'
				});
			});
		};
		
		//投屏
		$scope.gotoplay = function (type, v) {
//			$scope.addhistory(type,v);
//			return
            var urlpv = webset.base;
            if(type == 'db'){//片库db
            	urlpv = 'random/sendVideoRemoteMsg?type=2&assetId=' + v.code +'&providerId='+ v.cpCode+ '&openId=' + $scope.openId + '&boxId=' + $scope.boxId;
            }
            if(type == 'zb'){//频道zb:直播不需要请求详情接口
            	urlpv = 'random/sendVideoRemoteMsg?type=1&channelId=' + v.entityId + '&openId=' + $scope.openId + '&boxId=' + $scope.boxId;
            }
            $http.post(urlpv, {}).success(function (res) {
                $scope.addhistory(type,v);
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
        }
		
		$scope.addhistory = function (type,v){
            //增加首页推荐添加历史的标识---&recommend=1；
            if (type =='zb') {//zhibo  testapiurl
            	var endTime = v.endTime?v.endTime:'';
            	urlscy = webset.apiurl + 'users/history/save.json?type=1&id=' + v.entityId + '&code=' + v.code +'&openId='+$scope.openId+'&endTime='+endTime
            }
            if(type =='db'){
            	urlscy = webset.apiurl + 'users/history/save.json?type=0&id=' + v.entityId + '&code=' + v.code + '&openId='+$scope.openId +'&playNumber='+v.programNumber
            }
            $http.post(urlscy, {}).success(function (e) {});
        };
		
	}
	return {
		controller: controller,
		tpl: tpl
	};
});