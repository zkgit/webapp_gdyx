define(['angular', 'size', 'fun'], function (angular, tpl) {
    controller.$inject = ['$scope', '$rootScope', '$http'];

    function controller($scope, $rootScope, $http) {
        $rootScope.htmlname = '';
        $scope.openId = getCookie('openId');
        document.title = '我的消息';
        $scope.sc = GetRequest();
//      document.title = $scope.sc.title;
        $scope.seting = {
            pageNo: 1,
            pageSize: 15
        }
        $scope.list = [];
        //      $scope.bs = new botscroll(100, 85); // 滚动事件
        $scope.resetDel = function () {
            $scope.dellen = 0;
            $scope.allSelect = false;
        }
        $scope.resetstate = function () {
            $scope.deleteState = false;
            $scope.resetDel();
        }
        $scope.resetstate();

        $scope.pinyinCity = getCookie("pinyinCity")
        $scope.deletefcn = function () {
            $("input[type=checkbox]").removeAttr("checked");
            //			顶部删除
            $scope.deleteState = !$scope.deleteState;
            $scope.resetDel();
        }
        $scope.type = 0;
        $scope.loadtext = '';
        
        $scope.loadtext = '正在加载...';
        $scope.getList = function () {
            //type=0 代表视频       1代表 频道   2代表看单
            $http.post(webset.apiurl + 'users/messages.json?read=1&pageNo=' + $scope.seting.pageNo + '&pageSize=20&openId='+$scope.openId, {}).success(function (e) {
                $scope.isc = true;
                if (e && e.response.responseHeader.code == 200 && e.response.responseBody.totalrecords) {
                    $scope.list = $scope.list.concat(e.response.responseBody.list);
                    if (e.response.responseBody.list.length == 15) {
                        $scope.isc = false;
                    } else {
                        $scope.loadtext = '无更多内容';
                    }
                } else {
                    $scope.loadtext = "暂无数据"
                }
            }).error(function () {
                $scope.loadtext = "暂无数据"
            });
        }
        $scope.getList();

        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {});

        $scope.count = function () {
            $scope.dellen = $('input:checkbox:checked').length;
            var num = $("input[type='checkbox']").length;
            if ($scope.dellen == num) {
                $scope.allSelect = true;
            } else {
                $scope.allSelect = false;
            }
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
//				var idStr = arr.join(',')
//				$scope.commitdel(idStr.slice(0,idStr.length-1));
				$scope.commitdel(arr.join(','))
			}
        }
        $scope.commitdel = function (ids) {
            console.info("commitdel")
            $http.post(webset.apiurl + 'users/message/del.json?openId='+$scope.openId+'&messageIds=' + ids, {}).success(function (res) {
                console.log('删除收藏', res);
                $scope.resetstate();
                if (res.response.responseHeader.code != "200") {
                    $.tipshow({
                        'msg': '删除消息失败',
                        'type': 'warning'
                    });
                } else {
                    $.tipshow({
                        'msg': '删除消息成功',
                        'type': 'success'
                    });
                    $scope.list = [];
                    $scope.seting.pageNo = 1;
                    $scope.getList();
                }
            }).error(function () {
                $.tipshow({
                    'msg': '删除消息失败',
                    'type': 'warning'
                });
                $scope.resetstate();
            });
        }
    }
    return {
        controller: controller,
        tpl: tpl
    };
});