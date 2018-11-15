function MM_swapImage() {
    var i, j = 0,
        x, a = MM_swapImage.arguments;
    document.MM_sr = new Array;
    for (i = 0; i < (a.length - 2); i += 3)
        if ((x = MM_findObj(a[i])) != null) {
            document.MM_sr[j++] = x;
            if (!x.oSrc) x.oSrc = x.src;
            x.src = a[i + 2];
        }
}

function MM_swapImgRestore() {
    var i, x, a = document.MM_sr;
    for (i = 0; a && i < a.length && (x = a[i]) && x.oSrc; i++) x.src = x.oSrc;
}

function MM_findObj(n, d) {
    var p, i, x;
    if (!d) d = document;
    if ((p = n.indexOf("?")) > 0 && parent.frames.length) {
        d = parent.frames[n.substring(p + 1)].document;
        n = n.substring(0, p);
    }
    if (!(x = d[n]) && d.all) x = d.all[n];
    for (i = 0; !x && i < d.forms.length; i++) x = d.forms[i][n];
    for (i = 0; !x && d.layers && i < d.layers.length; i++) x = MM_findObj(n, d.layers[i].document);
    if (!x && d.getElementById) x = d.getElementById(n);
    return x;
}

function MM_preloadImages() {
    var d = document;
    if (d.images) {
        if (!d.MM_p) d.MM_p = new Array();
        var i, j = d.MM_p.length,
            a = MM_preloadImages.arguments;
        for (i = 0; i < a.length; i++)
            if (a[i].indexOf("#") != 0) {
                d.MM_p[j] = new Image;
                d.MM_p[j++].src = a[i];
            }
    }
}
// iPanel.defaultFocusColor = '#FFFF6F';
// iPanel.focusWidth = "0";

function _G_B(id) {
    if (id == '' || id == null) {
        return false;
    } else {
        return document.getElementById(id);
    }
}

function blockDiv(b) {
    if (_G_B(b)) {
        _G_B(b).style.display = "block";
    }
}

function noneDiv(n) {
    if (_G_B(n)) {
        _G_B(n).style.display = "none";
    }
}

function hiddenDiv(h) {
    if (_G_B(h)) {
        _G_B(h).style.visibility = "hidden";
    }
}

function visibleDiv(v) {
    if (_G_B(v)) {
        _G_B(v).style.visibility = "visible";
    }
}

function nbDiv(n, b) {
    if (_G_B(n)) {
        _G_B(n).style.display = "none";
    }
    if (_G_B(b)) {
        _G_B(b).style.display = "block";
    }
}

function hvDiv(h, v) {
    if (_G_B(h)) {
        _G_B(h).style.visibility = "hidden";
    }
    if (_G_B(v)) {
        _G_B(v).style.visibility = "visible";
    }
}
// 截取后两位
function _interceptTwo(str) {
    return str.substring(str.length - 2, str.length);
}

//写cookies
function setCookie(name, value) {
    var Days = 3;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + ";path=/";
};
//读取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))
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
    if (cval != null) document.cookie = name + "=" + cval + ";path=/;expires=" + exp.toGMTString();
}


function GetRequest(url) {
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}


function getCpid(str){
    if(str=='frame129'||str=='frame224'){
        return 2
    }else if(str=='frame205'||str=='frame68'||str=='frame57'){
        return 1
    }
}
