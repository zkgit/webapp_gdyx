define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		var h = $(window).height() - $("#search_bar").height() * 1.47;
		$("#search_show").css('height', h);
		$("#container").focus();
		$('#search_input').focus();
		var $weuiSearchBar = $('#search_bar');
		$weuiSearchBar.addClass('weui_search_focusing');
		$scope.classarr = {
			'live': '',
			'vod': 0,
			'back': ''
		};
		$scope.typeJson = {
			'anime': '综艺',
			'tv': '电视剧',
			'film': '电影',
			'documentary': '纪录片'
		};
		$scope.seting = {
			"pageNo": 1,
			"pageSize": 15,
			"region": "",
			"tag": "",
			"year": "",
			"columnType": "",
			"key": ""
		};


		$scope.chooseli=function(vv,index,key){
			$scope.choosejson[key].index=index;
			$scope.seting[key]=index==0?'':vv;
			$scope.seting.pageNo = 1;
			$scope.list = [];
			$scope.loadtext = '正在加载...';
			$scope.getajax();
		}

		$scope.searchtype = 'vod'; //视频里的直播
		
		$scope.openId = getCookie('openId');
		$scope.boxId = getCookie('boxId');
		
		$scope.sc = GetRequest();
		
		$scope.type = $scope.sc.type ? $scope.sc.type : 'vod';
		// $scope.search_text_on = true; //搜索
		// .on('blur', '#search_input', function() {
		// 		if($(this).val()) {
		// 			$scope.search_text_on = false;
		// 		} else {
		// 			$scope.search_text_on = true;
		// 		}
		// 	})
		$scope.openId = getCookie('openId');
		$scope.search_on = false; //搜索联想词
		$scope.search_btn = false; //搜索按钮
		$scope.search_can = true; //显示取消按钮
		$('#container').on('focus', '#search_input', function () {
			var $weuiSearchBar = $('#search_bar');
			$weuiSearchBar.addClass('weui_search_focusing');
			$scope.search_btn = true; //显示搜索按钮
			$scope.search_can = false; //隐藏取消按钮
		}).on('input', '#search_input', function () {
			var $searchShow = $("#search_show");
			if ($(this).val()) {
				$scope.search_can = false; //隐藏取消按钮
				$scope.search_on = true;
				$scope.search_btn = true; //显示搜索按钮
			} else {
				$scope.search_on = false;
				$scope.search_can = true; //显示取消按钮
				$scope.search_btn = false; //隐藏搜索按钮
			}
		}).on('touchend', '#search_cancel', function () {
			$scope.search_on = false;
			$scope.keyword = '';
		}).on('touchend', '#search_clear', function () {
			$scope.isresult = false;
			$scope.search_on = false;
			$scope.keyword = '';
			$scope.search_btn = false; //隐藏搜索按钮
			$scope.search_can = true; //显示取消按钮
		});
		$scope.search_clear = function () {
			$scope.istype = 0;
			$scope.isresult = false;
			$scope.search_on = false;
			$scope.keyword = '';
		};
		$scope.textlist = [];
		$scope.typelist = {};
		$scope.choosejson={};
		$scope.loadtext = "正在加载···";
		$scope.list = [];
		$scope.isshowclass = false;

		$scope.change_class = function (v) {
			$scope.type = v;
			$scope.list = [];
			$scope.seting.pageNo = 1;
			$scope.getajax();
			setTimeout(function () {
				$scope.isshowclass = false;
				$scope.$apply();
			}, 100)
		}
		//热搜推荐
		$http.get(webset.apiurl + 'search/getHotVideo.json', {}).success(function (res) {
			console.log('搜索推荐', res.response.responseBody);
			$scope.typelist = res.response.responseBody;
		})

		$http.get(webset.apiurl + 'vodHome/column/category.json?type=all', {}).success(function (res) {
			let category = res.response.responseBody;
			
			for(let key in category){
				$scope.choosejson[key]={};
				$scope.choosejson[key].index=0;
				$scope.choosejson[key].data=category[key];
			}
			console.log('category', category)
		});

		$scope.pusharr = function (obj, v) {
			if ($scope.typelist[obj] == undefined) {
				$scope.typelist[obj] = [];
			}
			if ($scope.typelist[obj].length < 3) {
				$scope.typelist[obj].push(v)
			}
		};
		$scope.isc = true;
		$scope.getajax = function () {
			$scope.isc=true;
			var searchUrl=webset.apiurl + 'search/searchLiveAndDemand.json?key=' + $scope.seting.key + '&pageNo=' + $scope.seting.pageNo + '&pageSize=15';
			if ($scope.searchtype == 'vod'){
				searchUrl += '&type=1&tag='+$scope.seting.tag+'&region=' + $scope.seting.region + '&year=' + $scope.seting.year;
			} else {
				searchUrl +='&type=2&way='+($scope.searchtype=='live'?0:1);
			}
			$http.get(searchUrl, {}).success(function (res) {
				console.log($scope.seting.key + '关键字' + $scope.type + '搜索结果:', res)
				if (res.response.responseHeader.code == "200") {
					var list = [];
					if ($scope.type == 'apply') {
						list = res.response.responseBody.APP.LIST;
					} else {
						list = res.response.responseBody.list;
						/*
						* var data=$scope.list;
						 var orderlistUrl = webset.apiurl + "user/userReserveInfo.json?openId=" + $scope.openId;
						 $http.post(orderlistUrl, {}).success(function(e) {
						 if(e && e.response.responseHeader.code == 200) {
						 $scope.userList = e.response.responseBody;
						 var list = $scope.userList,
						 len=data.length;
						 for(var i = 0; i < len; i++) {
						 var lenChild = data[i].epglist.length;
						 for(var k= 0; k<lenChild ;k++){
						 var dataChild = data[i].epglist;
						 var liveStartTime_i = dataChild[k].date + " " + dataChild[k].beginTime;
						 var liveEndTime_i = dataChild[k].date + " " + dataChild[k].endTime;
						 if(list != undefined && list != '' && list != null) {
						 var orderInfo = 'liveStartTime=' + liveStartTime_i + '&liveEndTime=' + liveEndTime_i + '&channelId='+data[i].channelId;
						 for(j = 0; j < list.length; j++) {
						 var orderInfo_j = 'liveStartTime=' + list[j].liveStartTime + '&liveEndTime=' + list[j].liveEndTime + '&channelId='+list[j].channelId;
						 if(orderInfo_j == orderInfo) {
						 console.log('已预约节目', orderInfo);
						 dataChild[k].isorder = true;
						 }
						 }
						 }
						 }
						 }
						 }
						 });*/
					}
					$scope.list = $scope.list.concat(list);


					if (list.length == 15) {
						$scope.isc = false;
						$scope.seting.pageNo++;
					} else {

						$scope.loadtext = '无更多内容';
					}
				} else {
					$scope.list = '';
					$scope.loadtext = "暂无数据";
				}

			});
		}


		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {

		});
		$scope.$on("$destroy", function () {

		})
		$scope.isresult = false;
		$scope.searchsub = function (v) {
			$scope.search_on = false;
			if ($scope.keyword == undefined || $scope.keyword.length == 0) {
				$('#toast').show();
				setTimeout(function () {
					$('#toast').hide();
				}, 2000);
				return false;
			}
			$scope.searchtype = v ? v : 'vod';
			$scope._text = $scope.keyword.replace(/\s/ig, '');
			$scope.setlocal($scope._text);
			$scope.seting.key = $scope._text;
			$scope.isresult = true;
			$scope.list = [];
			$scope.sccol(0, '');
		};
		$scope.searchtypefcn = function (i) {};
		$scope.keysearch = function (v) {
			$('#search_input').focus();
			$scope.search_on = false;
			$scope.textlist = [];
			$scope.loadtext = "正在加载···";
			$scope.seting.key = v;
			$scope.keyword = v;
			$scope.isresult = true;
			$scope.sccol(0, '');
		}

		$scope.setlocal = function (v) {
			var str = window.localStorage.getItem('hissearch'),
				isin = false,
				strarr = [];
			if (str) {
				str != null ? strarr = str.split(',') : '';
				for (var i = 0; i < 6; i++) {
					if (v == strarr[i]) {
						isin = true;
					}
				}
				if (!isin) {
					if (strarr.length) {
						str = v + ',' + strarr.join(',').substr(0, 200);
					}
				}
			} else {
				str = v;
			}
			window.localStorage.setItem('hissearch', str);
		}

		$scope.keyhistory = window.localStorage.getItem('hissearch') ? window.localStorage.getItem('hissearch').split(',').slice(0, 6) : [];

		if ($scope.keyhistory.length == 0) {
			$scope.nohis = true;
		}
		$scope.nohistory = function () {
			$scope.keyhistory = [];
			$scope.nohis = true;
			$scope.clearCommit = false;
			window.localStorage.setItem('hissearch', '');
		}
		$scope.timeoutid;

		// 检测关键字
		$scope.keylen = function (v) {
			if ($scope.type == 'apply') {
				return false;
			}
			if ($scope.keyword) {
				$scope.search_on = true;
				//联想结果
				$http.get(webset.apiurl + 'search/searchWordAssociate.json?pageNo=1&pageSize=15&key=' + $scope.keyword.replace(/\s/ig, ''), {}).success(function (res) {
					console.log($scope.keyword + '联想结果：', res);
					$scope.textlist = res.response.responseBody;
				});
			} else {
				$scope.search_on = false;
				$scope.isresult = false;
			}
		};

		$scope.typearr = [{
			"k": "全部",
			"v": ""
		}, {
			"k": "电影",
			"v": "film"
		}, {
			"k": "电视剧",
			"v": "tv"
		}, {
			"k": "动漫",
			"v": "anime"
		}, {
			"k": "综艺",
			"v": "arts"
		}, {
			"k": "纪录片",
			"v": "documentary"
		}];
		$scope.istype = 0;

		$scope.sccol = function (eq, v) {
			$scope.list = [];
			$scope.istype = eq;
			$scope.seting.pageNo = 1;
			$scope.seting.columnType = v;
			$scope.loadtext = "正在加载···";
			$scope.getajax();
		}
		$(document).keydown(
			function (e) {
				if (e.keyCode == 13) {
					//enter回车搜索
					$scope.searchsub();
				}
			}
		);

		$scope.ordertv = function (data, index, _parent) {
			var startTime, endTime, chaneseName, englishName, title, icon, columnType, videoId;
			startTime = data.epglist[index].beginTime;
			endTime = data.epglist[index].endTime;
			chaneseName = data.zh_name;
			englishName = data.en_name;
			title = data.epglist[index].playTitle;
			icon = data.icon;
			channelId = data.channelId;
			kankeId = data.epglist[index].kankeId;
			vodId = '';
			frequence = data.epglist[index].channelTid;
			tsid = data.epglist[index].channelSid.split('_')[1];
			columnType = data.epglist[index].kankeId.split('_')[0];
			var liveStartTime = data.epglist[index].date + " " + startTime;
			var liveEndTime = data.epglist[index].date + " " + endTime;
			var orderUrl = webset.base + "tran?DEEPURL=";
			orderUrl += testapiServerBase + 'version-api/api/v1/user/reserveLive.json?liveStartTime=' + liveStartTime + '&liveEndTime=' + liveEndTime + '&openId=' + $scope.openId + '&channelId=' + channelId + '&channelNameZh=' + encodeURI(chaneseName) + '&channelNameEn=' + englishName + '&programName=' + encodeURI(title) + '&isReserve=1&channelPicUrl=' + icon + '&vodId=' + vodId + '&videoId=' + vodId + '&kankeId=' + kankeId + '&tsid=' + tsid + '&SERVICEID=' + channelId + '&frequence=' + frequence + '&columnType=' + columnType;;
			$http.get(orderUrl, {}).success(function (e) {
				if (e && e.response.responseHeader.code == 200) {
					$scope.list[_parent].epglist[index].isorder = true;
					$.tipshow({
						'msg': '预约成功',
						'type': 'success'
					});
				} else {
					$.tipshow({
						'msg': '预约失败',
						'type': 'warning'
					});
				}
			});
		}
		$scope.afterTim = function (strattime) {
			var st = new Date(strattime.replace(/-/ig, '/')).getTime(),
				nt = new Date().getTime();
			// et = new Date(time.replace(/-/ig, '/')).getTime();
			if (st >= nt) {
				return true;
			} else {
				return false;
			}
		}
		$scope.playApp = function (v) {
			$http.post(webset.base + 'random/sendAppRemoteMsg?packageName=' + v.PACKAGENAME + '&keyword=' + v.CONTENTNAME + '&tyOpenId=' + '123' + '&openId=' + $scope.openId + '&boxId=' + $scope.boxId, {}).success(function (res) {
				if (res.result == 0) {
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
		}
		$scope.addhistory = function (v, type) {
			//增加首页推荐添加历史的标识---&recommend=1；
			if (type == 'zb') {
				urlscy = webset.apiurl + 'users/history/save.json?cpid=' + '123'+ '&channelId=' + $scope.sc.channelID + '&token=' + '123' + '&recommend=' + ($scope.sc.recommend ? 1 : 0)
			} else {
				if (!v) {
					return false;
				}
				urlscy = webset.apiurl + 'users/history/save.json?cpid=' + '123'+ '&id=' + v.id + '&code=' + v.playCode + '&token=' + '123' + '&recommend=0'
			}
			$http.post(urlscy, {}).success(function (e) {});
		};

		$scope.playLive = function (channelId) {
			var senturl = webset.base + 'random/sendVideoRemoteMsg?playAction=channel&playId=' + channelId + '&tyOpenId=' + '123' + '&openId=' + $scope.openId + '&boxId=' + $scope.boxId;
			$scope.addhistory(channelId, 'zb');
			$http.post(senturl, {}).success(function (res) {
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
		}
		
		
		$scope.playtv = function (cvp, v) {
			if (cvp == 'zb') {
				// var playId = $scope.jmlist[$scope.gt].channelId;
				// var senturl = webset.base + 'random/sendVideoRemoteMsg?playAction=channel&playId=' + playId + '&tyOpenId=' + '123' + '&openId=' + $scope.openId + '&boxId=' + $scope.boxId;
				var senturl = webset.base + 'random/sendVideoRemoteMsg?type=1&channelId=' + v.channelID + '&openId=' + $scope.openId + '&boxId=' + $scope.boxId;
				$http.post(senturl, {}).success(function (res) {
					$scope.addhistory(v);
					if (res && res.result == "0") {
						$.tipshow({
							'msg': '推送成功',
							'type': 'success'
						})
					} else {
						$.tipshow({
							'msg': '推送失败',
							'type': 'warning'
						})
					}
				})
			} else if (cvp == 'back') {
				// var playId = encodeURIComponent(v.channelId + '|' + v.playDate + v.startTime + ':00|' + v.playDate + v.endTime) + ':00';
				var senturl = webset.base + 'random/sendVideoRemoteMsg?type=3&channelId=' + v.channelID+'&openId=' + $scope.openId + '&boxId=' + $scope.boxId+'&startTime='+v.startTime+'&endTime='+v.endTime;
				$http.post(senturl, {}).success(function (res) {
					$scope.addhistory(v);
					if (res && res.result == "0") {
						$.tipshow({
							'msg': '推送成功',
							'type': 'success'
						})
					} else {
						$.tipshow({
							'msg': '推送失败',
							'type': 'warning'
						})
					}
				});
			} else if(cvp == 'db'){
				var urlpv = webset.base;
				urlpv += 'random/sendVideoRemoteMsg?type=2&assetId='+v.playCode+'&providerId=' + v.cpCode + '&openId=' + $scope.openId + '&boxId=' + $scope.boxId;
				$http.post(urlpv, {}).success(function (res) {
					$scope.addhistory(v);
					if (res && res.result == "0") {
						$.tipshow({
							'msg': '推送成功,若实际投屏失败，请点击右上方“投屏失败”反馈',
							'type': 'success',
							'lineheight': true
						});
					} else {
						$.tipshow({
							'msg': '推送失败,请点击右上方“投屏失败”反馈',
							'type': 'warning',
							'lineheight': true
						});
					}
				});
			}
		}
		// $scope.playtv = function (v) {
		// 	$http.post(webset.base + 'random/sendVideoRemoteMsg?playAction=vod&playId=' + v.playCode + '&tyOpenId=' + '123' + '&openId=' + $scope.openId + '&boxId=' + $scope.boxId, {}).success(function (res) {
		// 		$scope.addhistory(v, 'db')
		// 		if (res && res.result == "0") {
		// 			console.log('电视已推送，播放:成功');
		// 			$.tipshow({
		// 				'msg': '推送成功',
		// 				'type': 'success'
		// 			});
		// 		} else {
		// 			console.log('电视已推送，播放:失败');
		// 			$.tipshow({
		// 				'msg': '推送失败',
		// 				'type': 'warning'
		// 			});
		// 		}
		// 	});
        //
		// }

	}
	return {
		controller: controller,
		tpl: tpl
	};
});