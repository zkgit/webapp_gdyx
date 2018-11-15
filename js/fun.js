window.noscroll = function(event) {
	event.preventDefault();
}
/**
 *扩展插件
 */
;
(function(jQuery, window, document, undefined) {
	// 静态插件
	jQuery.extend({
		tipshow: function(options){
			var msg = options.msg;
			var type = options.type ? options.type : 'info';
			var ico = options.ico ? options.ico : 'info-circle';
			var lineheight=options.lineheight?'.24rem':'.7rem'
			if(type=='black'){
				var str = '<div class="tippop back ptf z11 fs12 wp100 alic cff">' + msg + '</div>';
			}else{
				var str = '<div class="tippop ptf z11 fs12 wp100 alic"><div class="dsilb fs12 text ' + type + '"  style="line-height:'+lineheight+'"><div class="lh20"><i class="fa fa-' + ico + '"></i>' + msg + '</div></div></div>';
			}

			var pop = jQuery('body').append(str).find('.tippop');
			setTimeout(function() {
				pop.animate({
					'opacity': 0
				}, 600, function() {
					pop.remove();
					if(options.callback) {
						options.callback();
					}
				});
			}, 1500);
		},playCheckTipshow: function(options) {
			var msg = options.msg;
			var type = options.type ? options.type : 'info';
			var ico = options.ico ? options.ico : 'info-circle';
			var str = '<div class="tippops ptf z10 fs12 wp100 alic"><div class="dsilb fs12 text ' + type + '"><div class="lh20"><i class="fa fa-' + ico + '"></i>' + msg + '</div></div></div>';
			var pop = jQuery('body').append(str).find('.tippops');
			setTimeout(function() {
				pop.animate({
					'opacity': 0
				}, 600, function() {
					pop.remove();
					if(options.callback) {
						options.callback();
					}
				});
			}, 1500);
		},numshow: function(options) {
			var str = '<div class="remotetip ptf z10 wp100 alic"><div class="dsilb fs26  info"><div><i></i>' + options + '</div></div></div>';
			var pop = jQuery('body').append(str).find('.remotetip');
			setTimeout(function() {
				pop.animate({
					'opacity': 0
				}, 600, function() {
					pop.remove();
				});
			}, 1500);
		},
		/*going: function(text) {
			text = text ? text : '正在加载...···';
			jQuery('body').append('<div class="ptf hp100 wp100 z10 cff" id="J_going" style="background:rgba(0,0,0,0.8);"><p class="pta wp100 alic fs14" style="margin-top:-8px; top:50%;">' + text + '</p></div>');
		},*/
		stopgo: function() {
			jQuery('#J_going').remove();
		},
		//  判断机型
		isAnd: function() {
			var u = window.navigator.userAgent;
			if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
				return 1;
			} else {
				return 0;
			}
		},
		noscroll: function() {
			document.body.addEventListener('touchmove', noscroll, false);
		},
		backscroll: function() {
			document.body.removeEventListener("touchmove", noscroll, false);
		}
	});
})(jQuery, window, document);

function GetRequest() {
	var url = window.location.hash;
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var start = url.indexOf("?"),
			str = url.substr(start + 1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); //匹配目标参数
	if(r != null) return unescape(r[2]);
	return null; //返回参数值
}

function getvtype(str) {
	if(str == "M") {
		return 'film';
	} else if(str == "T") {
		return 'tv';
	} else if(str == "E") {
		return 'arts';
	} else if(str == "C") {
		return 'anime';
	} else if(str == "D") {
		return 'documentary';
	} else {
		return str;
	}
}

function backvurl(arr) {
	var len = arr.length,
		p = ['流畅', '标清', '高清', '超清'],
		src = '';
	var narr = [];
	for(var i = 0; i < len; i++) {
		narr = narr.concat(arr[i]);
	}
	var len = narr.length;

	outerloop:
		for(var i = 0; i < 4; i++) {
			for(var ii = 0; ii < len; ii++) {
				if(narr[ii].high == p[i]) {
					src = narr[ii].iphone;
					break outerloop;
				}
			}
		}
	return src;
}

function aftertime(strattime) {
	var st = new Date(strattime.replace(/-/ig, '/')).getTime(),
		nt = new Date().getTime()
	// et = new Date(time.replace(/-/ig, '/')).getTime();
	if(st >= nt) {
		return true;
	} else {
		return false;
	}
}

// 底部滚动加载
// var botscroll = function(num,shortof){
// 	// num 页面底部距屏幕底部多少距离开始加重
// 	// shortof 自由配置增减距离项
// 	var _this = this;
// 	_this.timer = null;
// 	_this.isc = true; // 是否已加载完毕
// 	_this.fisrt = false; //首屏加载
// 	_this.bdh = $('.html').height();
// 	_this.winh = window.innerHeight;
// 	_this.max = _this.bdh-shortof-_this.winh-num;
// 	_this.isoff = false;
// 	_this.setmax = function(newh){
// 		_this.max = newh-shortof-_this.winh-num;
// 	}
// 	$(window).scroll(function(){
// 		if(_this.isoff){return false;}
// 		clearTimeout(_this.timer);
// 		_this.timer = setTimeout(function(){
// 			var st = $(window).scrollTop();
// 			if(_this.max<=st && _this.isc == true){
// 				_this.isc = false;
// 				if(_this.fisrt){
// 					_this.getbot();
// 				}
// 			}
// 		},10);
// 	});
// 	$(window).trigger("scroll");
// 	return this;
// }

// var divScroll = function(options) {
// 	// elm：对象
// 	// short: 底部距离多少加载
// 	var _this = this;
// 	this.opts = options;
// 	this.seting();
// 	this.elm.addEventListener('touchstart', function(event) {
// 		var touches = event.targetTouches;
// 		_this.fy = touches[0].pageY;
// 	}, false)
// 	this.elm.addEventListener('touchmove', function(event) {
// 		var touches = event.targetTouches;
// 		_this.ly = touches[0].pageY;
// 		var cy = _this.fy - _this.ly;
// 		_this.elm.scrollTop = _this.ofy + cy;
// 		event.preventDefault();
// 	}, false)
// 	this.elm.addEventListener('touchend', function(event) {
// 		_this.ofy = _this.ofy + _this.fy - _this.ly;
// 		if(_this.ofy <= 0) {
// 			_this.ofy = 0;
// 			_this.elm.scrollTop = _this.ofy;
// 		} else if(_this.ofy >= _this.inh - _this.h) {
// 			_this.ofy = _this.inh - _this.h;
// 			_this.elm.scrollTop = _this.ofy;
// 		}
// 		this.fy = this.ly = 0;
// 	}, false)

// 	return this;
// }
// divScroll.prototype.seting = function() {
// 	var opts = this.opts;
// 	this.elm = opts.elm;
// 	this.h = opts.outh;
// 	this.inh = opts.inh;
// 	this.fy = this.ly = 0;
// 	this.ofy = this.elm.scrollTop;
// }
// divScroll.prototype.seth = function() {
// 	this.inh = this.elm.children[0].clientHeight;
// };

// function setCookie(name, value) {
// 	var exp = new Date();
// 	exp.setTime(exp.getTime() +29 * 60 * 1000);
// 	document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + ";path=/";
// }

//写cookies+时间
function setCookie_Time(name,value,time) {
	var strsec = getsec(time);
	var exp = new Date();
	exp.setTime(exp.getTime() + strsec*1);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
};
function getsec(str) {
	var str1=str.substring(1,str.length)*1;
	var str2=str.substring(0,1);
	if (str2=="s") {
		return str1*1000;
	} else if (str2=="h") {
		return str1*60*60*1000;
	} else if (str2=="d") {
		return str1*24*60*60*1000;
	}
};

//写cookies
function setCookie(name, value) {
 var Days = 30;
 var exp = new Date();
 exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
 document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + ";path=/";
 };
//读取cookies
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

	if(arr = document.cookie.match(reg))
	//return unescape(arr[2]);
		return decodeURI(arr[2]);
	else
		return null;
}
//删除cookies
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if(cval != null)
		document.cookie = name + "=" + cval + ";path=/;expires=" + exp.toGMTString();
}

$.query = function() {
	var aQuery = window.location.href.split("?"); //取得Get参数
	var aGET = new Array();
	if(aQuery.length > 1) {
		var aBuf = aQuery[1].split("&");
		for(var i = 0, iLoop = aBuf.length; i < iLoop; i++) {
			var aTmp = aBuf[i].split("="); //分离key与Value
			aGET[aTmp[0]] = aTmp[1];
		}
	}
	return aGET;
}

var swipe = function(options) {
	this.opt = options;
	this.setting();
	this.bindevent();
}
swipe.prototype.setting = function() {
	var _this = this;
	var opt = this.opt;
	var outer = opt.elm,
		ls = outer.getElementsByClassName('lis'),
		len = ls.length,
		str = '';
	this.winw = window.innerWidth;
	this.len=1-len;
	for(var i = 0; i < len; i++) {
		ls[i].style.cssText = 'transform:translateX(' + (i * 100) + '%);-webkit-transform:translateX(' + (i * 100) + '%);';
		if(i<len-2){
			str += '<span class="po"></span>';
		}
	}
	outer.getElementsByClassName('poter')[0].innerHTML = str;
	this.fx = this.lx = this.ox = 0;
	this.st=0;
	this.poters = outer.getElementsByClassName('po');
	this.poter();
}
swipe.prototype.bindevent = function() {
	var _this = this;
	this.elm = _this.opt.elm;
	this.outer = this.elm.getElementsByClassName('swipe-box')[0];
	_this.outer.style.cssText = 'transform:translateX(' + -0.85* _this.winw + 'px);-webkit-transform:translateX(' + -0.85* _this.winw + 'px);';
	this.elm.addEventListener('touchstart', function(event) {
		event.stopPropagation();
		var touches = event.targetTouches;
		_this.fx = touches[0].pageX;
	}, false)
	this.elm.addEventListener('touchmove', function(event) {
		event.stopPropagation();
		var touches = event.targetTouches;
		_this.lx = touches[0].pageX;
		_this.ox = _this.lx - _this.fx;
		_this.outer.style.cssText = 'transform:translateX(' + (_this.ox +(_this.st-1) * _this.winw*0.9) + 'px);-webkit-transform:translateX(' + (_this.ox + (_this.st-1)* _this.winw*0.9) + 'px);';
		event.preventDefault();
	}, false)
	this.elm.addEventListener('touchend', function(event) {
		event.stopPropagation();
		if(Math.abs(_this.ox) <= 50) {
			if(_this.st==1){
				_this.outer.style.cssText = '-webkit-transform 300ms; transition:transform 300ms;transform:translateX(' + ((_this.st-1)* _this.winw*0.85) + 'px);-webkit-transform:translateX(' + ((_this.st-1)* _this.winw*0.85) + 'px);';
			}else if(_this.st==_this.len+1){
				_this.outer.style.cssText = '-webkit-transform 300ms; transition:transform 300ms;transform:translateX(' + ((_this.st-1+0.1)* _this.winw*0.9) + 'px);-webkit-transform:translateX(' + ((_this.st-1+0.1)* _this.winw*0.9) + 'px);';
			} else{
				_this.outer.style.cssText = '-webkit-transform 300ms; transition:transform 300ms;transform:translateX(' + ((_this.st-1+0.05)* _this.winw*0.9) + 'px);-webkit-transform:translateX(' + ((_this.st-1+0.05)* _this.winw*0.9) + 'px);';
			}

		} else {
			_this.ox > 0 ? _this.st++ : _this.st--;
			_this.st <= _this.len? _this.st = _this.len : '';
			if(_this.st==1){
				_this.outer.style.cssText = '-webkit-transform 300ms; transition:transform 300ms;transform:translateX(' + ((_this.st-1)* _this.winw*0.85) + 'px);-webkit-transform:translateX(' + ((_this.st-1)* _this.winw*0.85) + 'px);';
				_this.st = _this.len+_this.st+1;
			}else if(_this.st==_this.len+1){

				_this.outer.style.cssText = '-webkit-transform 300ms; transition:transform 300ms;transform:translateX(' + ((_this.st-1+0.1)* _this.winw*0.9) + 'px);-webkit-transform:translateX(' + ((_this.st-1+0.1)* _this.winw*0.9) + 'px);';
				_this.st=0;
			} else{
				_this.outer.style.cssText = '-webkit-transform 300ms; transition:transform 300ms;transform:translateX(' + ((_this.st-1+0.05)* _this.winw*0.9) + 'px);-webkit-transform:translateX(' + ((_this.st-1+0.05)* _this.winw*0.9) + 'px);';
			}
		}
		_this.fx = _this.lx = _this.ox = 0;
		_this.poter();
	}, false)
	//监听li 当移动到两端的li时  瞬间移回
	this.outer.addEventListener('transitionend',function () {
		if((_this.st==_this.len+1)||(_this.st==0)){
			_this.st=0;
			_this.outer.style.cssText = 'transform:translateX(' + -0.85* _this.winw + 'px);-webkit-transform:translateX(' + -0.85* _this.winw + 'px);';
		}
		if((_this.st==1)||(_this.st==_this.len+2)){
			_this.st = _this.len+2;
			_this.outer.style.cssText = 'transform:translateX(' + ((_this.st-1+0.05)* _this.winw*0.9) + 'px);-webkit-transform:translateX(' + ((_this.st-1+0.05)* _this.winw*0.9) + 'px);';
		}
	},false);
}
swipe.prototype.poter = function() {
	var len = this.poters.length,
		ls = this.poters;
	for(var i = 0; i < len; i++) {
		-this.st == i ? ls[i].setAttribute('class', 'po active') : ls[i].setAttribute('class', 'po');
	}
}

// 懒加载
// var lazyload = function(option) {
// 	function bindappear() { // 绑定事件
// 		_this.imgs.each(function(i, n) {
// 			var self = $(this);
// 			if(self.data('loaded') != 1 && self.attr(" animate-visible="true"  lazy-src")) {
// 				self.one("appear", function() {
// 					var img = new Image,
// 						src = self.attr(" animate-visible="true"  lazy-src");
// 					img.src = src;
// 					img.onload = function() {
// 						self.hide().attr("src", src).removeClass('lazy').fadeIn();
// 					}
// 					img.onerror = function() {
// 						self.hide().attr("src", self.attr('error')).removeClass('lazy').fadeIn();
// 					}
// 				});
// 				self.data('loaded', 1);
// 			}
// 		});
// 	}

// 	function setarr() { // 重置数组
// 		_this.srcarr = [];
// 		for(var i = 0; i < _this.imgs.length; i++) {
// 			_this.srcarr.push(_this.imgs.eq(i).offset().top);
// 			_this.imgs.eq(i).loaded = true;
// 		}
// 	}
// 	var _this = this;
// 	_this.imgs = $(option.elm).find(option.class);
// 	bindappear();
// 	_this.srcarr = [];
// 	_this.isoff = false;
// 	_this.winh = window.innerHeight;
// 	setarr();

// 	_this.setlazy = function(imgs) { // 抛出的图片加载事件
// 		_this.imgs = imgs;
// 		setarr();
// 		bindappear();
// 		$(window).trigger("scroll");
// 	}

// 	_this.timer = null;

// 	$(window).scroll(function(){
// 		clearTimeout(_this.timer);
// 		if(_this.isoff) {
// 			return false;
// 		}
// 		_this.timer = setTimeout(function() {
// 			var scrollTop = $(window).scrollTop();
// 			for(var i = 0; i < _this.srcarr.length; i++) {
// 				if(_this.srcarr[i] > 0 && _this.srcarr[i] <= (scrollTop + _this.winh + option.outbot)) {
// 					_this.imgs.eq(i).trigger("appear");
// 					_this.srcarr[i] = -1;
// 				}
// 			}
// 		}, 10);
// 	});
// 	$(window).trigger("scroll");
// 	return this;
// }

// 局部滚动条懒加载// 局部滚动条懒加载
// var partlazyload = function(option) {
// 	function bindappear() { // 绑定事件
// 		_this.imgs.each(function(i, n) {
// 			var self = $(this);
// 			if(self.data('loaded') != 1 && self.attr(" animate-visible="true"  lazy-src")) {
// 				self.one("appear", function() {
// 					var img = new Image,
// 						src = self.attr(" animate-visible="true"  lazy-src");
// 					img.src = src;
// 					img.onload = function() {
// 						self.hide().attr("src", src).removeClass('lazy').fadeIn();
// 					}
// 					img.onerror = function() {
// 						self.hide().attr("src", self.attr('error')).removeClass('lazy').fadeIn();
// 					}
// 				});
// 				self.data('loaded', 1);
// 			}
// 		});
// 	}

// 	function setarr() { // 重置数组
// 		_this.srcarr = [];
// 		for(var i = 0; i < _this.imgs.length; i++) {
// 			_this.srcarr.push(_this.imgs.eq(i).offset().top);
// 			_this.imgs.eq(i).loaded = true;
// 		}
// 	}
// 	var _this = this;
// 	_this.imgs = $(option.elm).find(option.class);
// 	bindappear();
// 	_this.srcarr = [];
// 	_this.isoff = false;
// 	_this.winh = window.innerHeight;
// 	setarr();

// 	_this.setlazy = function(imgs) { // 抛出的图片加载事件
// 		_this.imgs = imgs;
// 		setarr();
// 		bindappear();
// 		$(option.elm).trigger("scroll");
// 	}

// 	_this.timer = null;

// 	$(option.elm).scroll(function() {
// 		clearTimeout(_this.timer);
// 		if(_this.isoff) {
// 			return false;
// 		}
// 		_this.timer = setTimeout(function() {
// 			var scrollTop = $(option.elm).scrollTop();
// 			for(var i = 0; i < _this.srcarr.length; i++) {
// 				if(_this.srcarr[i] > 0 && _this.srcarr[i] <= (scrollTop + _this.winh + option.outbot)) {
// 					_this.imgs.eq(i).trigger("appear");
// 					_this.srcarr[i] = -1;
// 				}
// 			}
// 		}, 10);
// 	});
// 	$(option.elm).trigger("scroll");
// 	return this;
// }
// function sentcode(v) {
// 	$.ajax({
// 		url: webset.ctrl + 'control?controlType='+v+'&boxId='+getCookie('boxId'),
// 		data: {},
// 		type: "GET",
// 		dataType: 'json',
// 		success: function(res) {
// 			console.log('sentcode:' + v);
// 		}
// 	});
// }

function goBack() {
	if((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) { // IE
		if(history.length > 0) {
			window.history.go(-1);
		} else {
			window.location.href = webset.base;
		}
	} else { //非IE浏览器
		if(navigator.userAgent.indexOf('Firefox') >= 0 ||
			navigator.userAgent.indexOf('Opera') >= 0 ||
			navigator.userAgent.indexOf('Safari') >= 0 ||
			navigator.userAgent.indexOf('Chrome') >= 0 ||
			navigator.userAgent.indexOf('WebKit') >= 0) {

			if(window.history.length > 1) {
				window.history.go(-1);
			} else {
				window.location.href = webset.base;
			}
		} else { //未知的浏览器
			window.history.go(-1);
		}
	}
}
//n天后的日期
function GetDateStr(AddDayCount) {
	var dd = new Date();
	dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
	var y = dd.getFullYear();
	var m = dd.getMonth() + 1; //获取当前月份的日期
	var d = dd.getDate();
	if(m < 10) {
		m = '0' + m;
	}
	if(d < 10) {
		d = '0' + d;
	}
	return y + "-" + m + "-" + d;
}
//XHR請求
function doAjaxCall(the_request) {
	var request = null;
	if(window.XMLHttpRequest) {
		request = new XMLHttpRequest();
	} else if(window.ActiveXObject) {
		request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if(request) {
		request.open("GET", the_request, true);
		request.onreadystatechange = function() {
			if(request.readyState === 4) {
				if(request.status == 200 || request.status == 0) {
					document.getElementById("vv").innerHTML = request.responseText;
				}
			}
		}
		request.send(null);
	} else {
		alert("error");
	}
}

//iframe高度自适应
function iFrameHeight() {
	var ifm = document.getElementById("iframepage");
	if(ifm.contentDocument) {
		var subWeb = document.frames ? document.frames["iframepage"].document : ifm.contentDocument;
		if(ifm != null && subWeb != null) {
			if(!subWeb.body.scrollHeight || subWeb.body.scrollHeight == 0) {
				$("#iframepage").css('height', ($(window).height() / window.rem - .88) + 'rem');
			} else {
				ifm.height = subWeb.body.scrollHeight;
			}
			//		ifm.height = subWeb.body.scrollHeight;
			//		ifm.width = subWeb.body.scrollWidth;
		}
	} else {
		if(ifm != null) {
			if($("#J_list").height()) {
				$("#iframepage").css('height', $("#J_list").height());
			} else {
				$("#iframepage").css('height', ($(window).height() / window.rem - .88) + 'rem');
			}
		}
	}

}
//获取今日看点时间段
function getperiod() {
	var h = new Date().getHours();
	var t;
	if(h % 2 == 0) t = h < 10 ? '0' + h : h
	else t = h - 1 < 10 ? '0' + (h - 1) : (h - 1)
	return t + ':00'
}
//type对应关系
function ttypes(str) {
	if(str == "film" || str == "电影") {
		return 'F';
	} else if(str == "tv" || str == "电视剧") {
		return 'T';
	} else if(str == "arts" || str == "综艺") {
		return 'E';
	} else if(str == "anime" || str == "动漫") {
		return 'C';
	} else if(str == "documentary" || str == "纪录片") {
		return 'D';
	} else if(str == "新闻") {
		return 'N';
	} else if(str == "体育") {
		return 'SP';
	} else {
		return str;
	}
}

function midtime(strattime, endtime) {
	var date = GetDateStr(0);
	var st = new Date((date + ' ' + strattime).replace(/-/ig, '/')).getTime(),
		nt = new Date().getTime(),
		et = new Date((date + ' ' + endtime).replace(/-/ig, '/')).getTime();
	if(st <= nt && nt <= et) {
		return true;
	} else {
		return false;
	}
}
//动态创建script-完成进入回调
function createScript(url, callback) {
	var oScript = document.createElement('script');
	oScript.type = 'text/javascript';
	oScript.async = true;
	oScript.src = url;
	/*
	 ** script标签的onload和onreadystatechange事件
	 ** IE6/7/8支持onreadystatechange事件
	 ** IE9/10支持onreadystatechange和onload事件
	 ** Firefox/Chrome/Opera支持onload事件
	 */

	// 判断IE8及以下浏览器
	var isIE = !-[1, ];
	if(isIE) {
		alert('IE')
		oScript.onreadystatechange = function() {
			if(this.readyState == 'loaded' || this.readyState == 'complete') {
				callback();
			}
		}
	} else {
		// IE9及以上浏览器，Firefox，Chrome，Opera
		oScript.onload = function() {
			callback();
		}
	}
	document.body.appendChild(oScript);
}
