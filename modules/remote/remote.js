 define(['angular', 'size', 'fun'], function (angular, tpl) {
 	controller.$inject = ['$scope', '$rootScope', '$http', '$timeout'];

 	function controller($scope, $rootScope, $http, $timeout) {
 		//天翼帐号
 		
 		$scope.openId = getCookie('openId');
 		$scope.boxId = getCookie('boxId');
 		
 		$scope.svgbox = $('#svgbox');
 		window.noscroll = function (event) {
 			event.preventDefault();
 		};

 		var sentcode = function (v) {
 			console.info(v);
 			$http.post(webset.base + 'random/sendCotrollRemoteMsg?playAction=channel&key=' + v + '&tyOpenId=' + '123' + '&openId=' + $scope.openId + '&boxId=' + $scope.boxId, {}).success(function (res) {});
 		};
 		//方向键
 		//普通点击功能
 		$('#svgbox').click(function (e) {
 			var v;
 			if (e.target.classList[0].indexOf('svg-up') > -1) {
 				v = '87634';
 			} else if (e.target.classList[0].indexOf('svg-right') > -1) {
 				v = '358983';
 			} else if (e.target.classList[0].indexOf('svg-bottom') > -1) {
 				v = '347843';
 			} else if (e.target.classList[0].indexOf('svg-left') > -1) {
 				v = '5367';
 			} else {
 				return;
 			}
 			sentcode(v);
 			console.log('触摸效果:' + v);
 		});
 		//持续点击效果
 		var tia;
 		document.getElementById('svgbox').addEventListener('touchstart', function (e) {
 			var v;
 			if (e.target.classList[0].indexOf('svg-up') > -1) {
 				$scope.svgbox.addClass('svgUp');
 				v = '87634';
 			} else if (e.target.classList[0].indexOf('svg-right') > -1) {
 				$scope.svgbox.addClass('svgRight');
 				v = '358983';
 			} else if (e.target.classList[0].indexOf('svg-bottom') > -1) {
 				$scope.svgbox.addClass('svgBot');
 				v = '347843';
 			} else if (e.target.classList[0].indexOf('svg-left') > -1) {
 				$scope.svgbox.addClass('svgLeft');
 				v = '5367';
 			} else {
 				return;
 			}
 			tia = setInterval(function () {
 				sentcode(v);
 				console.log('触摸效果:' + v);
 			}, 200);
 		}, false);
 		document.getElementById('svgbox').addEventListener('touchmove', function (e) {
 			event.preventDefault();
 		});
 		document.getElementById('svgbox').addEventListener('touchend', function (e) {
 			$scope.svgbox.removeClass('svgUp');
 			$scope.svgbox.removeClass('svgRight');
 			$scope.svgbox.removeClass('svgBot');
 			$scope.svgbox.removeClass('svgLeft');
 			clearInterval(tia);
 		});

 		// 1.touchstart: // 手指放到屏幕上的时候触发
 		// 2.touchmove: // 手指在屏幕上移动的时候触发
 		// 3.touchend: // 手指从屏幕上拿起的时候触发
 		// 4touchcancel: // 系统取消touch事件的时候触发。至于系统什么时候会取消，不详

 		//数字菜单OK等功能
 		var cst = '';
 		var time
 		$('.J_code').click(function () {
 			clearTimeout(time)
 			var v = $(this).attr('data-keyCode');
 			var e = $(this).attr('data-keyNumber');
 			time = setTimeout(function () {
 				sentcode(v);
 				console.log('单个点击效果:' + v);
 			}, 200);
 			/*if(v>=0&&v<=1){
 				cst+=e;
 				$scope.$apply(function(){
 					$scope.option=cst;
 					console.info($scope.option);
 				});
 					time = setTimeout(function(){
 					cst='';
 					console.info('执行了空');
 					$scope.$apply(function(){
 						$scope.option=cst;
 					});
 				},2000);
 			}*/
 		});


 		/*	var tid;
 			var st='';
 			$('.J_code').on('touchstart', function(e) {
 				var v = $(this).attr('data-keyCode');
 				var e = $(this).attr('data-keyNumber');
 				tid = setInterval(function(){
 					sentcode(v);
 					console.log('连续点击效果:'+v);
 					if(v>=48&&v<=57){
 						st+=e;
 					}
 				},500);
 			});
 			$('.J_code').on('touchmove', function(e) {
 				event.preventDefault();
 			});


 			$('.J_code').on('touchend', function(e) {
 				clearInterval(tid);
 			});*/

 		$scope.showmodel = "default";
 		$scope.shownum = function (v) {
 			$scope.showmodel = v;
 		};
 		$scope.remoteclose = function (v) {
 			$scope.isshowclose = false;
 			sentcode(v)
 		}

 		var winw = window.innerWidth,
 			winh = window.innerHeight;
 		var maxh = winh - window.rem * 1.54;
 		$('#J_svg_box').css('height', maxh);
 		$('#J_touch').css('height', maxh - 20);
 	}
 	return {
 		controller: controller,
 		tpl: tpl
 	};
 });