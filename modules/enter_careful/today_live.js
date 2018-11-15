define(['angular', 'size', 'fun', 'slide'], function (angular, tpl) {
	controller.$inject = ['$scope', '$http', '$rootScope', '$location'];

	function controller($scope, $http, $rootScope, $location) {
		$scope._config = _modules_config;
		$scope.openId = getCookie('openId');
		$scope.boxId = getCookie('boxId');
		$scope.loadtext = '正在加载...';
		$scope.showLoading = true;
		
		$scope.list = {};
		$scope.getList = function () {
			$http.post(webset.apiurl +'home//hotView/all.json', {}).success(function (e) {	
				if(e.response.responseBody){
					$scope.list = e.response.responseBody;
					$scope.showLoading = false;
				}else{
					$scope.loadtext = '暂无相关数据';
				}			
			});
		}
		$scope.getList();

	}
	return {
		controller: controller,
		tpl: tpl
	};
});