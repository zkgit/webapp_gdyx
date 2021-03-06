define(['angular', 'size', 'fun', 'slide'], function (angular, tpl) {
	controller.$inject = ['$scope', '$http', '$rootScope', '$location'];

	function controller($scope, $http, $rootScope, $location) {
		$scope._config = _modules_config;
			
		$scope.openId = getCookie('openId');
		$scope.boxId = getCookie('boxId');
		var swiper = new Swiper('.swiper-container', {
			slidesPerView: 1.1,
			spaceBetween: 10,
			touchRatio: 0.5,
			centeredSlides: true,
			// loop : true,
			observer: true, //修改swiper自己或子元素时，自动初始化swiper
			observeParents: true, //修改swiper的父元素时，自动初始化swiper
			// initialSlide :1,
			onSlideChangeStart: function () {
				$scope.index = swiper.activeIndex;
				$scope.$digest();
			}
		});
		
//		var mySwiper = new Swiper('.swiper-container', {
//			observer: true, //修改swiper自己或子元素时，自动初始化swiper
//			observeParents: true, //修改swiper的父元素时，自动初始化swiper
//			pagination: '.swiper-pagination'
//		});
//		$scope.poster = [{
//				image: "http://client.kanketv.com/scrollposter/Index/MB1528803.jpg"
//			},
//			{
//				image: "http://client.kanketv.com/scrollposter/Index/MB1534538.jpg"
//			},
//			{
//				image: "http://client.kanketv.com/scrollposter/Index/MB1534517.jpg"
//			}
//		];
		//海报
		$scope.getBanner = function () {
			$http.post(webset.apiurl + 'home/banner.json', {}).success(function (res) {		
				$scope.poster = res.response.responseBody;
			}); 
		};
		$scope.getBanner();

//		$scope.list = [];
//		$scope.tvlist = [];
//		$scope.gettv = function () {
//			$http.post(webset.apiurl + 'launcher/getViewHistories.json?cpid=' + '123'+ '&boxId=' + $scope.boxId + '&contenttype=', {}).success(function (e) {
//				if (e && e.response.responseHeader.code == 200 && e.response.responseBody.viewlist.length) {
//					$scope.tvlist = e.response.responseBody.viewlist.splice(0, 5);
//					$scope.index = 0;
//				}
//			})
//		}
//
//		$scope.getlist = function () {
//			$http.post(webset.apiurl + 'users/history/list.json?cpid=' + '123'+ '&token=' + '123' + '&pageNo=1&pageSize=5', {}).success(function (e) {
//				if (e && e.response.responseHeader.code == 200 && e.response.responseBody.list.length) {
//					$scope.list = e.response.responseBody.list.splice(0, 5);
//					$scope.index = 0;
//				} else {
//					$scope.gettv()
//				}
//			});
//		};
//		$scope.getlist();

//		$scope.orderStatus = function (ids) {
//			$http.get(webset.apiurl + 'users/videoReserve/status.json?cpid=' + '123'+ '&openId=' + $scope.openId + '&vodCombineId=' + ids, {}).success(function (res) {
//				for (var i = 0; i < res.response.responseBody.length; i++) {
//					$scope.coming[i].isorder = parseInt(res.response.responseBody[i])
//				}
//			})
//		}
//		$scope.be_coming = function () {
//			$http.post(webset.apiurl + 'vodHome/videoReserve.json?cpid=' + '123'+ "&pageNo=1&pageSize=6&openId=" + $scope.openId, {}).success(function (e) {
//				$scope.coming = e.response.responseBody.list;
//				//处理预约
//				var data = e.response.responseBody.list;
//				var arr = [];
//				for (var i = 0; i < data.length; i++) {
//					arr.push(data[i].vodCombineId);
//				}
//				$scope.orderStatus(arr.join(','))
//			});
//		}
//		$scope.be_coming();

		//点播预约
//		$scope.orderdb = function (data) {
//			// $scope.reserve= encodeURIComponent(angular.toJson(data));
//			var orderUrl = webset.apiurl + 'users/videoReserve.json?openId=' + $scope.openId + '&cpid=' + '123'+ '&vodCombineId=' + data.vodCombineId + '&operation=0&title=' + data.title + '&kankeId=' + data.kankeId + '&image=' + data.image + '&edition=' + data.edition + '&videoType=' + data.videoType;
//			if (data.isorder) {
//				$http.post(orderUrl, {}).success(function (e) {
//					console.log('取消预约节目', e);
//					if (e.response.responseHeader.code == 200) {
//						data.isorder = false;
//						$.tipshow({
//							'msg': '取消预约成功',
//							'type': 'success'
//						});
//					} else {
//						$.tipshow({
//							'msg': '取消预约失败',
//							'type': 'warning'
//						});
//					}
//				});
//			} else {
//				orderUrl = webset.apiurl + 'users/videoReserve.json?openId=' + $scope.openId + '&cpid=' + '123'+ '&vodCombineId=' + data.vodCombineId + '&operation=1&title=' + data.title + '&kankeId=' + data.kankeId + '&image=' + data.image + '&edition=' + data.edition + '&videoType=' + data.videoType;
//				$http.post(orderUrl, {}).success(function (e) {
//					console.log('预约节目', e);
//					if (e && e.response.responseHeader.code == 200) {
//						data.isorder = true;
//						$.tipshow({
//							'msg': '预约成功',
//							'type': 'success'
//						});
//					} else {
//						$.tipshow({
//							'msg': '预约失败',
//							'type': 'warning'
//						});
//					}
//				});
//			}
//		};

		$scope.seting = {
			"pageNo_rb": 0,
			"pageNo_zb": 0,
			"pageNo_tj": 0,
			"pageNo_video": 0,
			"pageNo_F": 0,
			"pageNo_T": 0,
			"pageNo_E": 0,
			"pageNo_C": 0,
			"pageNo_D": 0
		};

		$scope.init = function () {
			$scope.current_rb(0);
//			$scope.current_zb(0);
			$scope.current_tj(0);
			
			$scope.recommend_mix_film(0);
			$scope.recommend_mix_tv(0);
			$scope.recommend_mix_arts(0);
			$scope.recommend_mix_anime(0);
//			$scope.recommend_mix_documentary(0);  //记录
		};

		//热播
		$scope.current_rb = function () {
			$http.post(webset.apiurl + 'home/allHot.json?pageNo=' + $scope.seting.pageNo_rb + '&pageSize=6', {}).success(function (res) {		
				$scope.listRB = res.response.responseBody.list;
			}); 
		};
		//直播
		$scope.current_zb = function () {
			$scope.seting.pageNo_T++;
			$http.post(webset.apiurl + 'home/hotLive.json?pageNo=' + $scope.seting.pageNo_zb + '&pageSize=6', {}).success(function (res) {
				$scope.listZB = res.response.responseBody.list;
			});
		};

		//推荐
		$scope.current_tj = function () {
			$scope.seting.pageNo_E++;
			$http.post(webset.apiurl + 'home/allItU.json?pageNo=1&pageSize=6', {}).success(function (res) {
				$scope.listTJ = res.response.responseBody.list;
			});
		};

		//电影
		$scope.recommend_mix_film = function (e) {
			$scope.seting.pageNo_F++;
			$http.post(webset.apiurl + 'home/allHot.json?pageNo=' + $scope.seting.pageNo_F + '&pageSize=6&type=film', {}).success(function (res) {
				var info = res.response.responseBody.list;
				$scope.filmBanner = res.response.responseBody.banners[0];
				if(info.length>6){
					$scope.listInfos_film = info.slice(0,6);
				}else{
					$scope.listInfos_film = info;
				}
			});
		};
		// 电视剧
		$scope.recommend_mix_tv = function (e) {
			$scope.seting.pageNo_T++;
			$http.post(webset.apiurl + 'home/allHot.json?pageNo=' + $scope.seting.pageNo_T + '&pageSize=6&type=tv', {}).success(function (res) {
				var info = res.response.responseBody.list;
				$scope.tvBanner = res.response.responseBody.banners[0];
				if(info.length>6){
					$scope.listInfos_tv = info.slice(0,6);
				}else{
					$scope.listInfos_tv = info;
				}
			});
		};
		//综艺
		$scope.recommend_mix_arts = function (e) {
			$scope.seting.pageNo_E++;
			$http.post(webset.apiurl + 'home/allHot.json?pageNo=' + $scope.seting.pageNo_E + '&pageSize=6&type=arts', {}).success(function (res) {
				var info = res.response.responseBody.list;
				$scope.artsBanner = res.response.responseBody.banners[0];
				if(info.length>6){
					$scope.listInfos_arts = info.slice(0,6);
				}else{
					$scope.listInfos_arts = info;
				}
			});
		};
		//动漫
		$scope.recommend_mix_anime = function (e) {
			$scope.seting.pageNo_C++;
			$http.post(webset.apiurl + 'home/allHot.json?pageNo=' + $scope.seting.pageNo_C + '&pageSize=6&type=anime', {}).success(function (res) {
				var info = res.response.responseBody.list;
				$scope.animeBanner = res.response.responseBody.banners[0];
				if(info.length>6){
					$scope.listInfos_anime = info.slice(0,6);
				}else{
					$scope.listInfos_anime = info;
				}
			});
		};
		//纪录片
		$scope.recommend_mix_documentary = function (e) {
			$scope.seting.pageNo_D++;
			$http.post(webset.apiurl + 'home/allHot.json?pageNo=' + $scope.seting.pageNo_D + '&pageSize=6&type=documentary', {}).success(function (res) {
				var info = (res.response.responseBody.list).concat(res.response.responseBody.list);
				if(info.length>6){
					$scope.classify_documentary = info.slice(0,6);
				}else{
					$scope.classify_documentary = info;
				}
			});
		};
		

		$scope.init();
		
		$scope.changeInfo = function(str){
			if(str=='rb'){
				if($scope.listRB.length<6){
					$scope.seting.pageNo_rb=0;
					$scope.current_rb();
				}else{
					$scope.seting.pageNo_rb++;
					$scope.current_rb();
				}
			}else if(str=='zb'){
				if($scope.listZB.length<6){
					$scope.seting.pageNo_zb=0;
					$scope.current_zb();
				}else{
					$scope.seting.pageNo_zb++;
					$scope.current_zb();
				}
			}else if(str=='tj'){
				if($scope.listTJ.length<6){
					$scope.seting.pageNo_tj=0;
					$scope.current_tj();
				}else{
					$scope.seting.pageNo_tj++;
					$scope.current_tj();
				}
			}else if(str=='tv'){
				if($scope.listTJ.length<6){
					$scope.seting.pageNo_T=0;
					$scope.recommend_mix_tv();
				}else{
					$scope.seting.pageNo_T++;
					$scope.recommend_mix_tv();
				}
			}else if(str=='film'){
				if($scope.listTJ.length<6){
					$scope.seting.pageNo_F=0;
					$scope.recommend_mix_film();
				}else{
					$scope.seting.pageNo_F++;
					$scope.recommend_mix_film();
				}
			}else if(str=='zy'){
				if($scope.listTJ.length<6){
					$scope.seting.pageNo_E=0;
					$scope.recommend_mix_arts();
				}else{
					$scope.seting.pageNo_E++;
					$scope.recommend_mix_arts();
				}
			}else if(str=='dm'){
				if($scope.listTJ.length<6){
					$scope.seting.pageNo_C=0;
					$scope.recommend_mix_anime();
				}else{
					$scope.seting.pageNo_C++;
					$scope.recommend_mix_anime();
				}
			}
				
		}	

	}
	return {
		controller: controller,
		tpl: tpl
	};
});