define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		$rootScope.htmlname = 'bgcffffff';
		document.title = '开通会员';
		$scope.loadtext = '';
		
		
		$scope.boxId = getCookie('boxId');
		$scope.toBuyCheck = false; //校验是否订购弹窗控制
		//院线产品列表
		$scope.goodsList = [{
				id: 0,
				price: '¥30.00',
				title: '年包(电视院线)',
				title2: '精彩内容全年想看就看',
			},
			{
				id: 1,
				price: '¥238.00',
				title: '月包(电视院线)',
				title2: '精彩内容包月随心看',
			}
		];

		$scope.loadtext = '正在加载...';
		$scope.type = 0;
		//选中函数
		$scope.selectStatus = false;
		$scope.selectTiem = function (v) {
			$scope.itemId = v;
			$scope.selectStatus = true;
		};
		$scope.submitInfo = function () {
			if ($scope.selectStatus == false) {
				$.tipshow({
					'msg': '请选择订购产品',
					'type': 'warning'
				});
				return;
			}
			$scope.toBuyCheck = true;
		};
		$scope.stopBubble = function ($event) {
			$event.stopPropagation();
		};
		$scope.resetstate = function () {
			$scope.toBuyCheck = false;
		};
		$scope.subConfirm = function () {

		};


	}
	return {
		controller: controller,
		tpl: tpl
	};
});