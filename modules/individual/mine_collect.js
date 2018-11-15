define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		$rootScope.htmlname = 'index_my_col bgcffffff';
		document.title = '我的收藏';
		$scope.openId = getCookie('openId');
				
		$scope.boxId = getCookie('boxId');
		$scope.loadtext = '正在加载...';
		$scope.type = 1;
		$scope.seting = {
			pageNo: 1,
			pageSize: 15
		}
		$scope.list = [];
		$scope.resetDel = function () {
			$scope.dellen = 0;
			$scope.allSelect = false;
		}
		$scope.resetstate = function () {
			$scope.deleteState = false;
			$scope.resetDel();
		}
		$scope.resetstate();
		$scope.count = function () {
			$scope.dellen = $('input:checkbox:checked').length;
			var num = $("input[type='checkbox']").length;
			if ($scope.dellen == num) {
				$scope.allSelect = true;
			} else {
				$scope.allSelect = false;
			}
		}
		$scope.deletefcn = function () {
			$("input[type=checkbox]").removeAttr("checked");
			//			顶部删除
			$scope.deleteState = !$scope.deleteState;
			$scope.resetDel();
		}
		$scope.changeType = function (v) {
			$scope.list = [];
			$scope.seting.pageNo = 1;
			$scope.type = v;
			$scope.resetDel();
			$scope.loadtext = '正在加载...';
			$scope.getList();
		}

		$scope.loadtext = '';
		$scope.getList = function () {
			//type=0 代表视频       1代表 频道   2代表看单
			$scope.isc = true;
			$http.post(webset.apiurl + 'users/collect/list.json?openId=' + $scope.openId+ '&type=' + $scope.type + '&pageNo=' + $scope.seting.pageNo + '&pageSize=15', {}).success(function (e) {
				if (e && e.response.responseHeader.code == 200 && e.response.responseBody.totalrecords) {
//					$scope.list = $scope.list.concat(e.response.responseBody.list);
					$scope.list = e.response.responseBody.list;
//					alert('list长度：'+$scope.list.length)
					if (e.response.responseBody.list.length == 15) {
						$scope.isc = false;
					} else {
						$scope.loadtext = '无更多内容';
					}
				} else {
					$scope.loadtext = "暂无收藏"
				}
			});
		}
		$scope.getList();

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
			console.info("删除")
			if ($('input:checkbox:checked').length == 0) {
				$.tipshow({
					'msg': '请选择节目',
					'type': 'warning'
				});
				return;
			}
			$scope.deleteConfirm();
			// $scope.deleteCommit = true;
		}
		$scope.deleteConfirm = function () {
			var liList = $('input:checkbox:checked');
			var l = liList.length ? liList.length : 0;
			var arr = [];
			for (var i = 0; i < l; i++) {
				var id = $(liList[i]).data('id');
				arr.push(id);
			}
//			var idStr = arr.join(',')
//			$scope.commitdel(idStr.slice(0,idStr.length-1));
			$scope.commitdel(arr.join(','));
		}
		$scope.commitdel = function (ids) {
			console.info("commitdel")
			$http.post(webset.apiurl + 'users/collect/delete.json?openId=' + $scope.openId+'&type=' + $scope.type + '&id=' + ids, {}).success(function (res) {
				console.log('删除收藏', res);
				$scope.resetstate();
				if (res.response.responseHeader.code != "200") {
					$.tipshow({
						'msg': '收藏删除失败',
						'type': 'warning'
					});
				} else {
					$scope.list = [];
					$.tipshow({
						'msg': '收藏删除成功',
						'type': 'success'
					});
					$scope.list = [];
					$scope.seting.pageNo = 1;
					$scope.getList();
				}
			}).error(function () {
				$scope.resetstate();
				$.tipshow({
					'msg': '收藏删除失败',
					'type': 'warning'
				});
			});
		};
		
		//因为列表接口参数不够，需先获取单个剧集信心然后取参数
//		$scope.getDetailInfo = function (id) {
//			$http.post(webset.apiurl + 'vodHome/drama.json?id=' + id, {}).success(function (res) {
//				if (res.response) {
//					$scope.detailInfo = res.response;
//				}
//			}).error(function () {});
//		};
		
		//投屏
		$scope.gotoplay = function (type, v) {
//			$scope.addhistory(type,v);
//			$scope.getDetailInfo(v.id);
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
            if (type =='zb') {//zhibo      testapiurl   
            	var endTime = v.endTime?v.endTime:'';
                urlscy = webset.apiurl + 'users/history/save.json?type=1&id=' + v.entityId + '&code=' + v.code + '&openId='+$scope.openId+'&endTime='+endTime              
            }else if(type =='db'){
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