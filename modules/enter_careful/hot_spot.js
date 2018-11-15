define(['angular', 'size', 'fun', 'slide'], function (angular, tpl) {
	controller.$inject = ['$scope', '$http', '$rootScope', '$location'];

	function controller($scope, $http, $rootScope, $location) {
		
		var swiper = new Swiper('.swiper-container', {
			slidesPerView: 1.5,
			spaceBetween: 15,
			touchRatio: 0.5,
			centeredSlides: true,
			// loop : true,
			observer: true, //修改swiper自己或子元素时，自动初始化swiper
			observeParents: true, //修改swiper的父元素时，自动初始化swiper
			initialSlide: 0,
			onSlideChangeStart: function () {
				var elms = $('.swiper-slide-active'),
					t = elms.data('type');
				$scope.getlist(t);
				$scope.tip = true;
			}
		});
		$http.post(webset.apiurl + 'home/hotTag.json?cpid=' + '123', {}).success(function (res) {
			if (res) {
				$scope.type = res.response.responseBody
			}
			var index = getCookie('hot_spotIndex');
			if (!index) {
				index = 0
			}
			$scope.getlist(res.response.responseBody[index].position, index);
		});

		$scope.getlist = function (t, eq) {
			$scope.tip = true;
			$scope.list = [];
			$scope.isshow_default = false;
			$scope.hotlistIndex = eq;
			setCookie('hot_spotIndex', eq)
			$http.post(webset.apiurl + 'home/hotVideo.json?cpid=' + '123'+ '&type=' + t, {}).success(function (res) {
				if (res.response.responseHeader.code == 200 && res.response.responseBody && res.response.responseBody.list.length) {
					$scope.tip = false;
					$scope.list = res.response.responseBody.list;
				} else {
					$scope.tip = false;
					$scope.isshow_default = true;
				}
			});
		};

		$scope.bs = new botscroll(100, 85); // 滚动事件


		$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
			$scope.bs.setmax($('.html').height());

		});
	}
	return {
		controller: controller,
		tpl: tpl
	};
});