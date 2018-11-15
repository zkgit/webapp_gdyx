'use strict';
(function (win) {
	//配置baseUrl
	var baseUrl = document.getElementById('main').getAttribute('data-baseurl');
	/*
	 * 文件依赖
	 */
	var config = {
		baseUrl: baseUrl, //依赖相对路径
		urlArgs: 'v=' + ng_version,
		map: {
			'*': {
				'css': 'conponents/common/css.min'
			}
		},
		paths: { //如果某个前缀的依赖不是按照baseUrl拼接这么简单，就需要在这里指出
			angular: ['https://cdn.bootcss.com/angular.js/1.4.2/angular.min'],
			'angular-route': ['https://cdn.bootcss.com/angular.js/1.4.2/angular-route.js'],
			'angular-ui-router': 'conponents/common/angular-ui-router.min',
			text: 'conponents/common/text', //用于requirejs导入html类型的依赖
			iconfig: 'config/config',
			fun: 'js/fun',
			filter: 'conponents/filters/filter',
			size: 'js/size',
			jquery: ['https://cdn.bootcss.com/jquery/2.2.0/jquery.min'],
			wxshare: 'conponents/common/wxshare.min',
			cookie: ['https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie'],
			slide: ['https://cdn.bootcss.com/Swiper/3.4.2/js/swiper.min'],
			wxshake: 'conponents/common/wxshake',
			lazy: 'conponents/common/lazy',
			infiniteScroll:['https://cdn.bootcss.com/ngInfiniteScroll/1.3.0/ng-infinite-scroll.min'],
			inngScroll:['https://cdn.bootcss.com/angular-scroll/1.0.2/angular-scroll.min'],
			ngWebSocket:['https://cdn.bootcss.com/angular-websocket/2.0.1/angular-websocket.min'],
			ws: 'js/ws',
		},
		waitSeconds: 0,
		shim: {
			angular: {
				deps: ['css!style/base', 'css!style/basic', 'css!style/widget', 'css!style/main', 'css!style/sprite', 'css!style/font/iconfont', 'fun'],
				exports: 'angular'
			},
			'angular-ui-router': {
				deps: ['angular'] //依赖什么模块
			},
			iconfig: {
				deps: ['css!https://cdn.bootcss.com/weui/1.1.2/style/weui.min.css', 'css!style/mui.min'],
				exports: 'iconfig'
			},
			size: {
				exports: 'size'
			},
			fun: {
				deps: ['jquery'],
				exports: 'fun'
			},
			wxshare: {
				deps: ['iconfig', 'cookie'],
				exports: 'wxshare'
			},
			wxshake: {
				deps: ['iconfig', 'cookie'],
				exports: 'wxshake'
			},
			filter: {
				exports: 'filter'
			},
			slide: {
				deps: ['jquery', 'css!https://cdn.bootcss.com/Swiper/3.4.2/css/swiper.min.css'],
				exports: 'slide'
			},
			lazy:{
				deps:['angular'],
				exports:'lazy'
			},
			infiniteScroll:{
				deps:['angular','jquery'],
				exports:'infiniteScroll'
			},
			inngScroll:{
				deps:['angular'],
				exports:'inngScroll'
			},
			ngWebSocket:{
				deps:['angular'],
				exports:'ngWebSocket'
			}
		}
	};

	require.config(config);

	require(['angular', 'iconfig', 'js/router'], function (angular) {
		angular.bootstrap(document, ['webapp']);
	});

})(window);