var app = angular.module('bellsapp', ['uiSlider', 'ckServices', 'ngRoute', 'ngAnimate', 'leaflet-directive', 'ngLoadScript'])
	.config(function($routeProvider, $locationProvider, $rootScopeProvider, $sceDelegateProvider) {
		$routeProvider.when('/map', {
			templateUrl: 'views/map.html',
			controller: 'MapCtrl'
		});
    $routeProvider.when('/about', {
      templateUrl: 'views/about.html',
    });
		$routeProvider.when('/moreInfo/:formId/:itemId', {
			templateUrl: 'views/moreInfo.html',
			controller: 'MoreInfoCtrl'
		});
		$routeProvider.otherwise({
			redirectTo: '/map'
		});
		$rootScopeProvider.digestTtl(30);
		$sceDelegateProvider.resourceUrlWhitelist([
    		// Allow same origin resource loads.
    		'self',
    		// Allow loading from our assets domain.  Notice the difference between * and **.
    		'https://sketchfab.com/models/**',
    		'https://www.youtube.com/**',
    		'https://drive.google.com/**',
    		'https://s3.amazonaws.com/cityknowledge/**',
    		'https://vpc-bells.s3.amazonaws.com/**'
  		]);

	})
	.run(['$location', '$rootScope', 'ckConsole', function($location, $rootScope, ckConsole) {
		$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
			if(current.$$route){
				switch(current.$$route.controller){
				case 'MapCtrl':
					document.title = "Venice Bells Map";
					break;
				case 'MoreInfoCtrl':
					ckConsole.getData(current.params.itemId).then(function(item){
						document.title = item.data['Common name'];
					});
					break;
				default:
				document.title = "Venice Bells";
					break;
				}
			}
		});
	}])
	.directive('loadScript', [function() {
		console.log('load script');
	    return function(scope, element, attrs) {
	        angular.element('<script async src="https://theta360.com/widgets.js" charset="utf-8"></script>').appendTo(element);
	    }
	}]);

app.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

/*global angular */
(function (ng) {
  'use strict';
 
  var app = ng.module('ngLoadScript', []);

  app.directive('script', function() {
    return {
      restrict: 'E',
      scope: false,
      link: function(scope, elem, attr) 
      {
        if (attr.type==='text/javascript-lazy') 
        {
          var s = document.createElement("script");
          s.type = "text/javascript";                
          var src = elem.attr('src');
          if(src!==undefined)
          {
              s.src = src;
          }
          else
          {
              var code = elem.text();
              s.text = code;
          }
          document.head.appendChild(s);
          elem.remove();
        }
      }
    };
  });
}(angular));