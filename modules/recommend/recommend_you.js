define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		$rootScope.htmlname = 'pglist  pb60';
		
		$scope.sc = GetRequest();
		$scope.pinyinCity = getCookie('pinyinCity');
		$scope.seting = {
			"pageNo": 1,
			"pageSize": 15,
			"_coltype": "",
			"source": "",
			"type": "",
			"year": "",
			"region": "",
			"_tags": "",
			"datasec": true,
			"_json": {
				"film": ["为您推荐", "电影", "电视剧", "综艺", "动漫", "纪录片"],
				"tv": ["热门播放", "内地剧场", "香港TVB", "偶像台剧", "热播美剧", "日剧集锦", "时尚韩风", "风情泰剧"],
				"arts": ["热门播放", "真人秀", "脱口秀", "内地专区", "港台专区", "海外专区"],
				"anime": ["热门播放", "国产专区", "日韩专区", "欧美专区"],
				"documentary": ["热门播放", "探索发现", "军事风云", "人物传奇", "社会观察", "历史文化"]
			}
		};

		$scope.elm = {
			"J_second_tr": $('#J_second_tr')
		};


		$scope.sectype = [{
			"name": "为你推荐",
			"id": "mix"
		}, {
			"name": "电影",
			"id": "film"
		}, {
			"name": "电视剧",
			"id": "tv"
		}, {
			"name": "综艺",
			"id": "arts"
		}];
		// , {
		// 		"name": "动漫",
		// 			"id": "anime"
		// 	}, {
		// 		"name": "纪录片",
		// 			"id": "documentary"
		// 	}
		$scope.issec = true;
		$scope.columnType = "mix";
		$scope.mix = [];
		$scope.bs = new botscroll(100, 85); // 滚动事件

		$scope.rec_index = 0;
		$scope.getsec = function (eq, ids) {
			$scope.mix = [];
			$scope.columnType = ids;
			$scope.rec_index = eq;
			$scope.elm.J_second_tr.find('a').removeClass('active').eq(eq).addClass('active');
			$scope.datalist = [];
			$scope.seting.pageNo = 1;
			//			$scope.seting._tags = v;
			//			$scope.seting.pageNo = 1;
			//			$scope.seting.datasec = true;
			$scope.getAjax(eq, ids);
		}


		$scope.getAjax = function (eq, ids) {
			if (ids == "mix") {
				$http.post(webset.apiurl + 'vod/myvideo.json?token=' + '123' + '&dtid=' + $scope.pinyinCity + '&pageNo=' + $scope.seting.pageNo + '&pageSize=15&index=1&appKey=34DB874AF269B539&appScrect=40', {}).success(function (res) {
					console.log('为你推荐', res);
					$scope.mix = $scope.mix.concat(res.response.responseBody[0].list);
					$scope.bs.fisrt = true;
					$scope.bs.isc = true;
					if (res.response.responseBody[0].totalPage != $scope.seting.pageNo) {
						$scope.bs.isc = true;
					} else {
						$scope.bs.isc = false;
						$scope.loadtext = '无更多内容';
					}
				});
			} else {
				$scope.bs.isc = false;
				var ituUrl = webset.apiurl + 'vod/mytypetag.json?token=' + '123' + '&dtid=' + $scope.pinyinCity + '&pageSize=6&pageNo=1&type=' + ids;
				$http.post(ituUrl, {}).success(function (res) {
					console.log('为你推荐分类', res);
					if (res.response.responseBody[0]) {
						$scope.datalist = res.response.responseBody[0];
						var obj = $scope.datalist;
						// var objkeys = [];
						// for(objkeys[objkeys.length] in obj);
						// //以上将obj的键名存放到了数组objkeys 中。
						// //遍历输出键值对
						$scope.keyList = [];
						$scope.valueList = [];
						for (var key in obj) {
							$scope.keyList.push(key)
						}
						for (var key in obj) {
							$scope.valueList.push(obj[key]);
						}
					}
				});
			}
		}
		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			$scope.bs.setmax($('.html').height());

		});

		$scope.getAjax(0, 'mix');

		$scope.bs.getbot = function () {
			$scope.bs.isc = false;
			$scope.seting.pageNo++;
			$scope.getAjax(0, 'mix');
		}

		$scope.$on("$destroy", function () {
			$scope.bs.isc = false;
		})
	}
	return {
		controller: controller,
		tpl: tpl
	};
});