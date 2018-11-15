define(['angular', 'wxshare', 'size', 'fun'], function (angular) {
    controller.$inject = ['$scope', '$rootScope', '$stateParams', '$http','WsData'];


    function controller($scope, $rootScope, $stateParams, $http,WsData) {
        $rootScope.htmlname = 'db-detail detial  pb10';
        $scope.rem = window.rem / 100;
        $scope.openId = getCookie('openId');
        $scope.boxId = getCookie('boxId');

        $scope.sc = GetRequest();
        $scope.ctype = $scope.sc.zb ? 1 : 0;
        $scope.is_addkandan = false;
        $scope.isshowdrama = false;
        $scope.seting = {
            pageNo: 1,
            pageSize: 10,
            creat: false
        };
        console.info('页面：',WsData)
        $scope.continueTv = function(){
            $rootScope.lpTip =false;
            WsData.mars();
        }
        
        //做加载提示
        $scope.loadtextshow = true;
        $scope.wholeshow = false;
        //相关推荐
        $scope.tjshow = false;

        $scope.fold1 = true;
        $scope.fold2 = true;
        $scope.fold3 = true;
        $scope.fold4 = true;
        $scope.unfold = function (i) {
            if (i == 1) {
                $scope.fold1 = !$scope.fold1;
            } else if (i == 2) {
                $scope.fold2 = !$scope.fold2;
            } else if (i == 3) {
                $scope.fold3 = !$scope.fold3;
            } else if (i == 4) {
                $scope.fold4 = !$scope.fold4;
            }
        }
        $scope.elm = {
            "J_dtpop": $('#J_dtpop'),
            "J_fullintro": $('#J_fullintro'),
            "J_dm_show": $('#J_dm_show'),
            "J_details_b": $('#J_details_b'),
            "J_scroll_go": $('#J_scroll_go'),
            "J_video": $('#J_video')
        };
        $scope.$on("$destroy", function () {
            $(window).unbind('scroll');
        });
        $scope.f = $scope.sc.columnType == "tv" || $scope.sc.columnType == 'anime' ? true : false;
        $scope.activejson = {};

        if ($scope.sc.from == 'search') {
            $rootScope.fromsearch = true;
        }


        $scope.getdetail = function (v) {
            if ($scope.sc.columnType == "film") {
                $scope.isfilm = true;
            } else {
                $scope.isfilm = false;
            }
            $scope.fadedmt = [];
            $scope.fadedmtnum = 0;
            $http.post(webset.apiurl + 'home/detail.json?kankeId=' + ($scope.sc.zb?$scope.sc.kankeId : '') + '&id=' + ($scope.sc.zb ? '' : $scope.sc.id), {}).success(function (res) {
                if (res.response.responseHeader.code == "200") {
                    //做加载提示
                    $scope.loadtextshow = false;
                    $scope.wholeshow = true;
                    $scope.detail = res.response.responseBody;
                    document.title = res.response.responseBody.title;
                    $scope.details = $scope.detail.details ? $scope.detail.details : '';
                    if ($scope.details) {
                        for (var i = 0, len = $scope.details.length; i < len; i++) {
                            $scope.details[i].image = "img/gif/" + $scope.details[i].key_en + ".gif";
                        }
                    }
                    //分享
                    if (_wxshare_on) {
                        //微信分享
                        var urltem = window.location.href;
                        wxshare.weixinshare_($scope.detail.title, $scope.detail.lpic + '!m180x180.jpg', $scope.detail.description.substr(0, 26) + '···', urltem);
                    }
                    //获取剧集
                    if (!$scope.sc.zb) {
                        $scope.getdm(1);
                    }

                    //获取明星列表
                     $scope.actors();

                    //点赞等状态
                    $scope.mystate();

                    // 评论
                    // $scope.pl();

                    //关联推荐
                    $scope.tj();

                    if ($scope.details.length > 0) {
                        $scope.dm.key_en = $scope.details[0].key_en;
                        $scope.dm.key_zh = $scope.details[0].key;
                        if (!$scope.sc.zb) {
                            // $scope.getMobiledm(1);
                        }
                    }
                } else {
                    if (!$scope.sc.zb) {
                        $scope.loadtextshow = false;
                        $scope.wholeshow = true;
                        // $.going('vodId未查到对应数据');
                        setTimeout(function () {
                            // $.stopgo();
                            // goBack();
                        }, 1500)
                    }
                }
            });
        };
        //暂时屏蔽分割线------
        //点播的直接加载详情页面，为解决常看频道进入详情页面后当前节目对应的无详情页面

            $scope.getdetail();

        //----end-------


        $scope.addhistory = function (v) {
            //增加首页推荐添加历史的标识---&recommend=1；
            if ($scope.sc.zb) {
                urlscy = webset.apiurl + 'users/history/save.json?type=1&id=' + $scope.sc.channelID+ '&openId='+$scope.openId+'&endTime='+1;
            } else {
                if (!$scope.detail) {
                    return false;
                }
              urlscy = webset.apiurl + 'users/history/save.json?type=0&id=' +$scope.sc.id + '&openId='+$scope.openId+'&playNumber='+v.volumnCount;
            }
            $http.post(urlscy, {}).success(function (e) {});
        };

        $scope.addKandan = function (v) {
            $http.post(webset.apiurl + 'users/watchingform/save.json?token=' + '123' + '&isPublic=' + v.isPublic + '&title=' + v.title + '&id=' + $scope.sc.id + '&cpid=' + '123', {}).success(function (e) {
                // $http.post(webset.apiurl+'users/watchingform/save.json?token='+'123'+'&isPublic='+$scope.seting.ispublic+'&title='+$scope.seting.currKey+'&id='+$scope.sc.id+'&cpid='+'123', {}).success(function(e) {
                if (e.response.responseHeader.code == '200') {
                    $.tipshow({
                        'msg': e.response.responseHeader.msg,
                        'type': 'success'
                    });
                    v.total = v.total + 1;
                } else {
                    $.tipshow({
                        'msg': e.response.responseHeader.msg,
                        'type': 'warning'
                    });
                }

            });
        }
        $scope.creatList = [];

        $scope.dindex = -1;
        $scope.dm = {
            "key_en": "",
            "totalrecords": 0,
            "key_zh": "",
            "dindex": 0
        };

        if ($scope.sc.zb) {
            $http.post(webset.apiurl + 'users/state/check.json?token=' + '123'+ '&type=' + $scope.ctype + '&id=' + $scope.sc.channelID + '&tag=&openId='+$scope.openId, {}).success(function (e) {
                if (e && e.response.responseHeader.code == 200 && e.response.responseBody) {
                    $scope.is_zbcollect = e.response.responseBody.isCollectioned == '1' ? true : false; //是否收藏
                }
            });

            //直播页面
            $scope.getjmlist = function () {
                $scope.sc.vid = '';
                $scope.sc.type = '';
                $scope.jmlist = [];
                var jmurl = webset.apiurl + 'epg/liveEpg.json?date=' + $scope.dates + '&channelId=' + $scope.sc.channelID + '&type=&scope=1&pageNo=1&pageSize=100';
                $http.post(jmurl, {}).success(function (e){
                    if (e.response.responseHeader.code == '200' && e.response.responseBody && e.response.responseBody.list.length) {
                        //做加载提示
                        $scope.loadtextshow = false;
                        $scope.wholeshow = true;
                        $scope.jmlist = e.response.responseBody.list;
                        var data = $scope.jmlist,
                            len = $scope.jmlist.length,
                            t = new Date(),
                            tm = t.getTime(),
                            tstr = $scope.dates.replace(/-/ig, '/');
                        $scope.gt = 0;
                        for (var i = 0; i < len; i++) {
                            if (data[i].flag == 1) {
                                $scope.gt = i;
                                $scope.activejson = data[i];
                                //-----暂时屏蔽分割线------
                                //调整逻辑定位epg节目加载详情，为解决常看频道进入详情页面后当前节目对应的无详情页面
                                // $scope.getdetail(data[i]);
                                //---end---
                                break;
                            }
                        }

                        //已经预约状态
                        var orderlistUrl = webset.apiurl + 'users/userReserveInfo.json?cpid=' + '123'+ '&type=1&openId=' + $scope.openId;
                        $http.post(orderlistUrl, {}).success(function (e) {
                            if (e && e.response.responseHeader.code == 200) {
                                $scope.orderlist = e.response.responseBody;
                                var list = $scope.orderlist;
                                for (var i = 0; i < len; i++) {
                                    var liveStartTime_i = data[i].date + " " + data[i].startTime;
                                    if (data[i].flag == 2) {
                                        if (list != undefined && list != '' && list != null) {
                                            var orderInfo = 'liveStartTime=' + liveStartTime_i + '&channelId=' + data[i].channelId;
                                            for (j = 0; j < list.length; j++) {
                                                var orderInfo_j = 'liveStartTime=' + (list[j].date + " " + list[j].startTime) + '&channelId=' + list[j].channelId;
                                                if (orderInfo_j == orderInfo) {
                                                    data[i].isorder = 1;
                                                    data[i].isorder = 1;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                });
            };


            $scope.jmtime = [];
            // $scope.jmbacktime = [];
            $scope.jmtimeeq = 0;
            // $scope.jmbacktimeeq = 6;
            var data = new Date(),
                str = '',
                wkarr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                day = data.getDay();
            data.setDate(data.getDate() - 7);
            for (var i = 0; i < 7; i++) {
                data.setDate(data.getDate() + 1);
                var obj = {};
                obj.class = data.getDay() == day ? "active" : '';
                var ts = data.getFullYear() + '-' + (data.getMonth() + 1 < 10 ? ('0' + (data.getMonth() + 1)) : (data.getMonth() + 1)) + '-' + (data.getDate() >= 10 ? data.getDate() : ('0' + data.getDate()));
                obj.timestr = ts;
                obj.day = wkarr[data.getDay()];
                if (obj.class == 'active') {
                    $scope.dates = ts;
                }
                $scope.jmtime.unshift(obj);
            }
            /*  var databack = new Date(),
                  strback = '';
              databack.setDate(databack.getDate() - 7);
              for (var i = 0; i < 7; i++) {
                  databack.setDate(databack.getDate() + 1);
                  var obj = {};
                  obj.class = databack.getDay() == day ? "active" : '';
                  var ts = databack.getFullYear() + '' + (databack.getMonth() + 1 < 10 ? ('0' + (databack.getMonth() + 1)) : (databack.getMonth() + 1)) + '' + (databack.getDate() >= 10 ? databack.getDate() : ('0' + databack.getDate()));
                  obj.timestr = ts;
                  obj.day = (databack.getMonth() + 1 < 10 ? ('0' + (databack.getMonth() + 1)) : (databack.getMonth() + 1)) + '-' + (databack.getDate() >= 10 ? databack.getDate() : ('0' + databack.getDate()));
                  $scope.jmbacktime.push(obj);
                  if (databack.getDay() == day) {
                      $scope.dates = ts;
                  }
              }*/


            $scope.changeday = function (eq, timestr) {
                $scope.dates = timestr;
                $scope.jmtimeeq = parseInt(eq);
                $scope.getjmlist();
            }
            $scope.changedayback = function (eq, timestr) {
                $scope.dates = timestr;
                $scope.jmbacktimeeq = parseInt(eq);
                $scope.getjmlistback();
            }
            $scope.getjmlist(); //直播节目单初始化
            $scope.addChannel = function () {
                var channel_data = $scope.jmlist;
                if (!$scope.detail) {
                    return false;
                }
                if ($scope.sc.recommend) {
                    urlscy = webset.apiurl + 'user/oftenReadChannel/' + channel_data[0].channelId + '/' + channel_data[0].channelKEn + '/' + $scope.openId + '/' + channel_data[0].startTime + '/tv/' + channel_data[0].kankeId + '/' + $scope.pinyinCity + '.json' + '?token=' + '123' + '&channelName=' + channel_data[0].channelName + '&recommend=1';
                } else {
                    urlscy = webset.apiurl + 'user/oftenReadChannel/' + channel_data[0].channelId + '/' + channel_data[0].channelKEn + '/' + $scope.openId + '/' + channel_data[0].startTime + '/tv/' + channel_data[0].kankeId + '/' + $scope.pinyinCity + '.json' + '?token=' + '123' + '&channelName=' + channel_data[0].channelName + '&recommend=0';
                }
                $http.post(urlscy, {}).success(function (e) {});
            }

        } else {
            $scope.getPlaySource = function (v, eq, keyz) {
                $scope.dm.key_en = v;
                $scope.dm.key_zh = keyz;
                $scope.dm.totalrecords = 0;
                $scope.dm.dindex = eq;
                $scope.fdindex = 0;
                // $scope.getMobiledm(1);
            }
            $scope.nottv_darma = [];
            $scope.getdm = function () {
                //电视推送剧集
                if (!$scope.nottv_darma[$scope.fdindex]) {
                    var dmurl = webset.apiurl + 'vodHome/drama.json?seriesCode=' + $scope.detail.playCode + '&id=' +$scope.sc.id+ '&videoType=' + $scope.sc.columnType+'&pageSize=10000&pageNo=1';
                    $http.post(dmurl, {}).success(function (e) {
                        if (e && e.response.responseHeader.code == '200') {
                           $scope.total_drama=e.response.responseBody.updateVod;
                            //剧集集数
                            $scope.nottv_darma= e.response.responseBody.list;
                        } else {
                            $scope.nottv_darma = [];
                        }
                    })
                }
            };

            $scope.newarr = function (num) {
                var len = Math.ceil(num / 10),
                    arr = [];
                for (var i = 0; i < len; i++) {
                    arr.push(i);
                }
                return arr;
            }
            //手机剧集观看
            $scope.fdindexM = 0;

            $scope.getMobiledm = function (pg) {
                $scope.fadedmtnum = pg;
                $scope.fdindexM = pg - 1;
                var id = $scope.detail.kanke_id.split('_')[1];
                var videoType = $scope.detail.kanke_id.split('_')[0];
                $http.post(webset.apiurl + 'vod/mobileDrama.json?id=' + id + '&videoType=' + videoType + '&keyEn=' + $scope.dm.key_en + '&pageSize=10&pageNo=' + pg, {}).success(function (e) {
                    if (e && e.response.responseHeader.code == '200') {
                        $scope.phone_darma = e.response.responseBody.list;
                        $scope.phone_total = e.response.responseBody.totalrecords
                        $scope.phone_total_daram = $scope.newarr(e.response.responseBody.totalrecords);
                    }
                })
            };
        }
        $scope.tj = function (v) {
            var urltj;
            if ($scope.sc.zb) {
                urltj = webset.apiurl + 'recommend/iti_vod.json?kankeId=' + $scope.sc.kankeId + '&pageNo=1&pageSize=6'+ '&type=' + $scope.detail.videoType + '&title=' + $scope.detail.title;
            } else {
                urltj = webset.apiurl + 'recommend/iti_vod.json?pageNo=1&pageSize=6&kankeId=&id=' + $scope.detail.id + '&type=' + $scope.detail.videoType + '&cpid=' + '123'+ '&title=' + $scope.detail.title;
            }
            $http.post(urltj, {}).success(function (e) {
                if (e.response && e.response.responseBody && e.response.responseBody.list.length > 0) {
                    $scope.tjshow = true;
                    $scope.tjtotal = e.response.responseBody.totalrecords;
                    $scope.tjlist = e.response.responseBody.list;
                }
            });
        }
        /*	//评论
         $scope.pl = function() {
         var plurl = webset.apiurl + 'user/reply/list.json?appKey=D176EB3E8B1F044B&appScrect=64&pageNo=1&pageSize=30&vodId=' + $scope.sc.vodId+'&kankeId='+$scope.sc.kankeId+'&token=' + '123'+'&replyId=0';
         $http.post(plurl, {}).success(function(e) {
         if(e.response.responseHeader.code=='200') {
         $scope.pllist = e.response.responseBody.list;
         $scope.commons = e.response.responseBody.list.length;
         }
         });
         }*/
        $scope.shareKan = function (v) {
            var src = webset.apiurl + 'users/shares.json?cpid=' + '123'+ '&title=' + $scope.detail.title + '&image=' + $scope.detail.bpic + '&token=' + '123';
            if ($scope.sc.zb) {
                src += '&type=1&channelName=' + v.channelName + '&id=' + $scope.sc.channelID + '&channelEn=' + v.kankeChannel + '&kankeId=' + v.kankeId;
            } else {
                src += '&type=0&videoType=' + $scope.sc.columnType + '&id=' + $scope.sc.id + '&edition=' + $scope.detail.edition;
            }
            $http.post(src, {}).success(function (e) {
                $scope.is_showshare = false;
                if (e.response.responseHeader.code == '200') {
                    $.tipshow({
                        'msg': '分享至动态成功',
                        'type': 'success'
                    });
                } else {
                    $.tipshow({
                        'msg': '分享至动态失败',
                        'type': 'warning'
                    });
                }
            }).error(function () {
                $scope.is_showshare = false;
                $.tipshow({
                    'msg': '分享至动态失败',
                    'type': 'warning'
                });
            });
        }


        //明星列表
        $scope.actors = function (){
            var dmurl = webset.apiurl + 'recommend/star/profiles.json?directorId=' + $scope.detail.directorIds + '&name=&starId=' + $scope.detail.actorIds.replace(/\;/g, ',');
            $http.post(dmurl, {}).success(function (e) {
                if (e.responseHeader.code == '200') {
                    $scope.actorlist = e.responseBody;
                }
            });
        };
        $scope.sameProgram = false;

        //点赞 点踩 收藏状态
        $scope.mystate = function () {
        	if($scope.sc.zb){//直播的时候id取得是channelId
        		var stateurl = webset.apiurl + 'users/state/check.json?token=' + '123'+'&type=' + $scope.ctype + '&id=' + $scope.sc.channelID + '&tag=&openId='+$scope.openId;
        	}else{
        		var stateurl = webset.apiurl + 'users/state/check.json?token=' + '123'+'&type=' + $scope.ctype + '&id=' + $scope.detail.id + '&tag=&openId='+$scope.openId;
        	}  
            $http.post(stateurl, {}).success(function (e) {
                if (e && e.response.responseHeader.code == 200) {
                    $scope.states = e.response.responseBody;
                    $scope.is_collect = $scope.states.isCollectioned == '1' ? true : false; //是否收藏
                    $scope.likenum = $scope.states.beLikeCount; //点赞数量
                    $scope.is_like = $scope.states.beLike == '1' ? true : false; //是否点赞
                    $scope.dislikenum = $scope.states.isBeLikedCount; //点踩数量
                    $scope.is_dislike = $scope.states.isBeLiked == '1' ? true : false; //是否点踩
                }
            });
            if ($scope.detail.videoType == 'tv') {
                $http.post(webset.apiurl + 'users/followTv/status.json?openId=' + $scope.openId + '&token=' + '123' + '&cpid=' + '123'+ '&seriesId=' + $scope.detail.id, {}).success(function (e) {
                    if (e && e.response.responseHeader.code == 200) {
                        $scope.is_watchtv = e.response.responseBody == '1' ? true : false; //是否追剧
                    }
                });

            }
        };
        //---------评论功能屏蔽start--------
        // $scope.type = 1;
        // $scope.commentId = '';
        // $scope.tip = '我也说句话';
        // $scope.commentfocus = function (id, nick, type) {
        //     $scope.focusJudge = !$scope.focusJudge
        //     if ($scope.focusJudge) {
        //         if (id != 0) {
        //             $("#J_text").attr('placeholder', '回复@' + nick);
        //             $scope.tip = '回复@' + nick;
        //         } else {
        //             $scope.tip = '我也说句话';
        //         }
        //         $scope.commentId = id;
        //         $("#J_text").focus();
        //         $scope.type = type;
        //         $scope.commenttext = '';
        //     }
        // }
        // $scope.commentId = "0";
        // $("#J_text").on('blur', function () {
        //     if ($scope.commenttext == undefined || $scope.commenttext.length == 0) {
        //         $("#J_text").attr('placeholder', '我也说句话');
        //         $scope.tip = '我也说句话';
        //         $scope.commentId = "0";
        //     }
        // })
        /*$scope.senttext = function() {
         if($scope.sc.vodId == ''&& $scope.sc.kankeId == '') {
         $.tipshow({
         'msg': '无法评论',
         'type': 'warning'
         });
         return false;
         }
         if($scope.commenttext == undefined || $scope.commenttext == '') {
         $.tipshow({
         'msg': '评论内容不可为空',
         'type': 'warning'
         });
         return false;
         }
         var senturl = webset.apiurl + 'user/reply/save.json?',
         data = {
         "context": $scope.commenttext,
         "vodId": $scope.sc.vodId,
         "kankeId": $scope.sc.kankeId,
         "token": '123',
         "appKey": "D176EB3E8B1F044B",
         "appScrect": "64",
         "replyId":$scope.commentId
         };

         var transform = function(data) {
         return $.param(data);
         };

         $http.post(senturl, data, {
         headers: {
         'Content-Type': 'application/x-www-form-urlenc' +
         'oded; charset=UTF-8'
         },
         transformRequest: transform
         }).success(function(e) {
         if(e && e.response.responseHeader.code == "200") {
         $scope.tip = '我也说句话';
         $scope.commentId="0";
         $.tipshow({
         'msg': '评论成功',
         'type': 'success'
         });
         $scope.pl();
         $scope.commenttext = undefined;
         }
         });
         }*/

        //-----------end-----------------
//      $scope.continueTv = function (v) {
//          if (v == 'tv') {
//              if (!$scope.detail && !$scope.uptotals) {
//                  $.tipshow({
//                      'msg': '无法追剧',
//                      'type': 'warning'
//                  });
//                  return false;
//              }
//              var operation = $scope.is_watchtv ? 0 : 1;
//              urlscy = webset.apiurl + 'users/followTv.json?openId=' + $scope.openId + '&token=' + '123' + '&cpid=' + '123'+ '&seriesId=' + $scope.detail.id + '&operation=' + operation + '&updateVod=' + $scope.uptotals;
//              $http.post(urlscy, {}).success(function (e) {
//                  var msg = e.response.responseHeader.msg;
//                  if (e && e.response.responseHeader.code == "200") {
//                      $.tipshow({
//                          'msg': msg,
//                          'type': 'success'
//                      });
//                      $scope.is_watchtv = !$scope.is_watchtv;
//                  } else {
//                      $.tipshow({
//                          'msg': msg,
//                          'type': 'warning'
//                      });
//                  }
//              });
//          }
//      }


        $scope.collect = function (v, zbflag) {
            var urlscy, is_collect;
            if ($scope.sc.zb) {
                var zboperation = $scope.is_zbcollect ? -1 : 1
                is_collect = $scope.is_zbcollect;
                urlscy = webset.apiurl + 'users/collect/save.json?token=' + '123' + '&openId='+$scope.openId+ '&type=1&id=' + $scope.sc.channelID + '&operation=' + zboperation + '&title=' + $scope.sc.chaneseName + '&image=' + $scope.detail.image + '&englishName=' + $scope.sc.englishName;
            } else {
                if (!$scope.detail) {
                    $.tipshow({
                        'msg': '无法添加收藏',
                        'type': 'warning'
                    });
                    return false;
                }
                var operation = $scope.is_collect ? -1 : 1;
                is_collect = $scope.is_collect;
                urlscy = webset.apiurl + 'users/collect/save.json?token=' + '123' + '&openId=' +$scope.openId+ '&type=0&id=' + (v ? v : $scope.detail.id) + '&operation=' + operation + '&title=' + $scope.detail.title + '&image=' + $scope.detail.image + '&videoType=' + $scope.detail.videoType;
            }
            $http.post(urlscy, {}).success(function (e) {
                var msg = e.response.responseHeader.msg;
                if (e && e.response.responseHeader.code == "200") {
                    $.tipshow({
                        'msg': msg,
                        'type': 'success'
                    });
                    if ($scope.sc.zb) {
                        $scope.is_zbcollect = !$scope.is_zbcollect;
                        $scope.is_collect = !$scope.is_collect;
                    } else {
                        $scope.is_collect = !$scope.is_collect;
                    }
                } else {
                    // var msg = is_collect ? '取消收藏失败' : '收藏失败';
                    $.tipshow({
                        'msg': msg,
                        'type': 'warning'
                    });
                }
            });
        }
        $scope.like = function () {
            $scope.pac($scope.is_like, 'like', '点赞');
        }
        $scope.dislike = function () {
            $scope.pac($scope.is_dislike, 'dislike', '点踩');
        }
        /*operation 1点赞 -1 取消    2 点踩 -2 取消   type： 0 点播，2 看单 id :点播的id。直播的channelID,看单的id*/
        $scope.pac = function (yn, t, text) {
            //点赞  取消点赞
            if (!$scope.detail) {
                $.tipshow({
                    'msg': '无法' + text,
                    'type': 'warning'
                });
                return false;
            }
            var value;
            if (t == "like") {
                if ($scope.is_dislike == 1) {
                    $.tipshow({
                        'msg': '点赞点踩不能同时点',
                        'type': 'warning'
                    });
                    return;
                }
                if (yn) value = -1
                else value = 1;
            } else if (t == "dislike") {
                if ($scope.is_like == 1) {
                    $.tipshow({
                        'msg': '点赞点踩不能同时点',
                        'type': 'warning'
                    });
                    return;
                }
                if (yn) value = -2
                else value = 2;
            }
            var pacurl = webset.apiurl + 'users/like.json?token=' + '123' + '&tag=&cpid=' + '123'+ '&id=' + $scope.detail.id + '&type=' + $scope.ctype + '&operation=' + value
            $http.post(pacurl, {}).success(function (e) {
                if (e && e.response.responseHeader.code == "200") {
                    var msg = yn ? '取消' + text : text + '成功';
                    $.tipshow({
                        'msg': msg,
                        'type': 'success'
                    });
                    if (t == "like") {
                        if ($scope.is_like == false) {
                            $scope.likenum = parseInt($scope.likenum) + 1;
                        } else {
                            if (parseInt($scope.likenum) == 0 || !$scope.likenum) {
                                $scope.likenum = 0;
                            } else {
                                $scope.likenum = parseInt($scope.likenum) - 1;
                            }
                        }
                        $scope.is_like = !$scope.is_like;
                    } else if (t == "dislike") {
                        if ($scope.is_dislike == false) {
                            $scope.dislikenum = parseInt($scope.dislikenum) + 1;
                        } else {
                            if (parseInt($scope.dislikenum) == 0 || !$scope.dislikenum) {
                                $scope.dislikenum = 0;
                            } else {
                                $scope.dislikenum = parseInt($scope.dislikenum) - 1;
                            }
                        }
                        $scope.is_dislike = !$scope.is_dislike;
                    }

                } else {
                    var msg;
                    if (t == "like") {
                        msg = $scope.is_like ? '取消' + text + '失败' : text + '失败';
                    } else if (t == "dislike") {
                        msg = $scope.is_cai ? '取消' + text + '失败' : text + '失败';
                    }

                    $.tipshow({
                        'msg': msg,
                        'type': 'warning'
                    });
                }

            });
        }


      /*  $scope.gotoplay = function (index, v) {
            $scope.daindex = index - 1;
            var urlpv = webset.base;
            urlpv += 'random/sendVideoRemoteMsg?playAction=vod&playId=' + v.code + '&tyOpenId=' + '123' + '&openId=' + $scope.openId + '&boxId=' + $scope.boxId;
            $http.post(urlpv, {}).success(function (res) {
                $scope.addhistory(v);
                if (res && res.result == "0") {
                    $.tipshow({
                        'msg': '推送成功,若实际投屏失败，请点击右上方“投屏失败”反馈',
                        'type': 'success',
                        'lineheight': true
                    });
                } else {
                    $.tipshow({
                        'msg': '推送失败,请点击右上方“投屏失败”反馈',
                        'type': 'warning',
                        'lineheight': true
                    })
                }
            });
        }*/
        $scope.gotoMobilePlay = function (link) {
            window.location.href = link;
        }
        //新增为了解决冒泡下，href跳转我的设备失败
        $scope.goto = function () {
            window.location.href = '#/mine_device'
        }
        //绑定提示框
        $scope.tips = false;
        $scope.diTips = false;
        $rootScope.bodyovh = false;
        //弹出框先隐藏
        $scope.tvPop = false;
        $scope.mbPop = false;
        $scope.stopBubble = function ($event) {
            $event.stopPropagation();
            $event.preventDefault();
        }
        $scope.resetstate = function () {
            $scope.tips = false;
        }
        //点播推送手机观看弹出框
        //取消
        $scope.dibble = function () {
            $scope.diTips = false;
            $rootScope.bodyovh = false;
        }
        //显示
        $scope.playmb = function () {
            $scope.diTips = true;
            $rootScope.bodyovh = true;
            $scope.mbPop = true;
            $scope.tvPop = false;
        }
        $scope.selectfun = function (index, v) {
            if ($scope.fail) {
                $scope.typefail(v)
            } else {
                $scope.gotoplay(index, v)
            }
        }
        $scope.typefail = function (v) {
            if ($scope.detail.videoType == "film") {
                var playId = $scope.detail.play_code;
            } else {
                var playId = v.code;
            }
            $http.post(webset.apiurl + 'vodHome/manualHandle.json?cpid=' + '123'+ '&programCode=' + playId + '&token=' + '123', {}).success(function (res) {
                if (res.response.responseHeader.code == 200) {
                    $scope.show_fail = true;
                    setTimeout(function () {
                        $scope.show_fail = false;
                        $scope.$apply()
                    }, 2000)
                } else {
                    $.tipshow({
                        'msg': res.response.responseHeader.msg,
                        'type': 'warning'
                    })
                }
            })
            $scope.dibble();
        }
        $scope.playfail = function () {
            // 反馈确认
            $scope.is_fk_show = false;
            if ($scope.detail.videoType == "film") {
                $scope.typefail()
            } else {
                $scope.diTips = true;
                $rootScope.bodyovh = true;
                $scope.tvPop = true;
                $scope.mbPop = false;
                $scope.fail = true;
            }

        }
        // 电视推送并添加历史记录
        $scope.playtv = function (cvp, v) {
            if ($scope.sc.zb && cvp == '') {
                // var playId = $scope.jmlist[$scope.gt].channelId;
                // var senturl = webset.base + 'random/sendVideoRemoteMsg?playAction=channel&playId=' + playId + '&tyOpenId=' + '123' + '&openId=' + $scope.openId + '&boxId=' + $scope.boxId;
                var senturl = webset.base + 'random/sendVideoRemoteMsg?type=1&channelId=' + $scope.sc.channelID + '&openId=' + $scope.openId + '&boxId=' + $scope.boxId;
                $http.post(senturl, {}).success(function (res) {
                    $scope.addhistory();
                    if (res && res.result == "0") {
                        $.tipshow({
                            'msg': '推送成功',
                            'type': 'success'
                        })
                    } else {
                        $.tipshow({
                            'msg': '推送失败',
                            'type': 'warning'
                        })
                    }
                })
            } else if ($scope.sc.zb && cvp == 'back') {
            	var dateStr = (v.date).replace(/-/g,'');				
				var startTimeStr = dateStr+(v.startTime).replace(':','')+'00';	
				var endTimeStr = dateStr+(v.endTime).replace(':','')+'00';
                // var playId = encodeURIComponent(v.channelId + '|' + v.playDate + v.startTime + ':00|' + v.playDate + v.endTime) + ':00';
                var senturl = webset.base + 'random/sendVideoRemoteMsg?type=3&channelId=' + $scope.sc.channelID+'&openId=' + $scope.openId + '&boxId=' + $scope.boxId+'&startTime='+startTimeStr+'&endTime='+endTimeStr;
                $http.post(senturl, {}).success(function (res) {
                    $scope.addhistory(v);
                    if (res && res.result == "0") {
                        $.tipshow({
                            'msg': '推送成功',
                            'type': 'success'
                        })
                    } else {
                        $.tipshow({
                            'msg': '推送失败',
                            'type': 'warning'
                        })
                    }
                });
            } else {
                var urlpv = webset.base;
                    urlpv += 'random/sendVideoRemoteMsg?type=2&assetId='+v.code+'&providerId=' + v.cpCode + '&openId=' + $scope.openId + '&boxId=' + $scope.boxId;
                    $http.post(urlpv, {}).success(function (res) {
                        $scope.addhistory(v);
                        if (res && res.result == "0") {
                            $.tipshow({
                                'msg': '推送成功,若实际投屏失败，请点击右上方“投屏失败”反馈',
                                'type': 'success',
                                'lineheight': true
                            });
                        } else {
                            $.tipshow({
                                'msg': '推送失败,请点击右上方“投屏失败”反馈',
                                'type': 'warning',
                                'lineheight': true
                            });
                        }
                    });
                // } else {
                //     $scope.diTips = true;
                //     $rootScope.bodyovh = true;
                //     $scope.tvPop = true;
                //     $scope.mbPop = false;
                //     $scope.fail = false;
                // }
            }
        }
        $scope.ordertv = function (data, index) {
            var reserve = encodeURIComponent(angular.toJson(data));
            var liveStartTime;
            var liveEndTime;
            liveStartTime = $scope.dates + " " + data.startTime;
            liveEndTime = $scope.dates + " " + data.endTime;
            var orderUrl = webset.apiurl + 'users/myLiveReserve.json?isReserve=' + (data.isorder ? 0 : 1) + '&openId=' + $scope.openId + '&methodType=POST&reserve='+encodeURI('[' + reserve + ']');
            $http.post(orderUrl, {}).success(function (e) {
                var msg = data.isorder ? '取消预约' : '预约';
                if (e.response.responseHeader.code == 200) {
                    data.isorder = !data.isorder;
                    $.tipshow({
                        'msg': msg + '成功',
                        'type': 'success'
                    });
                } else {
                    $.tipshow({
                        'msg': msg + '失败',
                        'type': 'warning'
                    });
                }
            });
        };
        
        $scope.getPlayUrl = function(){
        	if ($scope.sc.zb){
        		var url = webset.base + 'phonePlay/authOnLiveRquest?channelId='+$scope.sc.channelID+'&imei=356723087512668';
            	$http.post(url, {}).success(function (e) {
            		if(e.status=="success"){
            			document.getElementById('J_video').setAttribute('src',e.url);
            		}else{
            			
            		}
            	});
        	}else{
        		var url = webset.base +'phonePlay/authVodRquest?assetId='+$scope.detail.playCode+'&providerId='+$scope.nottv_darma[0].cpCode+'&imei=356723087512668';
//          	var url = webset.base + 'phonePlay/authVodRquest?assetId=20181015095817175446700&providerId=GCABLE&imei=356723087512668'
            	$http.post(url, {}).success(function (e) {
            		if(e.status=="success"){
            			document.getElementById('J_video').setAttribute('src',e.url);
            		}else{
            			
            		}
            	});
        	};
//      	if ($scope.sc.hk){
//      		var dateStr = (v.date).replace(/-/g,'');				
//				var startTimeStr = dateStr+(v.startTime).replace(':','')+'00';	
//				var endTimeStr = dateStr+(v.endTime).replace(':','')+'00';
//      		var url = 'http://gdyx.kanketv.com/gdyx-wxtv/phonePlay/authBackRquest?channelId='+$scope.sc.channelID+'&startTime='+startTimeStr+'&endTime='+endTimeStr+'&imei=356723087512668';
//          	$http.post(url, {}).success(function (e) {
//          		if(e.status==0){
//          			$scope.playUrl = e.payUrl;
//          		}else{
//          			
//          		}
//          	});
//      	};
        };
        setTimeout(function(){$scope.getPlayUrl()},1000)
        
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent, element) {
            var repeatId = element.parent().attr("repeat-id");
            switch (repeatId) {
                case "r1":
                    //看单列表
                    break;
                case "r3":
                    var elms = $scope.elm.J_scroll_go;
                    elms.scrollTop(0);
                    var eq = parseInt(elms.find('.active').attr('eq'));
                    elms.scrollTop((eq-2.5) * 45 * $scope.rem);
                    break;
            }
        });

        $scope.$on("$destroy", function () {
            $(window).off('scroll');
        });
    }

    return {
        controller: controller
    };
});