define(['angular', 'size', 'fun'], function (angular, tpl) {
	controller.$inject = ['$scope', '$http', '$rootScope', '$location', '$state'];

	function controller($scope, $http, $rootScope, $location, $state) {
		$scope.elm = {
			'J_second_tr': $('#J_second_tr')
		};
		// $scope.elm.J_second_tr.on('click', '.tab-text333', function() {
		// 	var self = $(this);
		// 	self.children().addClass('ce4');
		// 	self.siblings().children().removeClass('ce4');
		// });
		// $state.go('/enter_careful.hot_spot');
	}
	return {
		controller: controller,
		tpl: tpl
	};
});