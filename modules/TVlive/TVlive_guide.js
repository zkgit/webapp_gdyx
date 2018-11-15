define(['angular', 'size', 'fun', 'slide'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {

		$scope.pinyinCity = getCookie('pinyinCity');
		$scope.bs = new botscroll(5, 20); // 滚动事件


		//海报
		$http.post(webset.apiurl + 'vod/poster.json?did=' + $scope.pinyinCity + '&poster=live&pageNo=1&pageSize=3&appKey=34DB874AF269B539&appScrect=40', {}).success(function (res) {
			console.log('海报', res);
			var posters = [];
			posters.push(res.response.responseBody[res.response.responseBody.length - 1]);
			posters = posters.concat(res.response.responseBody);
			posters.push(res.response.responseBody[0]);
			$scope.poster = posters;
			console.log($scope.poster)
			// $scope.poster=res.response.responseBody;
		});

		$scope.checklast = function ($last) {
			if ($last) {
				$scope.swipe = new swipe({
					"elm": document.getElementById('J_swipe'),
					"autoplay": 3000
				})
			}
		};
		//标签
		$http.post(webset.apiurl + 'epg/liveView.json?did=' + $scope.pinyinCity, {}).success(function (res) {
			$scope.category = res.response.responseBody
		});

		$scope.seting = {
			"pageNo": 1,
			"pageSize": 1
		};
		$scope.list = [];

		$scope.getAjaxList = function () {
			var senturl = webset.apiurl + 'epg/liveIndex.json?did=' + $scope.pinyinCity + '&pageNo=' + $scope.seting.pageNo + '&pageSize=' + $scope.seting.pageSize;
			$http.post(senturl, {}).success(function (res) {
				$scope.list = $scope.list.concat(res.response.responseBody.list);
				$scope.bs.fisrt = true;
				$scope.bs.isc = true;
				if (res.response.responseBody.list.length == $scope.seting.pageSize) {
					$scope.bs.isc = true;
					$scope.loadtext = '正在加载...';
					if (res.response.responseBody.totalrecords == "0") {
						$scope.loadtext = '暂无内容';
					}
				} else {
					$scope.bs.isc = false;
					$scope.loadtext = '无更多内容';
				}
			});
		};

		$scope.getAjaxList();
		$scope.bs.getbot = function () {
			$scope.bs.isc = false;
			$scope.seting.pageNo++;
			$scope.getAjaxList();
		};


		$scope.$on("$destroy", function () {
			$scope.bs.isc = false;
		})
		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			$scope.bs.setmax($('.html').height());

		});
	}
	return {
		controller: controller,
		tpl: tpl
	};
});