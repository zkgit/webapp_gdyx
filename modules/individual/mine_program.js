define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		$rootScope.htmlname = 'bgcffffff';
		document.title = '我的看单';
		$scope.openId = getCookie('openId');
		
		
		$scope.seting = {
			pageNo: 1,
			pageSize: 10,
			creat: false,
			col: false,
			creatnum: 0,
			colnum: 0,
			tindex: null, //展开的index
			tab: null,
			creatKan: $('#creatKan'),
			colKan: $('#colKan')
		}
		$scope.creatList = [];
		$scope.colList = [];

		$scope.bs = new botscroll(100, 85); // 滚动事件
		$scope.zhanList = function (v) {
			if (v == 'creat') {
				if ($scope.seting.tindex == 1 && $scope.elm) {
					$scope.elm.find("input[type='checkbox']").each(function () {
						$(this)[0].checked = false;
					})
					$scope.dellen = 0;
					$scope.allSelect = false;
				}
				$scope.seting.tindex = $scope.seting.tindex == 0 ? null : 0;
				$scope.seting.tab = 0;
				$scope.elm = $scope.seting.creatKan;
				if (!$scope.creatList.length) {
					$scope.creatList = $scope.firstcreatL;
				}
			} else if (v == 'col') {
				if ($scope.seting.tindex == 0 && $scope.elm) {
					$scope.elm.find("input[type='checkbox']").each(function () {
						$(this)[0].checked = false;
					})
					$scope.dellen = 0;
					$scope.allSelect = false;
				}
				$scope.seting.tindex = $scope.seting.tindex == 1 ? null : 1;
				$scope.seting.tab = 1;
				$scope.elm = $scope.seting.colKan;
				if (!$scope.colList.length) {
					$scope.colList = $scope.firstcoL;
				}
			}
		}
		$scope.getCreat = function (val) {
			//创建看单
			if (!$scope.seting.creat) {
				$http.post(webset.apiurl + "users/watchingform/list.json?token=" + '123' + "&cpid=" + '123'+ "&pageNo=" + $scope.seting.pageNo + '&pageSize=' + $scope.seting.pageSize, {}).success(function (e) {
					if (e && e.response.responseBody && e.response.responseBody.totalrecords && e.response.responseHeader.code == 200) {
						if (val == 2) {
							//删除后再获取总数
							$scope.seting.creatnum = e.response.responseBody.totalrecords;
							$scope.creatList = $scope.creatList.concat(e.response.responseBody.list);
						} else if (val == 'first') {
							//第一次算总数
							$scope.seting.creatnum = e.response.responseBody.totalrecords;
							$scope.firstcreatL = e.response.responseBody.list;
						} else {
							$scope.creatList = $scope.creatList.concat(e.response.responseBody.list);
						}
						$scope.bs.fisrt = true;
						$scope.bs.isc = true;
						if (e.response.responseBody.list.length == 10) {
							$scope.bs.isc = true;
						} else {
							$scope.bs.isc = false;
							$scope.seting.creat = true;
						}
					} else {
						$scope.seting.creatnum = 0;
					}
				});
			}
		}
		$scope.getCreat('first');
		$scope.getCol = function (val) {
			//收藏的看单
			if (!$scope.seting.col) {
				$http.post(webset.apiurl + 'users/collect/list.json?cpid=' + '123'+ '&type=2&token=' + '123' + '&pageNo=' + $scope.seting.pageNo + '&pageSize=15', {}).success(function (e) {
					if (e && e.response.responseBody && e.response.responseBody.totalrecords && e.response.responseHeader.code == 200) {
						if (val == 2) {
							$scope.seting.colnum = e.response.responseBody.totalrecords;
							$scope.colList = $scope.colList.concat(e.response.responseBody.list);
						} else if (val == 'first') {
							$scope.firstcoL = e.response.responseBody.list;
							$scope.seting.colnum = e.response.responseBody.totalrecords;
						} else {
							$scope.colList = $scope.colList.concat(e.response.responseBody.list);
						}
						$scope.bs.fisrt = true;
						$scope.bs.isc = true;
						if (e.response.responseBody.list.length == 10) {
							$scope.bs.isc = true;
						} else {
							$scope.bs.isc = false;
							$scope.seting.col = true;
						}
					} else {
						$scope.seting.colnum = 0;
					}
				});
			}
		}
		$scope.getCol('first');


		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent, element) {
			$scope.bs.setmax($('.html').height());

			var repeatId = element.parent().attr("repeat-id");
			switch (repeatId) {
				case "r1":
					$('#J_jmlist_time').scrollLeft(37 * $scope.rem)
					break;
				case "r2":
					var elms = $scope.elm.J_scroll_go;
					elms.scrollTop(0);
					var eq;
					if ($scope.backjson && $scope.backjson.index) {
						eq = $scope.backjson.index;
					} else {
						eq = parseInt(elms.find('.active').attr('eq'));
					}
					elms.scrollTop((eq - 3) * 35 * $scope.rem);
					break;
			}

		});

		$scope.bs.getbot = function () {
			$scope.bs.isc = false;
			$scope.seting.pageNo++;
			$scope.getCreat();
		}

		$scope.count = function () {
			$scope.dellen = $scope.elm.find('input:checkbox:checked').length;
			var num = $scope.elm.find("input[type='checkbox']").length;
			if ($scope.dellen == num) {
				$scope.allSelect = true;
			} else {
				$scope.allSelect = false;
			}
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
			if ($scope.seting.tindex == null) {
				if ($scope.seting.creatnum) {
					$scope.zhanList('creat');
				} else if ($scope.seting.colnum) {
					$scope.zhanList('col');
				}
			}

			$("input[type=checkbox]").removeAttr("checked");
			//			顶部删除
			$scope.deleteState = !$scope.deleteState;
			$scope.is_showEdit = false;
			$scope.dellen = 0;
			$scope.allSelect = false;
		}
		$scope.checkAll = function () {
			$scope.allSelect = !$scope.allSelect;
			if ($scope.allSelect) {
				$scope.elm.find("input[type='checkbox']").each(function () {
					$(this)[0].checked = true;
				})
			} else {
				$scope.elm.find("input[type='checkbox']").each(function () {
					$(this)[0].checked = false;
				})
			}
			$scope.dellen = $scope.elm.find('input:checkbox:checked').length;
		}
		$scope.deleteButton = function () {
			//			底部删除
			if (!$scope.dellen) {
				$.tipshow({
					'msg': '请选择节目',
					'type': 'warning'
				});
				return;
			}
			$scope.deleteCommit = true;
		}
		$scope.deleteConfirm = function () {
			var arr = [];
			var liList = $scope.elm.find('input:checkbox:checked');
			var len = liList.length ? liList.length : 0;
			for (var i = 0; i < len; i++) {
				arr.push($(liList[i]).data('id'));
			}
			$scope.commitdel(arr.join(','));
		}
		$scope.commitdel = function (ids) {
			var url;
			if ($scope.seting.tab == 1) {
				url = webset.apiurl + 'users/collect/delete.json?cpid=' + '123'+ '&token=' + '123' + '&id=' + ids + '&type=2'
			} else {
				url = webset.apiurl + 'users/watchingform/del.json?cpid=' + '123'+ '&token=' + '123' + '&id=' + ids
			}
			$http.post(url, {}).success(function (e) {
				$scope.resetstate();
				if (e.response.responseHeader.code == '200') {
					$.tipshow({
						'msg': '删除看单成功',
						'type': 'success'
					});
					$scope.seting.pageNo = 1;
					if ($scope.seting.tab == 1) {
						$scope.colList = [];
						$scope.seting.col = false;
						$scope.getCol(2);
					} else {
						$scope.creatList = [];
						$scope.seting.creat = false;
						$scope.getCreat(2);
					}
				} else {
					$.tipshow({
						'msg': '删除看单失败',
						'type': 'warning'
					});
				}
			})
		}
	}
	return {
		controller: controller,
		tpl: tpl
	};
});