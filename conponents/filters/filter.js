
	var app = angular.module('webapp', [
		'ngRoute'
	]);
	app.filter(
		'to_trusted', ['$sce', function($sce) {
			return function(text) {
				return $sce.trustAsHtml(text);
			}
		}]
	)
	app.filter(
		'to_wan', ['$sce', function($sce) {
			return function(num) {
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
		'idstrtwo', ['$sce', function($sce) {
			return function(str) {
				return str.toString().substr(2);
			}
		}]
	)
	app.filter(
		"kankeid", [function() {
			return function(str) {
				var t = str.split('_');
				return t[1] ? str.split('_')[1] : undefined;
			}
		}]
	)
	app.filter(
		"time_one", [function() {
			return function(str) {
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
		"euc", [function() {
			return function(str) {
				return encodeURIComponent(str);
			}
		}]
	)
	app.filter(
		"vtype", [function() {
			return function(str) {
				if (str == "M") {
					return 'film';
				} else if (str == "T") {
					return 'tv';
				} else if (str == "E") {
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