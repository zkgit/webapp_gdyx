define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http', '$state'];

	function controller($scope, $rootScope, $http, $state) {
		$rootScope.htmlname = 'pglist  pb60';
		$scope.sc = GetRequest();
		$scope.loadtext = '正在加载...';
		$scope.typearr = [{
				name: '电影',
				type: 'film'
			},
			{
				name: '电视剧',
				type: 'tv'
			},
			{
				name: '综艺',
				type: 'arts'
			},
			{
				name: '动漫',
				type: 'anime'
			}
			//{name:'纪录片',type:'documentary'},
		]
		$scope.seting = {
			"pageNo": 1,
			"pageSize": 15,
			"region": "",
			"type": "",
			"tag": "",
			"year": "",
			"level": ""
		};

			$scope.seting.type=$scope.sc.columnType?$scope.sc.columnType:'film'

		$scope.getAjax = function () {
			$scope.isc = true;
			var senturl = webset.apiurl + 'search/siftings.json',
				data = {
					"queryStr": encodeURIComponent($scope.seting.type.split(',')[1] ? $scope.seting.type.split(',')[1] : ''),
					"region": $scope.seting.region,
					"year": $scope.seting.year,
					"tag": $scope.seting.tag,
					'type': $scope.seting.type,
					'level': $scope.seting.level,
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
				if (res.response.responseHeader.code == '200') {
					$scope.list = $scope.list.concat(res.response.responseBody.list);
					if (res.response.responseBody.list.length == 15) {
						$scope.isc = false;
						$scope.seting.pageNo++;
						$scope.loadtext = '正在加载...';
					} else {
						$scope.loadtext = '无更多内容';
					}
				} else {
					$scope.loadtext = '暂无内容';
				}
			});
		};
		$scope.choose = function (v) {
			$scope.loadtext = '正在加载...';
			$scope.list = [];
			$scope.category = []
			$scope.seting = {
				"pageNo": 1,
				"pageSize": 15,
				"region": "",
				"type": v,
				"tag": "",
				"year": "",
				"level": ""
			};
			$scope.getAjax();

			//筛选条件
			$http.get(webset.apiurl + 'vodHome/column/category.json?type=' + $scope.seting.type, {}).success(function (res) {
				$scope.category = res.response.responseBody;
			});
		};
		$scope.choose($scope.seting.type);

		$scope.chooseIndex = null;
		$scope.changechoose = function (eq) {
			$scope.chooseIndex = $scope.chooseIndex == eq ? null : eq;
		}

		$scope.elm = {
			"choosetable": $('#choosetable'),
			'J_second': $('#J_second')
		};

		$scope.elm.choosetable.on('click', '.type-li', function () {
			var self = $(this),
				tp = self.data('type');
			self.addClass('active').siblings().removeClass('active');
			$scope.seting[tp] = self.data('value');
			$scope.seting.pageNo = 1;
			$scope.list = [];
			$scope.loadtext = '正在加载...';
			$scope.getAjax();
		});

		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent, element) {
			$.each($('#choosetable .choosetable'), function (i) {
				var first = $(this).find('li:first').offset().top;
				var last = $(this).find('li:last').offset().top;
				if (last <= first) {
					$(this).find('.J_choose').hide()
				}
			})

		});

	}
	return {
		controller: controller,
		tpl: tpl
	};
});