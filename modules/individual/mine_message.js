define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];

	function controller($scope, $rootScope, $http) {
		$rootScope.htmlname = 'pt60';
		document.title = '我的消息';
		
		
		$scope.loadtext = '';
		$scope.seting = {
			pageNo: 1
		}
		$scope.msgClass = function () {
			$http.post(webset.apiurl + 'users/message/type.json?token=' + '123' + '&cpid=' + '123', {}).success(function (e) {
				if (e && e.response.responseHeader.code == 200) {
					$scope.list = e.response.responseBody;
					for (var i = 0; i < $scope.list.length; i++) {
						$scope.countmes(i, $scope.list[i].id);
					}
					if (e.response.responseBody == null) {
						$scope.loadtext = "暂无消息";
					} else {
						$scope.loadtext = "";
					}
				} else {
					$scope.list = [];
					$scope.loadtext = "暂无消息";
				}
			});
		}
		$scope.msgClass();
		$scope.countmes = function (index, id) {
			$http.post(webset.apiurl + "users/messages.json?read=&cpid=" + '123'+ "&token=" + '123' + "&pageNo=" + $scope.seting.pageNo + "&pageSize=10&type=" + id, {}).success(function (e) {
				if (e && e.response.responseHeader.code == 200) {
					$scope.list[index].totalrecords = e.response.responseBody.totalrecords;
				} else {
					$scope.list[index].totalrecords = 0
				}
			});
		}


	}
	return {
		controller: controller,
		tpl: tpl
	};
});