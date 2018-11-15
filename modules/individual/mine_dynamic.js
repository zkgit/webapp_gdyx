define(['angular', 'size', 'fun'], function (angular, tpl) {
    controller.$inject = ['$scope', '$rootScope', '$http'];

    function controller($scope, $rootScope, $http) {
        $rootScope.htmlname = 'bgcffffff';
        
        
        $scope.userId = getCookie('userId');
        $scope.loadtext = '';
        $scope.sc = GetRequest();
        var title = $scope.sc.otherId != $scope.userId ? '他的动态' : '我的动态';
        document.title = title;

        $scope.seting = {
            pageNo: 1,
            pageSize: 15
        }
        $scope.list = [];
        $scope.bs = new botscroll(100, 85); // 滚动事件
        $scope.getlist = function () {
            $http.post(webset.apiurl + "users/relation.json?cpid=" + '123'+ "&token=" + '123' + "&relation=-1&pageNo=" + $scope.seting.pageNo + '&pageSize=' + $scope.seting.pageSize + '&otherId=' + ($scope.sc.otherId ? $scope.sc.otherId : 0), {}).success(function (e) {
                if (e && e.response.responseHeader.code == 200) {
                    $scope.list = $scope.list.concat(e.response.responseBody.list);
                    $scope.bs.fisrt = true;
                    $scope.bs.isc = true
                    if (e.response.responseBody.list.length == 15) {
                        $scope.bs.isc = true;
                    } else {
                        $scope.bs.isc = false;
                        $scope.loadtext = '无更多内容';
                    }
                } else {
                    $scope.list = [];
                    $scope.loadtext = "暂无数据";
                }
            });
        }
        $scope.getlist();

        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            $scope.bs.setmax($('.html').height());

        });
        $scope.bs.getbot = function () {
            $scope.bs.isc = false;
            $scope.seting.pageNo++;
            $scope.getlist();
        }


        $scope.like = function (v) {
            $scope.is_like = v.likeStatus == '0' ? false : true; //是否点赞
            var value = $scope.is_like ? -1 : 1;
            $http.post(webset.apiurl + 'users/like.json?cpid=' + '123'+ '&operation=' + value + '&type=' + v.type + '&id=' + v.id + '&tag=F&token=' + '123' + '&otherId=' + $scope.sc.otherId, {}).success(function (e) {
                if (e && e.response.responseHeader.code == "200") {
                    var msg = $scope.is_like ? '取消点赞' : '点赞成功';
                    $.tipshow({
                        'msg': msg,
                        'type': 'success'
                    });
                    if (!$scope.is_like) {
                        v.count = parseInt(v.count) + 1;
                        v.likeStatus = 1;
                    } else {
                        if (parseInt(v.count) == 0 || !v.count) {
                            v.count = 0;
                        } else {
                            v.count = parseInt(v.count) - 1;
                        }
                        v.likeStatus = 0;
                    }
                    $scope.is_like = !$scope.is_like;
                } else {
                    var msg;
                    msg = $scope.is_like ? '取消失败' : '点赞失败';
                    $.tipshow({
                        'msg': msg,
                        'type': 'warning'
                    });
                }
            });

        };

        $scope.del = function (index, v) {
            $http.post(webset.apiurl + 'users/moment/del.json?cpid=' + '123'+ '&token=' + '123' + '&momentIds=' + v.id, {}).success(function (e) {
                if (e && e.response.responseHeader.code == "200") {
                    $.tipshow({
                        'msg': '删除成功',
                        'type': 'success'
                    });
                    $scope.list.splice(index, 1);
                } else {
                    $.tipshow({
                        'msg': '删除失败',
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