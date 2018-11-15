define(['angular', 'size', 'fun'], function (angular, tpl) {
    controller.$inject = ['$scope', '$rootScope', '$http'];

    function controller($scope, $rootScope, $http) {
        $rootScope.htmlname = 'index_my_col bgcffffff';
        document.title = '我的追剧';
        $scope.openId = getCookie('openId');
        
        
        $scope.seting = {
            pageNo: 1,
            pageSize: 15
        }
        $scope.list = [];
        $scope.loadtext = '正在加载...';
        $scope.bs = new botscroll(100, 85); // 滚动事件
        $scope.resetDel = function () {
            $scope.dellen = 0;
            $scope.allSelect = false;
        }
        $scope.resetstate = function () {
            $scope.deleteState = false;
            $scope.resetDel();
        }
        $scope.resetstate();
        $scope.count = function () {
            $scope.dellen = $('input:checkbox:checked').length;
            var num = $("input[type='checkbox']").length;
            if ($scope.dellen == num) {
                $scope.allSelect = true;
            } else {
                $scope.allSelect = false;
            }
        }
        $scope.deletefcn = function () {
            $("input[type=checkbox]").removeAttr("checked");
            //			顶部删除
            $scope.deleteState = !$scope.deleteState;
            $scope.resetDel();
        }
        $scope.loadtext = '';
        $scope.getList = function () {
            $http.post(webset.apiurl + 'users/followTv/list.json?openId=' + $scope.openId + '&cpid=' + '123'+ '&token=' + '123' + '&pageNo=' + $scope.seting.pageNo + '&pageSize=15', {}).success(function (e) {
                if (e && e.response.responseHeader.code == 200 && e.response.responseBody.totalrecords) {
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
                    $scope.loadtext = "暂无追剧"
                }
            });
        }
        $scope.getList();

        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            $scope.bs.setmax($('.html').height());

        });
        $scope.bs.getbot = function () {
            $scope.bs.isc = false;
            $scope.seting.pageNo++;
            $scope.getList();
        }
        $scope.checkAll = function () {
            $scope.allSelect = !$scope.allSelect;
            if ($scope.allSelect) {
                $("input[type='checkbox']").each(function () {
                    $(this)[0].checked = true;
                })
            } else {
                $("input[type='checkbox']").each(function () {
                    $(this)[0].checked = false;
                })
            }
            $scope.dellen = $('input:checkbox:checked').length;
        }
        $scope.deleteButton = function () {
            //			底部删除
            console.info("删除")
            if ($('input:checkbox:checked').length == 0) {
                $.tipshow({
                    'msg': '请选择节目',
                    'type': 'warning'
                });
                return;
            }
            $scope.deleteConfirm();
            // $scope.deleteCommit = true;
        }
        $scope.deleteConfirm = function () {
            var liList = $('input:checkbox:checked');
            var l = liList.length ? liList.length : 0;
            var arr = [];
            for (var i = 0; i < l; i++) {
                var id = $(liList[i]).data('id');
                arr.push(id);
            }
            if (arr.length) {
                $scope.commitdel(arr.join(','));
            }
        }
        $scope.commitdel = function (ids) {
            console.info("commitdel")
            $http.post(webset.apiurl + 'users/followTv/del.json?openId=' + $scope.openId + '&cpid=' + '123'+ '&token=' + '123' + '&ids=' + ids, {}).success(function (res) {
                console.log('删除追剧', res);
                $scope.resetstate();
                if (res.response.responseHeader.code != "200") {
                    $.tipshow({
                        'msg': '追剧删除失败',
                        'type': 'warning'
                    });
                } else {
                    $.tipshow({
                        'msg': '追剧删除成功',
                        'type': 'success'
                    });
                    $scope.list = [];
                    $scope.seting.pageNo = 1;
                    $scope.getList();
                }
            }).error(function () {
                $scope.resetstate();
                $.tipshow({
                    'msg': '追剧删除失败',
                    'type': 'warning'
                });
            });
        }
    }
    return {
        controller: controller,
        tpl: tpl
    };
});