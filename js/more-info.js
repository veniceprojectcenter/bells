angular.module('bellsapp').controller('MoreInfoCtrl', ['$scope', '$compile', '$q', 'ckConsole', '$route', '$routeParams', '$location', function($scope, $compile, $q, ckConsole, $route, $routeParams, $location){
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
	haventResizedYet = true;


	$scope.playSound=function(id){
		// grab audio from audio tag with given id:
		var audio = document.getElementById(id);
		audio.currentTime = 0; // reset audio.
		audio.play();
    }

	/// if song is playing pause if paused replay
	$scope.playOrPauseSound=function(id){
		// grab audio from audio tag with given id:
		var audio = document.getElementById(id); 

		if (!audio.paused && audio.currentTime) {
			audio.pause();
		} else {
			audio.currentTime = 0; // reset audio.
			audio.play();
		}
    }

	$scope.pauseSound=function(id){
		var audio = document.getElementById(id); 
    	audio.pause();
    }
	
	$scope.backToMap = function(){
		$location.path('/map');
	};

	$scope.setUpTab = function(){
		setUpTab();
	};	

	$scope.resizeFrames = function(){
		resizeAllFrames();
	};

	$scope.resizeFramesOnce = function(){
		// in order to initialy resize iframes
		if (haventResizedYet) {
			resizeAllFrames();
			haventResizedYet = false;
		}
	};
	
	ckConsole.getExpandedData($route.current.params.itemId).then(function(val){
	  setUpTab();

	  angular.test_item = val;
		$scope.item = val;
		$scope.hasImage = true	;
	});
	ckConsole.getForm($route.current.params.formId).then(function(val){
		$scope.mainForm = val;
	});
	
	var formIdFromType = {};
	$q.all({
		"Bell Tower Page Final": ckConsole.getForm("4a7f84a3-11b6-b459-c55f-1760ca6e1123")
	});
}]);

angular.module('bellsapp').directive('row', function ($compile, sharedProperties) {
    return {
        restrict: 'E',
        scope: {
            item: "="
        },
        link: function (scope, element, attrs) {
        	scope.sharedProperties = sharedProperties;
            var html ='<iframe name="bell tower" id="bell tower" width="100%" height="262" style="visibility:visible" ng-show = "item" src="{{sharedProperties.getImage(item)}}"></iframe>';
            var e =$compile(html)(scope);
            element.replaceWith(e);
        }
    };
});

angular.module('bellsapp').service('sharedProperties', function($timeout) {
    
    return {
        getImage: function(item){
        	if(!item) return;
			var bellCode = item.data['Bell Tower ID'];
			imageFiles = { 'DONA': '/pano_pages/DONA_View.html','FORM': '/pano_pages/FORM_View.html','FRAR': '/pano_pages/FRAR_View.html', 'GERE': '/pano_pages/GERE_View.html', 'GIMA': '/pano_pages/GIMA_View.html','GIOB': '/pano_pages/GIOB_View.html', 'ORTO': '/pano_pages/ORTO_View.html', 'PIET': '/pano_pages/PIET_View.html', 'POLO': '/pano_pages/POLO_View.html','RAFF1': '/pano_pages/RAFF_View.html'};
			if(typeof imageFiles[bellCode] != 'undefined'){
				var panorama = imageFiles[bellCode];
				return imageFiles[bellCode];
			}
			else{
				return;
			}
	}
}});

function setUpTab() {
	$('.menu .item')
  		.tab()
	;

	resizeBellFrame();

	jQuery.event.add(window, "load", resizeAllFrames);
	jQuery.event.add(window, "resize", resizeAllFrames);
}

function resizeAllFrames() {
	resizeFluidFrame();
	resizeBellFrame();
}

function resizeFluidFrame() {
	var h = $("#fluid-frame-reference").height();
    var w = $("#fluid-frame-reference").width();
    $(".fluid-frame").css('width', w );
    $(".fluid-frame").css('height', (w) * 0.56);
}

function resizeBellFrame() {
    var h = $("#bell-frame-reference").height();
    var w = $("#bell-frame-reference").width();
    $(".bell-model").css('width', w );
    $(".bell-model").css('height', (w) * 1.3);
}
