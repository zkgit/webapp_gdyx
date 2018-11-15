define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		document.title = '自助服务';
		
		
		$scope.submit = function () {
			if (!$scope.val) {
				$.tipshow({
					'msg': '请输入详细问题',
					'type': 'warning'
				});
				return false;
			}
			$http.post(webset.apiurl + "users/savefk.json?cpid=" + '123'+ "&token=" + '123' + "&content=" + encodeURI($scope.val), {}).success(function (e) {
				if (e && e.response.responseHeader.code == '200') {
					$scope.val = '';
					$.tipshow({
						'msg': '提交成功',
						'type': 'success'
					});
				} else {
					$.tipshow({
						'msg': '提交失败',
						'type': 'warning'
					});
				}
			})
		}
	}
	return {
		controller: controller,
		tpl: tpl
	};
});