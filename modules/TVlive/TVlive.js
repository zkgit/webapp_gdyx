define(['angular', 'wxshare', 'size', 'fun', 'slide'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http', '$location', '$anchorScroll'];

	function controller($scope, $rootScope, $http, $location, $anchorScroll) {
		$rootScope.htmlname = 'pglist pb60';
		$scope.rem = window.rem / 100;
		// function overscroll(el) {
		// 	el.addEventListener('touchstart', function () {
		// 		var top = el.scrollTop,
		// 			totalScroll = el.scrollHeight,
		// 			currentScroll = top + el.offsetHeight
		// 		//If we're at the top or the bottom of the containers
		// 		//scroll, push up or down one pixel.
		// 		//
		// 		//this prevents the scroll from "passing through" to
		// 		//the body.
		// 		if (top === 0) {
		// 			el.scrollTop = 1
		// 		} else if (currentScroll === totalScroll) {
		// 			el.scrollTop = top - 1
		// 		}
		// 	})
		// 	el.addEventListener('touchmove', function (evt) {
		// 		//if the content is actually scrollable, i.e. the content is long enough
		// 		//that scrolling can occur
		// 		if (el.offsetHeight < el.scrollHeight)
		// 			evt._isScroller = true
		// 	})
		// }
		// overscroll(document.querySelector('#lit_scroll'));
		// overscroll(document.querySelector('#left_scroll'));
		// document.body.addEventListener('touchmove', function (evt) {
		// 	//In this case, the default behavior is scrolling the body, which
		// 	//would result in an overflow.  Since we don't want that, we preventDefault.
		// 	if (!evt._isScroller) {
		// 		evt.preventDefault()
		// 	}
		// })
		//天翼帐号
		
		$scope.openId = getCookie('openId');
		$scope.boxId = getCookie('boxId');
		
		
		$scope.week = function () {
			$scope.jmtime = [];
			var data = new Date(),
				str = '',
				wkarr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
				day = data.getDay();
			data.setDate(data.getDate() - 7);
			for (var i = 0; i < 7; i++) {
				data.setDate(data.getDate() + 1);
				var obj = {};
				obj.class = data.getDay() == day ? "active" : '';
				var ts = (data.getMonth() + 1 < 10 ? ('0' + (data.getMonth() + 1)) : (data.getMonth() + 1)) + '-' + (data.getDate() >= 10 ? data.getDate() : ('0' + data.getDate()));
				obj.timestr = ts;
				obj.day = wkarr[data.getDay()];
				obj.data = data.getFullYear() +'-'+ts;
				$scope.jmtime.unshift(obj)
			}
			console.info($scope.jmtime)
		};
		$scope.week();

		$scope.elm = {
			"tody_scroll": $('#tody_scroll'),
			'weui_lefttab_bd': $('.weui_lefttab_bd'),
			'J_second': $('#J_second')
		};
		$scope.elm.tody_scroll.css('height', window.innerHeight - window.rem * 1.9);
		$scope.elm.weui_lefttab_bd.css('height', window.innerHeight - window.rem * 1.76);
		$('#J_second').on('click', '.tab', function () {
			var self = $(this);
			console.info(self)
			self.addClass('tab-active');
			self.siblings().removeClass('tab-active');
		});

		$scope.seting = {
			"pageNo": 1,
			"pageSize": 5,
			'type': '',
			'data': $scope.jmtime[0].data,
			'channelId': ''
		};
		$http.post(webset.apiurl + 'epg/liveCate.json?cpid=' + '123', {}).success(function (res) {
			$scope.cate = res.response.responseBody;
			$scope.seting.type = $scope.cate[0].channel_en;
			$scope.tab_type($scope.cate[0].channel_en);
		});
		$scope.tab_type = function (type) {
			$scope.week();
			$scope.tb = [];
			$scope.list = [];
			$scope.seting.type = type;
			$http.post(webset.apiurl + 'epg/liveEpg.json?date=' + $scope.jmtime[0].data + '&channelId=&type=' + $scope.seting.type + '&pageNo=' + $scope.seting.pageNo + '&pageSize=' + $scope.seting.pageSize + '&scope=0', {}).success(function (res) {
				$scope.tb = res.response.responseBody.list;
				if ((res.response.responseHeader.code == 200) && res.response.responseBody.channels && res.response.responseBody.channels.length) {
					$scope.list = res.response.responseBody.channels;
					//处理预约
					var data = $scope.list;
					//已经预约状态
					var orderlistUrl = webset.apiurl + 'users/userReserveInfo.json?type=1&cpid=' + '123'+ '&openId=' + $scope.openId;
					$http.post(orderlistUrl, {}).success(function (e) {
						if (e && e.response.responseHeader.code == '200') {
							var list = e.response.responseBody;
							for (var i = 0; i < data.length; i++) {
								if (list != undefined && list != '' && list != null) {
									var orderInfo = data[i].channelId + data[i].startTime;
									for (j = 0; j < list.length; j++) {
										var newInfo = list[j].channelId + list[j].startTime;

										if (newInfo == orderInfo) {
											data[i].isorder = true;
										}
									}
								}
							}
						}
					});
				} else {
					$scope.isshow_default = true;
				}
			});
		};
		$scope.change_time = function (data) {
			$scope.tb = [];
			$scope.list = [];
			$scope.seting.data = data;
			$scope.isshow_default = false;
			$http.post(webset.apiurl + 'epg/liveEpg.json?cpid=' + '123'+ '&date=' + $scope.seting.data + '&channelId=&type=' + $scope.seting.type + '&pageNo=1&pageSize=100&scope=0', {}).success(function (res) {
				$scope.tb = res.response.responseBody.list;
				if ((res.response.responseHeader.code == 200) && res.response.responseBody.channels && res.response.responseBody.channels.length) {
					$scope.list = res.response.responseBody.channels;
					//处理预约
					var data = $scope.list;
					//已经预约状态
					var orderlistUrl = webset.apiurl + 'users/userReserveInfo.json?type=1&cpid=' + '123'+ '&openId=' + $scope.openId;
					$http.post(orderlistUrl, {}).success(function (e) {
						if (e && e.response.responseHeader.code == '200') {
							var list = e.response.responseBody;
							for (var i = 0; i < data.length; i++) {
								if (list != undefined && list != '' && list != null) {
									var orderInfo = data[i].channelId + data[i].startTime;
									for (j = 0; j < list.length; j++) {
										var newInfo = list[j].channelId + list[j].startTime;
										if (newInfo == orderInfo) {
											data[i].isorder = true;
										}
									}
								}
							}
						}
					});
				} else {
					$scope.isshow_default = true;
				}
			});
		};
		$scope.changetb = function (v) {
			$scope.list = [];
			$scope.seting.channelId = v;
			$scope.isshow_default = false;
			$http.post(webset.apiurl + 'epg/liveEpg.json?cpid=' + '123'+ '&date=' + $scope.seting.data + '&channelId=' + $scope.seting.channelId + '&type=' + $scope.seting.type + '&pageNo=1&pageSize=100&scope=1', {}).success(function (res) {
				if ((res.response.responseHeader.code == 200) && res.response.responseBody && res.response.responseBody.list.length) {
					$scope.list = res.response.responseBody.list;
					//处理预约
					var data = $scope.list;
					//已经预约状态
					var orderlistUrl = webset.apiurl + 'users/userReserveInfo.json?type=1&cpid=' + '123'+ '&openId=' + $scope.openId;
					$http.post(orderlistUrl, {}).success(function (e) {
						if (e && e.response.responseHeader.code == '200') {
							var list = e.response.responseBody;
							for (var i = 0; i < data.length; i++) {
								if (list != undefined && list != '' && list != null) {
									var orderInfo = data[i].channelId + data[i].startTime;
									for (j = 0; j < list.length; j++) {
										var newInfo = list[j].channelId + list[j].startTime;
										if (newInfo == orderInfo) {
											data[i].isorder = true;
										}
									}
								}
							}
						}
					});
				} else {
					$scope.isshow_default = true;
				}
			}).error(function () {
				$scope.isshow_default = true;
			});
		};
		$scope.addhistory = function (channelId) {
			var urlscy = webset.apiurl + 'users/history/save.json?cpid=' + '123'+ '&channelId=' + channelId + '&token=' + '123' + '&recommend=0'
			$http.post(urlscy, {}).success(function (e) {

			});
		};
		// 电视推送并添加历史记录
		$scope.gotoplay = function (data) {
			switch (data.flag){
				case '0':				
					var dateStr = (data.date).replace(/-/g,'');				
					var startTimeStr = dateStr+(data.startTime).replace(':','')+'00';	
				    var endTimeStr = dateStr+(data.endTime).replace(':','')+'00';				    
					$http.post(webset.base + 'random/sendVideoRemoteMsg?type=3&channelId='+data.channelId+ '&openId='+ $scope.openId + '&boxId=' + $scope.boxId+'&startTime='+startTimeStr+'&endTime='+endTimeStr, {}).success(function (res) {
						$scope.addhistory(data.channelId);
						if (res && res.result == "0") {
							$.tipshow({
								'msg': '推送成功',
								'type': 'success'
							});
						} else {
							$.tipshow({
								'msg': '推送失败',
								'type': 'warning'
							});
						}
					});
					break;
				case '1':
					var playId = data.channelId;
					$http.post(webset.base + 'random/sendVideoRemoteMsg?type=1&channelId=' +data.channelId+'&openId=' + $scope.openId + '&boxId=' + $scope.boxId, {}).success(function (res) {
						$scope.addhistory(data.channelId)
						if (res && res.result == "0") {
							$.tipshow({
								'msg': '推送成功',
								'type': 'success'
							});
						} else {
							$.tipshow({
								'msg': '推送失败',
								'type': 'warning'
							});
						}
					});
					break;
				case '2':
					var reserve = encodeURIComponent(angular.toJson(data)),
						orderUrl = webset.apiurl + 'users/myLiveReserve.json?isReserve=' + (data.isorder ? 0 : 1) + '&openId=' + $scope.openId + '&methodType=POST&reserve='+encodeURI('[' + reserve + ']');
					$http.post(orderUrl, {}).success(function (e) {
						var msg = data.isorder ? '取消预约' : '预约';
						if (e.response.responseHeader.code == 200) {
							data.isorder = !data.isorder;
							$.tipshow({
								'msg': msg + '成功',
								'type': 'success'
							});
						} else {
							$.tipshow({
								'msg': msg + '失败',
								'type': 'warning'
							});
						}
					});
					break;
			}
		};

		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent, element) {
			var repeatId = element.attr("repeat-id");
			switch (repeatId) {
				case "r1":
					//台标列表
					break;
				case "r2":
					var elms = $('#lit_scroll');
					var eq = parseInt(elms.find('.item_live').attr('eq'));
					eq = eq - 3
					$location.hash('hash' + eq + '0')
					$anchorScroll();
					$('body').scrollTop = 0
					break;
			}
		});

	}
	return {
		controller: controller,
		tpl: tpl
	};
});

function scanQRCode(a) {
	return a
}