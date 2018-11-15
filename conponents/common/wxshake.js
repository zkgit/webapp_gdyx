function getCookie(name)
{
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}
var openId = getCookie('openId');
var url1 = webset.base + 'wxtv/shake.json?openId=' + openId; //摇一摇动作触发
var url2 = webset.base + 'wxtv/shakeBack.json?openId=' + openId; //获取节目链接
var url3 = "http://202.91.228.23:83/t2o-adsync/ad/weChat/getLiveChannelAds.do"; //获取直播广告列表
var url4 = "http://202.91.228.23:83/t2o-adsync/ad/weChat/getDemandAds.do"; //获取点播广告链接
var url5 = "http://202.91.228.23:83/t2o-adsync/ad/weChat/getTopPlayerAds.do"; //获取热播广告链接
var defaulturl = webset.base + '#/hotlist';

var audio_male = new Audio();
audio_male.src = webset.base+'audio/male.mp3';
document.body.appendChild(audio_male);
var audio_match = new Audio();
audio_match.src = webset.base+'audio/match.mp3';
document.body.appendChild(audio_match);
var audio_nomatch = new Audio();
audio_nomatch.src = webset.base+'audio/nomatch.mp3';
document.body.appendChild(audio_nomatch);

var img1 = document.createElement('img');
img1.style.position = "absolute";
//img1.style.left="50%";
img1.style.top = "50%";
img1.style.margin = "-195px 0 0 0";
img1.src = "audio/shake.gif";
//document.body.appendChild(img1);

var clock;
var num0 = 0; //摇一摇触发接口1
var num = 0; //节目接口
var state = true;
var num2 = 0; //广告接口
var ifgetad=getCookie('ifgetad')?getCookie('ifgetad'):'0';//标识摇一摇的结果显示节目还是广告

/**********重写jquery get方法**************/
$.get = function(url, data, success, error) {
		if (jQuery.isFunction(data)) {
			error = success;
			success = data;
			data = undefined;
		}
		url = encodeURI(url);
		jQuery.ajax({
			url: url,
			type: "get",
			dataType: "json",
			cache: false,
			data: data,
			success: success,
			error: error
		});
	}
	/**********重写jquery post方法**************/
$.post = function(url, data, success, error) {
	if (jQuery.isFunction(data)) {
		error = success;
		success = data;
		data = undefined;
	}
	url = encodeURI(url);
	jQuery.ajax({
		url: url,
		type: "post",
		dataType: "json",
		data: data,
		success: success,
		error: error
	});
}

function getlist(url) {
	var aQuery = url.split("?"); //取得Get参数
	var aGET = new Array();
	if (aQuery.length > 1) {
		var aBuf = aQuery[1].split("&");
		for (var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
			var aTmp = aBuf[i].split("="); //分离key与Value
			aGET[aTmp[0]] = aTmp[1];
		}
	}
	return aGET;
}

function onShake() {
	document.body.appendChild(img1);
	audio_male.play();
	// 提交请求
	if (state == true) {
		postshake();
	}
	setTimeout(function() {
		document.body.removeChild(img1);
	}, 3000);

}
// ShakeHandler(onShake, 2500);

function postshake() {
	state = false;
	$.post(url1, function(e) {
		console.log('摇一摇触发接口：'+e);
//				 alert('接口1'+JSON.stringify(e));
		if (e.code == 0) {
			state = false;
			setTimeout(function() {
				clearInterval(clock);
				clock = setInterval(getresult, 1000);
			}, 2000);
		} else {
			state = true;
			num0 = num0 + 1;
			if (num0 >= 5) {
				if(getCookie('ifgetad')=="1"){
					setCookie('ifgetad','0');
					//热门广告
					window.location.href = encodeURI(webset.base + '#/ad?shake=shake');
				}else{
					setCookie('ifgetad','1');
					//热播节目
					window.location.href = encodeURI(defaulturl+'?shake=shake');
				}					
				audio_nomatch.play();
			}else{
				postshake();
			}
		}
	})
}

function getresult() {
	$.post(url2, function(e) {
		console.log('获取节目接口：'+e);
		if (e.code == 0) {
			//			alert(url2+'接口2'+JSON.stringify(e));
			state = true;
			clearInterval(clock);
			var data = {
				channelId: getlist(e.url)['cid'] ? getlist(e.url)['cid'] : '',
				type: getlist(e.url)['type'] ? getlist(e.url)['type'] : '',
				videoTitle: getlist(e.url)['videoTitle'] ? getlist(e.url)['videoTitle'] : '',
				videoTypes: getlist(e.url)['videoTypes'] ? getlist(e.url)['videoTypes'] : '',
			}
			if ((data.channelId && data.channelId != "") || (data.videoTitle && data.videoTitle != "" && data.videoTypes && data.videoTypes != "")) {
				if (getCookie('ifgetad')!="1") {
					setCookie('ifgetad','1');
					window.location.href = encodeURI(e.url+'&shake=shake');
					audio_match.play();
				} else {
					setCookie('ifgetad','0');
					getAd(e.url, data);
				}
			} else {
				if (getCookie('ifgetad')!="1") {
					setCookie('ifgetad','1');
					//热播节目
					window.location.href = encodeURI(defaulturl+'?shake=shake');
					audio_nomatch.play();
				} else {
					setCookie('ifgetad','0');
					//热门广告
					window.location.href = encodeURI(webset.base + '#/ad?shake=shake');
					audio_nomatch.play();
				}
			}

		} else {
			num = num + 1;
			if (num >= 3) {
				state = true;
				clearInterval(clock);
//				audio_nomatch.play();
				if (getCookie('ifgetad')!="1") {
					setCookie('ifgetad','1');
					//50%热播节目
					window.location.href = encodeURI(defaulturl+'?shake=shake');
					audio_nomatch.play();
				} else {
					setCookie('ifgetad','0');
					//50%热门广告
					window.location.href = encodeURI(webset.base + '#/ad?shake=shake');
					audio_nomatch.play();
				}
			}else{
				getresult();
			}
		}
	})
}

function getAd(tvurl, data) {
	if (tvurl.indexOf('zb=zb')>-1) {
		getAdfuc(tvurl, data, 'zb');
	} else {
		getAdfuc(tvurl, data, 'db');
	}
}

function getAdfuc(tvurl, data, type) {
	if (type == 'zb' && data.channelId && data.channelId != "") {	
		window.location.href = encodeURI(webset.base + '#/ad?channelId=' + data.channelId+'&shake=shake');
		audio_match.play();
	} else if (type == 'db' && data.videoTitle && data.videoTitle != "" && data.videoTypes && data.videoTypes != "") {		
		window.location.href = encodeURI(webset.base + '#/ad?videoTitle=' + data.videoTitle + '&videoTypes=' + data.videoTypes+'&shake=shake');
		audio_match.play();
	} else {		
		//热门广告
		window.location.href = encodeURI(webset.base + '#/ad?shake=shake');
		audio_nomatch.play();
	}
}

function fRandomBy(under, over) {
	switch (arguments.length) {
		case 1:
			return parseInt(Math.random() * under + 1);
		case 2:
			return parseInt(Math.random() * (over - under + 1) + under);
		default:
			return 0;
	}
}

function ShakeHandler(callback, threshold) {
	callback._threshold = threshold || 800;
	if (ShakeHandler._inited) {
		callbacks.push(callback);
		return;
	}
	if (!window.DeviceMotionEvent) {
		alert('本设备不支持 devicemotion 事件');
		return;
	}
	ShakeHandler._inited = true;
	var callbacks = [];
	var last_update = 0;
	var x = y = z = last_x = last_y = last_z = 0;
	window.addEventListener('devicemotion', function(eventData) {
		var acceleration = eventData.accelerationIncludingGravity;
		var curTime = new Date().getTime();
		if ((curTime - last_update) > 100) {
			var diffTime = curTime - last_update;
			last_update = curTime;
			x = acceleration.x;
			y = acceleration.y;
			z = acceleration.z;
			var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
			for (var n in callbacks) {
				if (speed > callbacks[n]._threshold) {
					callbacks[n]();
					break;
				}
			}
			last_x = x;
			last_y = y;
			last_z = z;
		}
	});
	callbacks.push(callback);
}