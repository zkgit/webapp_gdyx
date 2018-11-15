define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		$rootScope.htmlname = 'index_my_his  pt60';
		document.title = '我的设备';
		$scope.openId = getCookie('openId');
		

		//初始化
		$scope.resetDel = function () {
			$scope.dellen = 0;
			$scope.allSelect = false;
		}
		$scope.resetstate = function () {
			$scope.isedit = false;
			$scope.addState = false;
			$scope.deleteState = false;
			$scope.deleteCommit = false;
			$scope.goback = false;
			$scope.resetDel();
		}
		$scope.seting = {
			'pageNo': 1,
			'pageSize': 5
		}
		//		$scope.bs = new botscroll(100, 85); // 滚动事件
		$scope.resetstate();
		$scope.list = [];
		$scope.getDeviceList = function (place) {
			var devicelistUrl = webset.apiurl + "users/boxList.json?openId=" + $scope.openId + "&pageNo=" + $scope.seting.pageNo + "&pageSize=" + $scope.seting.pageSize;
			$http.post(devicelistUrl, {}).success(function (res) {
				if (res.response.responseHeader.code == '200' && res.response.responseBody.list.length) {
					// setCookie("boxId", res.response.responseBody.list) ;
					console.log('设备列表', res);
					var list = res.response.responseBody.list;
					for (var i = 0; i < list.length; i++) {
						if (list[i].level == '1') {
							setCookie("boxId", list[i].boxId);
							setCookie("cpid", list[i].cpid);
						}
					}

					$scope.list = $scope.list.concat(list);
					//					$scope.bs.fisrt = true;
					//					$scope.bs.isc = true
					if (res.response.responseBody.list.length == 5) {
						//						$scope.bs.isc = true;
					} else {
						//						$scope.bs.isc = false;
						$scope.loadtext = '无更多内容';
					}
				}
			})

		}

		$scope.getDeviceList();
		$scope.countdel = function () {
			$scope.dellen = $('#devicelist input:checkbox:checked').length;
			var num = $("#devicelist input[type='checkbox']").length;
			if ($scope.dellen == num) {
				$scope.allSelect = true;
			} else {
				$scope.allSelect = false;
			}
		}
		$scope.bindDevice = function () {
			$scope.addState = true;
		}
		$scope.boxId = "";
		$scope.stopBubble = function ($event) {
			$event.stopPropagation()
		}
		// $scope.bind_commit = function(e) {
		// 	if($scope.boxinputid.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
		// 		$.tipshow({
		// 			'msg': '请输入绑定码',
		// 			'type': 'warning'
		// 		});
		// 		return;
		// 	}
		// 	$http.post(webset.apiurl + "users/bind.json?type=0&openId=" + $scope.openId + "&boxId=" + $scope.boxinputid+"&changebind=0&cpid="+'123', {}).success(function(res) {
		// 		console.log('绑定设备', res);
		// 		$scope.addState = false;
		// 		$scope.boxId = "";
		// 		if(res.response.responseHeader.code=='200'){
		// 			$.tipshow({
		// 				'msg': res.response.responseHeader.msg,
		// 				'type': 'success'
		// 			});
		// 			$scope.list=[];
		// 			$scope.seting.pageNo=1;
		// 			$scope.getDeviceList(true);
		// 		} else {
		// 			$.tipshow({
		// 				'msg': res.response.responseHeader.msg,
		// 				'type': 'warning'
		// 			});
		// 		}
		// 	});
		//
		//
		//
		// }
		$scope.goedit = function (v) {
			//修改别名
			$scope.isedit = !$scope.isedit;
			$scope.data = v;
		};
		$scope.boxName = '';
		$scope.editConfirm = function () {
			if ($scope.boxName.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
				$.tipshow({
					'msg': '请输入别名',
					'type': 'warning'
				});
				return;
			}
			$http.post(webset.apiurl + "users/device/update.json?boxId=" + $scope.data.boxId + "&openId=" + $scope.openId + "&boxName=" + $scope.boxName, {}).success(function (res) {
				console.log('修改设备别名', res);
				$scope.boxName = '';
				$scope.isedit = false;
				if (res.responseHeader.code == 200) {
					$.tipshow({
						'msg': '修改设备别名成功',
						'type': 'success'
					});
					$scope.list = [];
					$scope.seting.pageNo = 1;
					$scope.getDeviceList();
				} else {
					$.tipshow({
						'msg': '修改设备别名失败',
						'type': 'warning'
					});
				}
			});
		}
		$scope.deletefcn = function () {
			$("#devicelist input:radio:checked").removeAttr("checked", 'checked');
			$("#devicelist input[type=checkbox]").removeAttr("checked");
			//			顶部删除
			$scope.deleteState = !$scope.deleteState;
			$scope.resetDel();
		}
		$scope.checkAll = function () {
			$scope.allSelect = !$scope.allSelect;
			if ($scope.allSelect) {
				$("#devicelist input[type='checkbox']").each(function () {
					$(this)[0].checked = true;
				})
			} else {
				$("#devicelist input[type='checkbox']").each(function () {
					$(this)[0].checked = false;
				})
			}
			$scope.dellen = $('#devicelist input:checkbox:checked').length;
		}
		$scope.deleteButton = function () {
			//			底部删除
			if ($('#devicelist input:checkbox:checked').length == 0) {
				$.tipshow({
					'msg': '请选择设备',
					'type': 'warning'
				});
				return;
			}
			$scope.deleteCommit = true;
		}
		$scope.deleteConfirm = function () {
			var liList = $('#devicelist input:checkbox:checked').parent().find('li');
			var l = liList.length ? liList.length : 0;
			var arr = [];
			var boxId;
			for (var i = 0; i < l; i++) {
				boxId = $(liList[i]).data('boxid');
				arr.push(boxId);
			}
			if (arr.length) {
				$scope.commitdel(arr.join(','));
			}
		}
		$scope.commitdel = function (boxid) {
			$http.post(webset.apiurl + "users/device/delete.json?openId=" + $scope.openId + "&boxId=" + boxid + '&cpid=' + '123', {}).success(function (res) {
				console.log('删除设备', res);
				$scope.resetstate();
				if (res.responseHeader.code != 200) {
					$.tipshow({
						'msg': '设备删除失败',
						'type': 'warning'
					});
				} else {
					$.tipshow({
						'msg': '设备删除成功',
						'type': 'success'
					});
					delCookie('boxId')
					delCookie('cpid')
					$scope.list = [];
					$scope.seting.pageNo = 1;
					$scope.getDeviceList(true);
				}
			}).error(function () {
				$scope.resetstate();
				$.tipshow({
					'msg': '设备删除失败',
					'type': 'warning'
				});
			});
		}

		$scope.changeButton = function (v) {
			$http.post(webset.apiurl + "users/getDevice.json?openId=" + $scope.openId + "&boxId=" + v.boxId + "&cpid=" + v.cpid, {}).success(function (res) {
				console.log('切换设备', res);
				if (res.responseHeader.code == 200) {
					$.tipshow({
						'msg': '切换设备成功',
						'type': 'success'
					});
					setCookie('boxId', v.boxId);
					setCookie('cpid', v.cpid);
					$scope.list = [];
					$scope.seting.pageNo = 1;
					$scope.getDeviceList(true);
				} else {
					$.tipshow({
						'msg': '切换设备失败',
						'type': 'warning'
					});
				}
			});
		}
		$scope.dellist = function (v) {
			var len = $scope.list.length,
				data = $scope.list;
			for (var i = len - 1; i >= 0; i--) {
				if (data[i].channelId == v.channelId && data[i].programName == v.programName && data[i].liveStartTime == v.liveStartTime) {
					$scope.list.splice(i, 1);
				}
			}
		}
		$scope.add_d = function () {
			// 扫一扫添加设备
			wx.scanQRCode({
				needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
				scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
				success: function (res) {
					var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
				}
			});
		}
		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			//			$scope.bs.setmax($('.html').height());
		});
	}
	return {
		controller: controller,
		tpl: tpl
	};
});