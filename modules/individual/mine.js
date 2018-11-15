define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		$rootScope.htmlname = '';
		$scope.headimg = decodeURIComponent(getCookie('headimgurl'));
		$scope.nick = decodeURIComponent(getCookie('nickname'));
		$scope.openId = getCookie('openId');

		
		$scope.msgNum = 0;
		$http.post(webset.apiurl + 'users/message/total.json?openId=' + $scope.openId, {}).success(function (res) {
			if (res && res.response.responseHeader.code == 200 && res.response.responseBody) {
				$scope.msgNum = res.response.responseBody;
			}
		});

	}
	return {
		controller: controller,
		tpl: tpl
	};
});