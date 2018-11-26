define(['angular', 'size', 'fun', 'slide'], function (angular, tpl) {
	controller.$inject = ['$scope', '$http', '$rootScope', '$location'];

	function controller($scope, $http, $rootScope, $location) {
		$scope._config = _modules_config;
		$scope.openId = getCookie('openId');
		$scope.boxId = getCookie('boxId');
		$scope.loadtext = '正在加载...';
		$scope.showLoading = true;
		var myDate = new Date();
		var curHours = myDate.getHours();
		var index = Math.floor(curHours/2);
		$scope.curIndex = index;
		
		$scope.list = {};
		$scope.getList = function () {
			$http.post(webset.apiurl +'home/hotView/all.json', {}).success(function (e) {	
				if(e.response.responseBody){
					var list = e.response.responseBody;
					for(var i in list){
						list[i].index = parseInt(i)-1;
					}
					$scope.list = list;
					$scope.showLoading = false;
				}else{
					$scope.loadtext = '暂无相关数据';
				}			
			});
		}
		$scope.getList();

//时间定位
	setTimeout(function(){	
		document.documentElement.scrollTop = 248*index;
		window.pageYOffset = 248*index;
		document.body.scrollTop = 248*index;
	},500)


	}
	return {
		controller: controller,
		tpl: tpl
	};
});