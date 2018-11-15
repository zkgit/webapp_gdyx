define(['angular', 'wxshare', 'size', 'fun'], function (angular) {
    controller.$inject = ['$scope', '$rootScope', '$stateParams', '$http'];

    function controller($scope, $rootScope, $stateParams, $http) {
        console.log('detail')
        $scope.sc = GetRequest();
        
        
        $scope.rem = window.rem / 100;
        $scope.seting = {
            title_pageNo: 1,
            title_pageSize: 30,
            ispublic: 1, //是否公开
            currKey: '', //当前看单标题
            kandanType: $scope.sc.columnType,
            typearr: {
                'tv': 0,
                'film': 1,
                'arts': 2,
                'anime': 3,
                'documentary': 4
            },
            kandan_nav: $('.kandan_nav')
        }

        $scope.bs = new botscroll(100, 85);
        $scope.bs.isc = true;
        //看单标题
        $scope.kan_list = [];
        $scope.kandanlist = function () {
            $http.post(webset.apiurl + 'vodHome/title.json?cpid=' + '123'+ '&videoType=' + $scope.seting.kandanType + '&pageNo=' + $scope.seting.title_pageNo + '&pageSize=' + $scope.seting.title_pageSize, {}).success(function (e) {
                if (e.response.responseHeader.code == '200') {
                    console.log('看单标题', e);
                    $scope.kan_list = $scope.kan_list.concat(e.response.responseBody.list);
                    $scope.bs.fisrt = true;
                    $scope.bs.isc = true
                    if (e.response.responseBody.list.length == 30) {
                        $scope.bs.isc = true;
                    } else {
                        $scope.bs.isc = false;
                        // $scope.loadtext = '无更多内容';
                    }
                }
            });
        }
        $scope.kandanlist();
        $scope.changeKanindex = function (index, key) {
            $scope.kandanindex = index;
            $scope.seting.currKey = key;
        }
        $scope.addKandan = function () {
            if ($scope.seting.currKey) {
                $http.post(webset.apiurl + 'users/watchingform/save.json?token=' + '123' + '&isPublic=' + $scope.seting.ispublic + '&title=' + $scope.seting.currKey + '&id=' + $scope.sc.id + '&cpid=' + '123', {}).success(function (e) {
                    // $http.post(webset.apiurl+'users/watchingform/save.json?token='+'123'+'&isPublic='+$scope.seting.ispublic+'&title='+$scope.seting.currKey+'&id='+$scope.sc.id+'&cpid='+'123', {}).success(function(e) {
                    if (e.response.responseHeader.code == '200') {
                        console.log('添加看单', e);
                        $.tipshow({
                            'msg': e.response.responseHeader.msg,
                            'type': 'success'
                        });
                        $scope.seting.currKey = '';
                        window.history.go(-1);
                    } else {
                        $.tipshow({
                            'msg': e.response.responseHeader.msg,
                            'type': 'warning'
                        });
                    }

                });
            } else {
                $.tipshow({
                    'msg': '请选择看单标题',
                    'type': 'warning'
                });
            }
        }

        $scope.changeKanType = function (v) {
            $scope.seting.kandanType = v;
            $scope.kandanlist();
            $scope.seting.title_pageNo = 1;
            $scope.kan_list = [];
        }

        $scope.bs.getbot = function () {
            $scope.bs.isc = false;
            $scope.seting.title_pageNo++;
            $scope.kandanlist();
        }

        //懒加载
        $scope.bs = new botscroll(100, 85); // 滚动事件

        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent, element) {
            var repeatId = element.parent().attr("repeat-id");
            $scope.bs.setmax($('.html').height());
            var index = $scope.seting.typearr[$scope.seting.kandanType];
            $scope.seting.kandan_nav.scrollLeft((index - 2) * 84 * $scope.rem)
        });

        $scope.$on("$destroy", function () {
            $scope.bs.isc = false;
        });
    }
    return {
        controller: controller
    };
});