define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		$rootScope.htmlname = 'pglist  pb60';

		$scope.sc = GetRequest();

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
				"film": ["热门播放", "院线大片", "好莱坞大片", "动画大片", "华语专区", "欧美专区", "日韩专区"],
				"tv": ["热门播放", "内地剧场", "香港TVB", "偶像台剧", "热播美剧", "日剧集锦", "时尚韩风", "风情泰剧"],
				"arts": ["热门播放", "真人秀", "脱口秀", "内地专区", "港台专区", "海外专区"],
				"anime": ["热门播放", "国产专区", "日韩专区", "欧美专区"],
				"documentary": ["热门播放", "探索发现", "军事风云", "人物传奇", "社会观察", "历史文化"]
			}
		};

		$scope.elm = {
			"J_second_tr": $('#J_second_tr'),
			"J_cdlist": $('#J_cdlist')
		};
		$scope.list = [];

		$scope.toptil = $scope.sc.t ? ['我的直播', '为您推荐', '奇幻 科技', '幽默 搞笑', '言情 偶像', '家庭 伦理', '韩剧', '好莱坞', '院线', '动画电影', 'TVB', '脱口秀', '探索发现', '真人秀'][$scope.sc.t] : '参数获取失败'

		$scope.seting._tags = $scope.sc.tags;
		if ($scope.sc.json) {
			$scope.seting._tags = '热门播放';
			$scope.sectype = $scope.seting._json[$scope.sc.json];
			$scope.issec = true;
		}

		$scope.bs = new botscroll(100, 85); // 滚动事件
		$scope._divs = new divScroll({
			elm: $scope.elm.J_cdlist[0],
			shortnum: 0
		});

		$scope.getsec = function (eq, v) {
			$scope.elm.J_second_tr.find('a').removeClass('active').eq(eq).addClass('active');
			$scope.list = [];
			$scope.seting._tags = v;
			$scope.seting.pageNo = 1;
			$scope.seting.datasec = true;
			$scope.getAjax();
		}


		$scope.getAjax = function () {
			var senturl = webset.apiurl + 'vod/vodRec.json',
				data = {
					"columnType": $scope.sc.coltype,
					"tags": $scope.seting._tags,
					"region": $scope.seting.region,
					"year": $scope.seting.year,
					"source": $scope.seting.source,
					"type": $scope.seting.type,
					"pageSize": 15,
					"pageNo": $scope.seting.pageNo
				};

			var transform = function (data) {
				return $.param(data);
			};
			$http.post(senturl, data, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				transformRequest: transform
			}).success(function (res) {
				console.log('结果', res.response);
				$scope.list = $scope.list.concat(res.response.responseBody.list);
				$scope.bs.fisrt = true;
				$scope.bs.isc = true
				if (res.response.responseBody.list.length == 15) {
					$scope.bs.isc = true;
				} else {
					$scope.bs.isc = false;
					$scope.loadtext = '无更多内容';
				}
			});
		}
		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			$scope.bs.setmax($('.html').height());

		});

		$scope.getAjax();

		$scope.bs.getbot = function () {
			$scope.bs.isc = false;
			$scope.seting.pageNo++;
			$scope.getAjax();
		}

		$scope.isshowxuan = false;
		if (!$scope.sc.tags) {
			$scope.isxuan = true;
			$scope.elm.J_cdlist.css('height', window.innerHeight - 0.85 * window.rem);
			$http.post(webset.apiurl + 'vod/getcolumncategory.json', {}).success(function (res) {
				console.log('选择条件', res);
				var t = $scope.sc.coltype,
					dt = res.response.responseBody,
					len = dt.length;
				for (var i = 0; i < len; i++) {
					if (dt[i].name == t) {
						$scope.category = dt[i].list;
					}
				}
			});
			$scope.elm.J_cdlist.on('click', '.type-li', function () {
				var self = $(this),
					tp = self.data('type');
				self.addClass('active').siblings().removeClass('active');
				$scope.seting[tp] = self.data('value');

			});
		}
		$scope.showxuan = function () {
			$scope.isshowxuan = !$scope.isshowxuan;
			$scope._divs.seth();
		}
		$scope.xuanze = function () {
			$scope.seting.pageNo = 1;
			$scope.isshowxuan = false;
			$scope.list = [];
			$scope.getAjax();
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