
var serverBase="http://zzb.kanketv.com/gdyx-wxtv/";//主域名  ---------上线请更改
var apiServerBase ='http://192.168.11.19/gdyx-api/';//api接口域名----------2.0测试上线请更改

var tempser = "http://zzb.kanketv.com/gdyx-wxtv/";

var webset = {
    base:tempser,
    device:tempser+'tran?DEEPURL='+apiServerBase+'api/v2/user/bind.json',
    ctrl:tempser+'ctrl/',
    apiurl:tempser+'tran?DEEPURL='+apiServerBase+'api/v1/',
    initurl:tempser+'wxtv/init' , //微信初始化获取openid
};
//微信分享
var _wxshare_on=true;
//微信摇一摇
var _wxshake_on=true;

var _modules_config={
    num:4,
    zb_NotShow:false   //默认为false
}

