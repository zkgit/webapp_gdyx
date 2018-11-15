define(['angular', 'size', 'fun'], function (angular, tpl) {
    controller.$inject = ['$scope', '$rootScope', '$http'];

    function controller($scope, $rootScope, $http) {
        $scope.list = [{
                top: false
            },
            {
                top: false
            },
            {
                top: false
            },
        ]

    }
    return {
        controller: controller,
        tpl: tpl
    };
});