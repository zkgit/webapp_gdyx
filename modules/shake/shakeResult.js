define(['angular','size', 'fun'], function(angular, tpl) {
	controller.$inject = ['$scope', '$http', '$rootScope'];

	function controller($scope, $http, $rootScope) {
		$scope._config = _modules_config;
		$scope.loading=true;
		$scope.rem = window.rem / 100;
		$scope.sc = GetRequest();
		$scope.elm = {
			// "J_dtpop": $('#J_dtpop'),
			// "J_fullintro": $('#J_fullintro'),
			// "J_dm_show": $('#J_dm_show'),
			// "J_details_b": $('#J_details_b'),
			"J_scroll_go": $('#J_scroll_go'),
			// "J_video": $('#J_video')
			"H_second_tr": $('#H_second_tr')
		};
		$rootScope.htmlname = 'shakeResult  pb10';
		
		$scope.sectype = ["正在播", "同步淘", "活动汇", "大家聊"];
		$scope.resultNum=0
		$scope.getsec = function(eq, v) {
			$scope.resultNum=eq;
			$scope.elm.H_second_tr.find('a').removeClass('active').eq(eq).addClass('active');
			$scope.list = [];
			$scope.getAjax(v);
		}
		$scope.issec = true;
		$scope.isdetail=true;
		$scope.bs = new botscroll(100, 85); // 滚动事件

		$scope.list = [];
		$scope.loadtext = '正在加载...···';
		$scope.getAjax = function(str) {
			var v;
			if (str == "正在直播") {
				v = 'fir';
			} else if (str == "同步淘") {
				v = 'sec';
			} else if (str == "活动汇") {
				v = 'thi';
			} else if (str == "大家聊") {
				v = 'fou';
			}
			var url = 'testJson/detail.txt?kankeId=';
			$scope.fadedmt = [];
			$scope.fadedmtnum = 0;
			$http.post(url, {}).success(function(e) {
				$scope.loading=false;
				console.log('节目详情', e);
				if(!e) {
					$scope.isdetail=false;
					return false;
				}
				$scope.isdetail=true;
//				if(_wxshare_on) {
//					//微信分享
//					var urltem = window.location.href;
//					wxshare.weixinshare_(e.title, e.lpic + '!m180x180.jpg', e.response.responseBody.description.substr(0, 26) + '···', urltem);
//				}

				$scope.detial = e.video;
				if($scope.detial.desc) {
					$scope.detial.shortdescription = $scope.detial.desc.substr(0, 80) + '···';
				}
			});
		}
		$scope.getAjax("电视剧");
		$scope.sc.englishName="shandong";
		$scope.isjmlist=false;
//
		//直播页面
		$scope.getjmlist = function() {
			$scope.sc.vid = '';
			$scope.sc.type = '';
			// appKey=D176EB3E8B1F044B&appScrect=64&channelType=shandong&date=2016-11-02
			var jmurl = webset.apiurl + 'epg/epgQuery.json?appKey=D176EB3E8B1F044B&appScrect=64&channelType=' + $scope.sc.englishName + '&date=' + $scope.dates;
			$http.post(jmurl, {}).success(function(e) {
				console.log('节目单', e.response);
				$scope.jmlist = e.response.responseBody;
				if($scope.jmlist.length){
					$scope.isjmlist=true;
				}
				var data = $scope.jmlist,
					gt = 0,
					len = $scope.jmlist.length,
					t = new Date(),
					tm = t.getTime(),
					tstr = $scope.dates.replace(/-/ig, '/');
				for(var i = 0; i < len; i++) {
					var nt = new Date(tstr + ' ' + data[i].startTime).getTime();
					if(t < nt) {
						gt = i - 1;
						$scope.activejson = data[gt];
						break;
					}
				}
				//新增start
				for(var i = 0; i < len; i++) {
					var nt = new Date(tstr + ' ' + data[i].startTime).getTime();
					if(t < nt) {
						data[i].order_active = true;
					}
				}
				var orderlistUrl = webset.apiurl + "user/userReserveInfo.json?openId=" + $scope.openId;
				$http.post(orderlistUrl, {}).success(function(e) {
					if(e && e.responseHeader.code == 200) {
						$scope.list = JSON.parse(e.responseBody);
						var list = $scope.list;
						for(var i = 0; i < len; i++) {
							var liveStartTime_i = $scope.dates + " " + data[i].startTime;
							var liveEndTime_i = $scope.dates + " " + data[i].endTime;
							var nt = new Date(tstr + ' ' + data[i].startTime).getTime();
							if(t < nt) {
								if(list != undefined && list != '' && list != null) {
									var orderInfo = 'liveStartTime=' + liveStartTime_i + '&liveEndTime=' + liveEndTime_i + '&channelId=test';
									for(j = 0; j < list.length; j++) {
										var orderInfo_j = 'liveStartTime=' + list[j].liveStartTime + '&liveEndTime=' + list[j].liveEndTime + '&channelId=test';
										if(orderInfo_j == orderInfo) {
											console.log('已预约节目', orderInfo);
											data[i].isorder = 1;
										}
									}
								}
							}
						}
					}
				});
				//新增end
				if($scope.jmtimeeq == 3) {
					data[gt].active = true;
					$scope.sc.vid = data[gt].videoId;
					$scope.sc.type = getvtype(data[gt].classId);
				}
			});
		}
		$scope.tabs = function(v) {
			$scope.istab = v;
			var elms = $scope.elm.J_scroll_go;
			var eq = parseInt(elms.find('.active').attr('eq'));
			elms.scrollTop((eq - 2) * 50 * $scope.rem)
		}
		$scope.jmtime = [];
		$scope.jmbacktime = [];
		$scope.jmtimeeq = 3;
		$scope.jmbacktimeeq = 6;
		var data = new Date(),
			str = '',
			wkarr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
			day = data.getDay();
		data.setDate(data.getDate() - 4);
		for(var i = 0; i < 7; i++) {
			data.setDate(data.getDate() + 1);
			var obj = {};
			obj.class = data.getDay() == day ? "active" : '';
			var ts = data.getFullYear() + '-' + (data.getMonth() + 1 < 10 ? ('0' + (data.getMonth() + 1)) : (data.getMonth() + 1)) + '-' + (data.getDate() >= 10 ? data.getDate() : ('0' + data.getDate()));
			obj.timestr = ts;
			obj.day = data.getDay() == day?'今日':wkarr[data.getDay()];
			$scope.jmtime.push(obj);
			if(data.getDay() == day) {
				$scope.dates = ts;
			}
		}
		/*var databack = new Date(),
			strback = '';
		databack.setDate(databack.getDate() - 7);
		for(var i = 0; i < 7; i++) {
			databack.setDate(databack.getDate() + 1);
			var obj = {};
			obj.class = databack.getDay() == day ? "active" : '';
			var ts = databack.getFullYear() + '-' + (databack.getMonth() + 1 < 10 ? ('0' + (databack.getMonth() + 1)) : (databack.getMonth() + 1)) + '-' + (databack.getDate() >= 10 ? databack.getDate() : ('0' + databack.getDate()));
			obj.timestr = ts;
			obj.day = (databack.getMonth() + 1 < 10 ? ('0' + (databack.getMonth() + 1)) : (databack.getMonth() + 1)) + '-' + (databack.getDate() >= 10 ? databack.getDate() : ('0' + databack.getDate()));
			$scope.jmbacktime.push(obj);
			if(databack.getDay() == day) {
				$scope.dates = ts;
			}
		}*/
		$scope.elm.J_scroll_go.css('height', window.innerHeight - 3.1 * window.rem);
		$scope.changeday = function(eq, timestr) {
			$scope.dates = timestr;
			$scope.jmtimeeq = parseInt(eq);
			$scope.getjmlist();
		}
		$scope.changedayback = function(eq, timestr) {
			$scope.dates = timestr;
			$scope.jmbacktimeeq = parseInt(eq);
			$scope.getjmlistback();
		}
		$scope.getjmlist(); //直播节目单初始化
		$scope.addhistory = function() {
			if(!$scope.detail) {
				return false;
			}
			var behaviorJson = {
				channelId: $scope.sc.englishName,
				en_name: $scope.sc.englishName,
				zh_name: $scope.sc.chaneseName,
				icon: $scope.activejson.icon2
			}
			urlscy = webset.apiurl + 'user/saveUsualChannel.json?appKey=D176EB3E8B1F044B&appScrect=64&behaviorType=usualChannel&token=' + '123' + '&behaviorJson=' + JSON.stringify(behaviorJson);
			$http.post(urlscy, {}).success(function(e) {
				console.log('添加常看频道', e);
			});
		}
		//
		$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
			$scope.bs.setmax($('.html').height());
			
			var elms = $scope.elm.J_scroll_go;
			elms.scrollTop(0);
			var eq = parseInt(elms.find('.active').attr('eq'));
			elms.scrollTop((eq - 2) * 50 * $scope.rem+16*$scope.rem)
		});
	}
	return {
		controller: controller,
		tpl: tpl
	};
});