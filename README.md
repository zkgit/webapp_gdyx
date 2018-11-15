微信webapp架构:requirejs+angular+angular-route（+jq）

```
1.包括加载速度、渲染效率
2.低耦合高内聚
3.可扩展
```


项目：

```
1.requirejs-text 依赖html加载
2.main.js主要配置requirejs----其中urlArgs，增加版本号
3.controller.$inject，显示注入
4.fun.js一些数据处理，滑动海报、懒加载、存取cookies,url截取、ajax等···
5.config.js配置域名和api地址
6.过滤器和自定义指令，处理数据和业务问题
7.UI使用的是mui、weui

8.Nginx本地代理解决跨域问题
9.适配参考使用的是手淘的rem.js
```





```
define(['angular', 'text!modules/TVlive/detail.html', 'size', 'fun'], 

function(angular, tpl) {
	controller.$inject = ['$scope', '$rootScope', '$http'];
	function controller($scope, $rootScope, $http) {
			
	}
	return {
		controller: controller,
		tpl: tpl
	};
});
```