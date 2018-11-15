define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		$rootScope.htmlname = 'index_my_order  pt60';
		document.title = '我的订购';
		$scope.openId = getCookie('openId');
		
		$scope.boxId = getCookie('boxId');
		$scope.loadtext = '';
		$scope.seting = {
			pageNo: 1
		}

		$scope.orderList = function () {
			$scope.isc = true;
			$http.post(webset.base + 'business/findUserPayInfoByBox.json?boxId='+$scope.boxId+'&cpId='+$scope.cpid, {}).success(function(e) {
                if(e .length){
                    $scope.list = e;
                    $scope.loadtext='';
                }else{
                    $scope.list=[];
                    $scope.loadtext="暂无订购记录";
                }
            }).error(function () {
               $scope.list=[];
               $scope.loadtext="暂无订购记录";
           });
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
					'msg': '请选择需要删除的数据',
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
			if ($scope.type == 0) {
				//点播
				for (var i = 0; i < len; i++) {
					$scope.deleteList.push($(liList[i]).data('id'));
				}
				$scope.reserve_arr = $scope.deleteList.join(',');
			} else {
				for (var i = 0; i < len; i++) {
					$scope.deleteList.push($(liList[i]).data('list'));
				}
				$scope.reserve_arr = encodeURIComponent(angular.toJson($scope.deleteList));
			}

			$scope.commitdel($scope.reserve_arr);
		}
		$scope.commitdel = function (reserve) {
			var orderUrl;
			if ($scope.type == 1) {
				orderUrl = webset.apiurl + 'users/myLiveReserve.json?isReserve=0&methodType=POST&openId=' + $scope.openId + '&cpid=' + '123'+ '&reserve=' + reserve;
			} else {
				orderUrl = webset.apiurl + 'users/videoReserve/del.json?openId=' + $scope.openId + '&cpid=' + '123'+ '&ids=' + reserve;
			}
			$http.post(orderUrl, {}).success(function (e) {
				$scope.resetstate();
				if (e && e.response.responseHeader.code == 200) {
					$.tipshow({
						'msg': '删除成功',
						'type': 'success'
					});
					$scope.orderList();
				} else {
					$.tipshow({
						'msg': '删除失败',
						'type': 'warning'
					});
				}
			}).error(function () {
				$scope.resetstate();
				$.tipshow({
					'msg': '删除失败',
					'type': 'warning'
				});
			});
		}


		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {

		});
	}
	return {
		controller: controller,
		tpl: tpl
	};
});




//define(['angular','size', 'fun'], function(angular, tpl) {
//  controller.$inject = ['$scope', '$rootScope', '$http'];
//
//  function controller($scope, $rootScope, $http) {
//      $rootScope.htmlname = 'pt60';
//      document.title='订购记录';
//      
//      '123'=getCookie('cpid');
//      $scope.boxId = getCookie('boxId');
//      $scope.loadtext="正在玩命加载中...";
//      $scope.seting={
//          pageNo:1
//      }
//     	$http.post(webset.base + 'business/findUserPayInfoByBox.json?boxId='+$scope.boxId+'&cpId='+'123', {}).success(function(e) {
//          if(e .length){
//              $scope.list = e;
//              $scope.loadtext='';
//          }else{
//              $scope.list=[];
//              $scope.loadtext="暂无订购记录";
//          }
//      }).error(function () {
//         $scope.list=[];
//         $scope.loadtext="暂无订购记录";
//     	});
//  }
//  return {
//      controller: controller,
//      tpl: tpl
//  };
//});