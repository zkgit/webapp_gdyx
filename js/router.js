/*
 * 彻底解耦，按需加载，router的配置可以放到服务器直出，更便于团队合作
 */
define(['angular', 'require', 'angular-ui-router', 'wxshare', 'fun', 'lazy', 'infiniteScroll', 'inngScroll', 'ngWebSocket'], function (angular, require) {
    if (_wxshare_on) {
        var data = {
            title: "天翼高清微助手",
            logourl: "http://jsitvwx.cnitv.net/jsdxitv_vcms/image_space/logo.png",
            info: "小屏掌控大屏，电视新鲜玩法",
            url: serverBase, //主页分享链接    默认为webset.base，可不传
            debug: false //是否开启调试    true/false  默认为false，可不传
        };
        wxshare.init(data);
    }

    var app = angular.module('webapp', ['ui.router', 'me-lazyload', 'infinite-scroll', 'duScroll', 'ngWebSocket']);

    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',
        function ($stateProvider, $urlRouterProvider, $controllerProvider) {
            var routeMap = {
                    //-----！！新加路由需备注！！-------------//
                    '/enter_careful': { //精选入口
                        path: 'modules/enter_careful/enter_careful',
                        controller: 'enter_carefulCtrl'
                    },
                    '/choose_db': { //点播入口
                        path: 'modules/index_db/choose',
                        controller: 'choose_dbCtrl'
                    },
                    '/enter_TVlive': { //直播入口
                        path: 'modules/enter_TVlive/enter_TVlive',
                        controller: 'enter_TVliveCtrl'
                    },
                    '/TVlive': { //直播入口
                        path: 'modules/TVlive/TVlive',
                        controller: 'TVliveCtrl'
                    },
                    '/TVlive_list': {
                        path: 'modules/TVlive/TVlive_list',
                        controller: 'TVlive_listCtrl'
                    },
                    '/profile': {
                        path: 'modules/profile/profile',
                        controller: 'profileCtrl'
                    },
                    '/mine': { //我的入口
                        path: 'modules/individual/mine',
                        controller: 'mineCtrl'
                    },
                    '/search': {
                        path: 'modules/search/search',
                        controller: 'searchCtrl'
                    },
                    '/hotlist': {
                        path: 'modules/hotlist/hotlist',
                        controller: 'hotlistCtrl'
                    },
                    '/creatProgram': {
                        path: 'modules/creatProgram/creatProgram',
                        controller: 'creatProgramCtrl'
                    },
                    //开通会员
                    '/mine_toMember': {
                        path: 'modules/individual/mine_toMember',
                        controller: 'mine_toMemberCtrl'
                    },
                    '/mine_history': {
                        path: 'modules/individual/mine_history',
                        controller: 'mhistoryCtrl'
                    },
                    '/mine_collect': {
                        path: 'modules/individual/mine_collect',
                        controller: 'collectCtrl'
                    },
                    '/mine_watchtv': {
                        path: 'modules/individual/mine_watchtv',
                        controller: 'watchtvCtrl'
                    },
                    '/mine_order': {
                        path: 'modules/individual/mine_order',
                        controller: 'collectCtrl'
                    },
                    '/mine_detail': {
                        path: 'modules/individual/mine_detail',
                        controller: 'mdetailCtrl'
                    },
                    '/mine_channel': {
                        path: 'modules/individual/mine_channel',
                        controller: 'mine_channelCtrl'
                    },
                    '/mine_device': {
                        path: 'modules/individual/mine_device',
                        controller: 'mine_deviceCtrl'
                    },
                    '/mine_member': {
                        path: 'modules/individual/mine_member',
                        controller: 'mine_memberCtrl'
                    },
                    '/mine_dynamic': {
                        path: 'modules/individual/mine_dynamic',
                        controller: 'mine_dynamicCtrl'
                    },
                    '/mine_feedback': { //自助服务
                        path: 'modules/individual/mine_feedback',
                        controller: 'mine_feedbackCtrl'
                    },
                    '/mine_buy': { //订购记录
                        path: 'modules/individual/mine_buy',
                        controller: 'mine_buyCtrl'
                    },
                    '/mine_message': { //我的消息
                        path: 'modules/individual/mine_message',
                        controller: 'mine_messageCtrl'
                    },
                    '/mine_msg_order': { //我的消息预约
                        path: 'modules/individual/mine_msg_order',
                        controller: 'mine_msgorderCtrl'
                    },
                    '/mine_msg_feedback': { //我的消息预约
                        path: 'modules/individual/mine_msg_feedback',
                        controller: 'mine_msgfeedbackCtrl'
                    },
                    '/mine_message': { //我的消息
                        path: 'modules/individual/mine_message',
                        controller: 'mine_messageCtrl'
                    },
                    '/mine_program': { //我的看单
                        path: 'modules/individual/mine_program',
                        controller: 'mine_programCtrl'
                    },
                    '/mine_friend': { //我的好友
                        path: 'modules/individual/mine_friend',
                        controller: 'mine_friendCtrl'
                    },
                    '/mine_fans': { //我的粉丝
                        path: 'modules/individual/mine_fans',
                        controller: 'mine_fansCtrl'
                    },
                    '/mine_focus': { //我的关注
                        path: 'modules/individual/mine_focus',
                        controller: 'mine_focusCtrl'
                    },
                    '/list': {
                        path: 'modules/list/list',
                        controller: 'listCtrl'
                    },
                    '/detail': {
                        path: 'modules/detail/detail',
                        controller: 'detialCtrl'
                    },
                    '/iti_detail': {
                        path: 'modules/detail/iti_detail',
                        controller: 'itidetialCtrl'
                    },
                    '/device': {
                        path: 'modules/device/device',
                        controller: 'deviceCtrl'
                    },
                    '/remote': {
                        path: 'modules/remote/remote',
                        controller: 'remoteCtrl'
                    },
                    '/index_db': { //点播首页
                        path: 'modules/index_db/index_db',
                        controller: 'index_dbCtrl'
                    },
                    '/list_db': {
                        path: 'modules/index_db/list_db',
                        controller: 'list_dbCtrl'
                    },
                    '/recommend': {
                        path: 'modules/recommend/recommend',
                        controller: 'recommendCtrl'
                    },
                    '/recommend_zb': {
                        path: 'modules/recommend/recommend_zb',
                        controller: 'recommend_zbCtrl'
                    },
                    '/recommend_you': {
                        path: 'modules/recommend/recommend_you',
                        controller: 'recommend_youCtrl'
                    },
                    '/recommend_tags': {
                        path: 'modules/recommend/recommend_tags',
                        controller: 'recommend_tagsCtrl'
                    },
                    //更多
                    '/iti': {
                        path: 'modules/iti/iti',
                        controller: 'itiCtrl'
                    },
                    //热播更多
                    '/iti_rb': {
                        path: 'modules/iti_rb/iti_rb',
                        controller: 'iti_rbCtrl'
                    },
                    //直播更多
                    '/iti_zb': {
                        path: 'modules/iti_zb/iti_zb',
                        controller: 'iti_zbCtrl'
                    },
                    //推荐更多
                    '/iti_tj': {
                        path: 'modules/iti_tj/iti_tj',
                        controller: 'iti_tjCtrl'
                    },
                    //首页直播更多
                    '/zb_more': {
                        path: 'modules/zb_more/zb_more',
                        controller: 'zb_moreCtrl'
                    },
//                  '/today_live': {
//                      path: 'modules/enter_careful/today_live',
//                      controller: 'today_liveCtrl'
//                  }
                },
                routeSecondaryMap = { //二级视图层：view-enter
                    '/recommendation': { //热播排行
                        path: 'modules/enter_careful/recommendation',
                        controller: 'recommendationCtrl',
                        parent: '/enter_careful.recommendation'
                    },
                    '/today_live': { //今日看点
                        path: 'modules/enter_careful/today_live',
                        controller: 'today_liveCtrl',
                        parent: '/enter_careful.today_live'
                    },
                    '/index_itu': { //看你想看
                        path: 'modules/enter_careful/index_itu',
                        controller: 'index_ituCtrl',
                        parent: '/enter_careful.index_itu'
                    },
                    '/good_friend': { //看友圈
                        path: 'modules/enter_careful/good_friend',
                        controller: 'good_friendCtrl',
                        parent: '/enter_careful.good_friend'
                    }
                };
            //点播-参数
            // $stateProvider.state('/choose_db', {
            //     url: '/choose_db?coltype&title',
            //     templateUrl: 'modules/index_db/choose.html',
            //     controller: 'choose_dbCtrl',
            //     resolve: {
            //         keyName: requireModule('modules/index_db/choose.js', 'choose_dbCtrl')
            //     }
            // });
            // $stateProvider.state('/enter_index_db.choose_db', {
            //     url: '/choose_db?title&coltype',
            //     views: {
            //         "enter@/enter_index_db": {
            //             templateUrl: 'modules/index_db/choose.html',
            //             controller: 'choose_dbCtrl'
            //         }
            //     },
            //     resolve: {
            //         keyName: requireModule('modules/index_db/choose.js', 'choose_dbCtrl')
            //     }
            // });

            //ui-view入口注入
            for (var key in routeMap) {
                $stateProvider.state(key, {
                    url: key,
                    templateUrl: routeMap[key].path + '.html?v=' + ng_version,

                    controller: routeMap[key].controller,
                    resolve: {
                        keyName: requireModule(routeMap[key].path + '.js', routeMap[key].controller)
                    }
                });
            }
            //enter-view二级公共视图入口注入
            for (var key in routeSecondaryMap) {
                $stateProvider.state(routeSecondaryMap[key].parent, {
                    url: key,
                    views: {
                        "enter": {
                            templateUrl: routeSecondaryMap[key].path + '.html?v=' + ng_version,

                            controller: routeSecondaryMap[key].controller
                        }
                    },
                    resolve: {
                        keyName: requireModule(routeSecondaryMap[key].path + '.js?', routeSecondaryMap[key].controller)
                    }
                });
            }

            function requireModule(path, controller) {
                return function ($q) {
                    var deferred = $q.defer();
                    require([path], function (ret) {
                        $controllerProvider.register(controller, ret.controller);
                        deferred.resolve();
                    });
                    return deferred.promise;
                }
            }
            $urlRouterProvider.otherwise("/enter_careful/recommendation"); //默认跳转到某个路由
        }
    ]);
    app.run(['$rootScope', '$location', '$state', function ($rootScope, $location, $state) {
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (toState && toState.url) {
                if (_wxshare_on) {
                    //微信分享
                    wxshare.check_(toState.url);
                }
                $rootScope.sc = GetRequest();
                if (toState.url != '/detail' && fromState.url == '/hot_spot') {
                    setCookie('hot_spotIndex', 0)
                }
                //底部菜单切换样式
//              if (toState.url == '/enter_careful' || toState.url == '/recommendation' || toState.url == '/index_itu' || toState.url == '/good_friend') {
                if (toState.url == '/enter_careful' || toState.url == '/recommendation' || toState.url == '/index_itu' || toState.url == '/good_friend'|| toState.url == '/today_live') {
                    $rootScope.showBar = true;
                    $rootScope.navtop = true;
                    $rootScope.current_menu = 1;
                    $rootScope.type = 'vod';
                    switch (toState.url) {
                        case '/recommendation':
                            $rootScope.enter_nav = 1;
                            break;
                        case '/today_live':
                            $rootScope.enter_nav = 2;
                            break;
                        case '/index_itu':
                            $rootScope.enter_nav = 3;
                            break;
                        case '/good_friend':
                            $rootScope.enter_nav = 4;
                            break;
                    }
                } else if (toState.url == '/choose_db') {
                    $rootScope.showBar = true;
                    $rootScope.navtop = false;
                    $rootScope.current_menu = 2;
                    $rootScope.type = 'vod';
                } else if (toState.url == '/TVlive') {
                    $rootScope.showBar = true;
                    $rootScope.navtop = false;
                    $rootScope.current_menu = 3;
                    $rootScope.type = 'live';
                } else if (toState.url == '/app_list') {
                    $rootScope.showBar = true;
                    $rootScope.navtop = false;
                    $rootScope.current_menu = 4;
                    $rootScope.type = 'apply';
                } else if (toState.url == '/mine') {
                    $rootScope.showBar = true;
                    $rootScope.navtop = false;
                    $rootScope.current_menu = 5;
                    $rootScope.type = 'vod';
                } else {
                    $rootScope.showBar = false;
                    $rootScope.type = 'vod';
                }
                if (toState.url == '/remote') {
                    $rootScope.showRemote = false;
                }

                if ($rootScope.showBar) {
                    document.title = '广东有线';
                }
            }
            $.backscroll();
            $rootScope.showremote = false;
            $rootScope.htmlname = '';
            $rootScope.headimg = decodeURIComponent(getCookie('headimgurl'));
        });
    }]);
    app.filter(
        'to_trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            }
        }]
    );
    app.filter(
        'to_wan', ['$sce', function ($sce) {
            return function (num) {
                if (num >= 100000000) {
                    return (num / 100000000).toFixed(3) + '亿';
                } else if (num >= 10000) {
                    return (num / 10000).toFixed(1) + '万';
                } else {
                    return num;
                }
            }
        }]
    )
    app.filter(
        'idstrtwo', ['$sce', function ($sce) {
            return function (str) {
                return str.toString().substr(2);
            }
        }]
    )
    app.filter(
        "kankeid", [function () {
            return function (str) {
                var t = str.split('_');
                return t[1] ? str.split('_')[1] : undefined;
            }
        }]
    )
    app.filter(
        "time_one", [function () {
            return function (str) {
                var pi = str.indexOf('.');
                if (pi >= 0) {
                    str = str.substr(0, pi);
                }
                var dt = new Date(str.replace(/-/ig, '/'));
                var dtHours;
                var dtMimutes;
                if (dt.getHours() < 10) {
                    dtHours = "0" + dt.getHours();
                } else {
                    dtHours = dt.getHours();
                }
                if (dt.getMinutes() < 10) {
                    dtMimutes = "0" + dt.getMinutes();
                } else {
                    dtMimutes = dt.getMinutes();
                }
                return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + ' ' + dtHours + ':' + dtMimutes;
            }
        }]
    )
    app.filter(
        "euc", [function () {
            return function (str) {
                return encodeURIComponent(str);
            }
        }]
    )
    app.filter(
        "vtype", [function () {
            return function (str) {
                if (str == "M" || str == "F") {
                    return 'film';
                } else if (str == "T") {
                    return 'tv';
                } else if (str == "E" || str == "A") {
                    return 'arts';
                } else if (str == "C") {
                    return 'anime';
                } else if (str == "D") {
                    return 'documentary';
                } else {
                    return str;
                }
            }
        }]
    )
    app.filter(
        "mytime", [function () {
            return function (str) {
                //取日期
                var tem = str.slice(0, 10);
                //时间
                var tem2 = str.slice(10, 16)
                var now = GetDateStr(0);
                var tomorrow = GetDateStr(1);
                if (tem == now) {
                    return '今天' + ':' + tem2;
                } else if (tem == tomorrow) {
                    return '明天' + ':' + tem2;
                } else {
                    var a = tem.slice(5, 10);
                    return a + ':' + tem2;
                }
            }
        }]
    )
    app.filter(
        "time_split", [function () {
            return function (str) {
                //取日期
                var tem = str.split(' ')[0];
                return tem
            }
        }]
    )
    app.filter(
        "typecss", [function () {
            return function (str) {
                if (str == "F") {
                    return "tlc";
                } else if (str == "E") {
                    return "tld";
                } else if (str == "C") {
                    return "tle";
                } else if (str == "T") {
                    return "tlf";
                } else if (str == "D") {
                    return "tlg";
                } else {
                    return 'tli';
                }
            }
        }]
    );
    app.filter(
        "typecn", [function () {
            return function (str) {
                if (str == "tv") {
                    return "电视剧";
                } else if (str == "film") {
                    return "电影";
                } else if (str == "arts") {
                    return "综艺";
                } else if (str == "anime") {
                    return "动漫";
                } else if (str == "documentary") {
                    return "纪录片";
                } else {
                    return str;
                }
            }
        }]
    );
    app.filter(
        "trancode", ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            }
        }]
    );
    app.filter(
        "typepng", [function () {
            return function (str) {
                if (str == "F") {
                    return "img/ico_index03fr.png";
                } else if (str == "E") {
                    return "img/ico_index04fr.png";
                } else if (str == "C") {
                    return "img/ico_index05fr.png";
                } else if (str == "T") {
                    return "img/ico_index06fr.png";
                } else if (str == "D") {
                    return "img/ico_index07fr.png";
                } else {
                    return 'img/ico_index08fr.png';
                }
            }
        }]
    );
    app.filter(
        "typeshare", [function () {
            return function (str) {
                if (str == "0") {
                    return "爱看的点播";
                } else if (str == "1") {
                    return "精彩的直播";
                } else if (str == "2") {
                    return "心水的看单";
                }
            }
        }]
    );
    app.filter(
        "typehotposter", [function () {
            return function (str) {
                if (str == "0" || str == "3") {
                    return "bglg_1";
                } else if (str == "1" || str == "4") {
                    return "bglg_2";
                } else if (str == "2" || str == "5") {
                    return "bglg_3";
                } else {
                    return 'bglg_1';
                }
            }
        }]
    );
    app.filter(
        "typeurl", [function () {
            return function (str) {
                return str.replace(/84/g, 113);
            }
        }]
    );
    app.filter(
        "typebtn", [function () {
            return function (str) {
                if (str == "0") {
                    return "btn-db";
                } else if (str == "1") {
                    return "btn-tv";
                } else if (str == "2") {
                    return "btn-order";
                } else {
                    return '';
                }
            }
        }]
    );
    app.filter(
        "typewidth", [function () {
            return function (str) {
                if (str == "0") {
                    return "100";
                } else if (str == "2") {
                    return "0";
                };
            }
        }]
    );
    app.directive('back', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    if (window.location.href.indexOf("shake=shake") > -1) {
                        window.location.href = webset.base;
                    } else {
                        if (window.history.length > 1) {
                            window.history.go(-1);
                        } else {
                            window.location.href = webset.base + '?openId=' + getUrlParam('openId');
                        }
                    }
                })
            }
        }
    }).directive('onFinishRenderFilters', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        //这里element, 就是ng-repeat渲染的最后一个元素
                        scope.$emit('ngRepeatFinished', element);
                    });
                }
            }
        };
    }).directive('errSrc', function () {
        return {
            link: function (scope, element, attrs) {
                element.bind('error', function () { //请求图片数据失败,加载err-src
                    if (attrs.src != attrs.errSrc) {
                        attrs.$set('src', attrs.errSrc);
                    }
                });
                attrs.$observe('src', function (value) { //src值为null,加载err-src
                    if (!value && attrs.errSrc) {
                        attrs.$set('src', attrs.errSrc);
                    }
                });
            }
        }
    }).directive('midTimeBtn', function () {
        return {
            link: function (scope, element, attrs) {
                var strattime = attrs.startt,
                    endtime = attrs.endt;
                var st = new Date(strattime.replace(/-/ig, '/')).getTime(),
                    nt = new Date().getTime(),
                    et = new Date(endtime.replace(/-/ig, '/')).getTime();
                if (st <= nt && nt < et) {
                    element.attr('class', 'gobtn').html('直播');
                } else {
                    element.remove()
                }
            }
        }
    }).directive('clickBottom', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', '.tab-text333', function () {
                    var self = $(this);
                    self.children().addClass('active');
                    self.siblings().children().removeClass('active');
                });
            }
        }
    }).directive('clickTvLeft', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', '.leftbar_item', function () {
                    var self = $(this);
                    self.children().addClass('bgf2 ce4');
                    self.siblings().children().removeClass('bgf2 ce4')
                });
            }
        }
    }).directive('clickTvTop', function () {
        return {
            link: function (scope, element, attrs) {
                element.on('click', '.dateTab', function () {
                    var self = $(this);
                    self.children().addClass('ce4 bgf2')
                    self.siblings().children().removeClass('ce4 bgf2');
                });
            }
        }
    }).directive('getuserinfo', ['$http', '$rootScope', function ($http, $rootScope) {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, element, attrs) {
                //解决ios列表过深，页面重新渲染，内容绘制错误空白，点击出现内容bug，浏览器底层问题待跟进
                element.WebKitOverflowScrolling = 'auto';
                element.scrollTop = 0;
                element.WebKitOverflowScrolling = 'touch';
                //-------分割线-----------------------------------------------------


            }
        }
    }]).directive('userbind', ['$http', '$rootScope', '$state', function ($http, $rootScope, $state) {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, element, attrs) {
                scope.openId = getUrlParam('openId');
                setCookie('openId', scope.openId);
                $http.post(webset.initurl + '?openId=' + scope.openId, {}).success(function (res) {
                    setCookie('nickname', encodeURIComponent(res.nickname));
                    setCookie('headimgurl', encodeURIComponent(res.headimgurl));
                    $http.post(webset.apiurl + 'users/boxCurrent.json?openId=' + scope.openId, {}).success(function (res) {
                        if (res && res.response.responseHeader.code == "200") {
                            setCookie("boxId", res.response.responseBody['boxId']);
                        }
                    }).error(function () {
                        $.tipshow({
                            'msg': 'Server Error',
                            'type': 'black'
                        });
                    });
                });
            }
        }
    }]);

    app.factory('WsData', function ($websocket, $http, $rootScope,$timeout) {
        // Open a WebSocket connection
        $rootScope.lpTip = false
        var openId = getCookie('openId'),
            boxId = getCookie('boxId');
        var url = "ws://gdyx.kanketv.com/gdyx-wxtv/websocket/" + openId + "/" + boxId;
        var handel = {};
        handel.strHandel = function (e) {
            return (Array.prototype.toString.call(e) === "[object object]")
        }
        handel.mars = function () {
            var that = this;
            var dataStream = $websocket(url);
            dataStream.onOpen(function (e) {
                $rootScope.lpTip = true;
                $rootScope.$digest()
                console.log('Socket已经连接');
            });
            dataStream.onError(function (e) {
                console.log('Socket链接失败');
                $rootScope.lpTip = false;
                $.tipshow({
                    'msg': '连接失败',
                    'type': 'warning'
                });
            });
            var timer = $timeout(function () {
                $rootScope.lpTip = false;
                dataStream.close(true);
                $.tipshow({
                    'msg': '暂无数据返回，断开连接',
                    'type': 'warning'
                });
            }, 5000); //该函数延迟5秒执行


            dataStream.onMessage(function (message) {
                console.log('接收到的data:', message.data);
                var res = eval('(' + message.data + ')')
                console.log('json转换后data:', res);
                // if (that.strHandel(message.data)) {
                //     res = angular.fromJson(message.data)
                // } else {
                //     res = message.data; //可能会报错，这个是转string,使用fromjson转json。
                //     return false
                // }
                if (res.command == "2") {
                    var parameters = res.parameters,
                        type = parameters.type,
                        url = "";
                    switch (type) {
                        case '1': //直播类型
                            url = webset.base + "phonePlay/authOnLiveRquest?channelId=" + parameters.channelId +
                                "&imei=356723087512668";
                            break;
                        case '2': //点播类型
                            url = webset.base + "phonePlay/authVodRquest?assetId=" + parameters.assetId +
                                "&providerId=" + parameters.providerId + "&imei=356723087512668";
                            break;
                        case '3': //回看类型
                            url = webset.base + "phonePlay/authBackRquest?channelId=" + parameters.channelId +
                                "&startTime=" + parameters.startTime + "&endTime=" + parameters.endTime + "&imei=356723087512668";
                            break;
                    }
                    
                    var promise = $http.get(url, {}).success(function (e) {});
                    promise.then(function name(res) {
                        //获取对应的播放地址，实现手机端的播放
                        if(res){
                            document.getElementById('J_video').setAttribute('src',res.data.url);
                            document.getElementById('J_video').play();
                        }
                        // that.url = res.data.url
                        dataStream.close(true);
                        $rootScope.lpTip = false;
                        //关闭长链接
                    }, function (err) {
                        $rootScope.lpTip = false;
                        dataStream.close(true);
                        $.tipshow({
                            'msg': '接口报错',
                            'type': 'warning'
                        });
                    })
                } else {
                    $rootScope.lpTip = false;
                    dataStream.close(true);
                    $.tipshow({
                        'msg': '拉屏失败',
                        'type': 'warning'
                    });
                }
            });
            // return that.url
        }
        return handel
    })


    return app;
});