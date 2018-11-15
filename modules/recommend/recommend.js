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
				"film": ["热门播放", "院线大片", "好莱坞大片", "动画大片", "华语专区", "欧美专区", "日韩专区"],
				"tv": ["热门播放", "内地剧场", "香港TVB", "偶像台剧", "热播美剧", "日剧集锦", "时尚韩风", "风情泰剧"],
				"arts": ["热门播放", "真人秀", "脱口秀", "内地专区", "港台专区", "海外专区"],
				"anime": ["热门播放", "国产专区", "日韩专区", "欧美专区"],
				"documentary": ["热门播放", "探索发现", "军事风云", "人物传奇", "社会观察", "历史文化"]
			}
		};

		$scope.elm = {
			"J_second_tr": $('#J_second_tr')
		};
		$scope.list = [];

		$scope.toptil = $scope.sc.label;

		$scope.seting._tags = $scope.sc.tags;
		if ($scope.sc.json) {
			$scope.seting._tags = '热门播放';
			$scope.sectype = $scope.seting._json[$scope.sc.json];
			$scope.issec = true;
		}

		$scope.bs = new botscroll(100, 85); // 滚动事件

		//		$scope.getsec = function(eq, v) {
		//			$scope.elm.J_second_tr.find('a').removeClass('active').eq(eq).addClass('active');
		//			$scope.list = [];
		//			$scope.seting._tags = v;
		//			$scope.seting.pageNo = 1;
		//			$scope.seting.datasec = true;
		//			$scope.getAjax();
		//		}

		$scope.getAjax = function () {
			var ituUrl = webset.apiurl + 'vod/mytypetag.json',
				data = {
					"dtid": $scope.pinyinCity,
					"type": $scope.sc.columnType,
					"token": '123',
					"tag": $scope.sc.label,
					"pageSize": 15,
					"pageNo": $scope.seting.pageNo
				};

			var transform = function (data) {
				return $.param(data);
			};
			$http.post(ituUrl, data, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				transformRequest: transform
			}).success(function (res) {
				console.log('结果', res);
				$scope.list = $scope.list.concat(res.response.responseBody[0].list);
				$scope.bs.fisrt = true;
				$scope.bs.isc = true;
				if (res.response.responseBody[0].list.length == 15) {
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

		$scope.$on("$destroy", function () {
			$scope.bs.isc = false;
		})
	}
	return {
		controller: controller,
		tpl: tpl
	};
});