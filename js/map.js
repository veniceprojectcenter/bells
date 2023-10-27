angular.module('bellsapp').controller('MapCtrl', ['$scope', '$compile', '$q', 'ckConsole', 'ckConsoleMap', '$location', function($scope, $compile, $q, ckConsole, ckConsoleMap, $location){
	var htmlContent = '<span><div ng-include src="\'views/infopopup.html\'"></div></span>';
	var compiledPopup = $compile(htmlContent)($scope);
	$scope.infoPopup = L.popup().setContent(compiledPopup[0]);


	$( document ).ready(function() {
		$('#loadingPanel').css('background-color','rgba(0,0,0,0.5)');
		$('#spinner').spin('large', '#fff');
		
		$scope.map = L.map("map-canvas", {minZoom: 11}).setView([45.436 , 12.334], 14);
		$scope.baseLayer = new L.TileLayer(
			'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			{ attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }
			).addTo($scope.map);
		L.control.scale().addTo($scope.map);
		
		$scope.layerControl = L.control.layers({"Map": $scope.baseLayer}, {}, {collapsed:true}).addTo($scope.map);

		var names = {
			"Bell Tower Page Final": "Data Collected",
		};
		var dataLayer;
		//var conditionLayer;
		var safetyLayer;
		var accessibilityLayer;
		var overallLayer;
		var frameTypeLayer;
		var frameMaterialLayer;
		var sestiereLayer;
		var activeLayer;
		var numLayers = 0;
    
		ckConsoleMap.createMapLayersFromMapData($scope.map, ckConsole.getMap("map-cd4634f6-f5af-249c-0e64-166b7d1ece2d", true), function(groupname, layer){
			layer.on('click touchstart', showInfoBox);
			dataLayer = layer.getLayer();
			$scope.layerControl.addOverlay(dataLayer, names[groupname]);
			
		}, "Data").then(function(map){
			//console.log(map);
			setTimeout(function(){
			  $('label:contains("Data Collected") input[type=checkbox]').click();
			  $('#loadingPanel').hide();
			  $('#spinner').spin(false);
			}, 75);
			activeLayer = "Data Collected";
		});

		// ckConsoleMap.createMapLayersFromMapData($scope.map, ckConsole.getMap("map-cd4634f6-f5af-249c-0e64-166b7d1ece2d", true), function(groupname, layer){
		// 	layer.on('click touchstart', showInfoBox);
		// 	conditionLayer = layer.getLayer();
		// 	$scope.layerControl.addOverlay(conditionLayer, "Condition");
			
		// }, "Rating_Condition").then(function(map){
		// 	//console.log(map);
		// });

		ckConsoleMap.createMapLayersFromMapData($scope.map, ckConsole.getMap("map-cd4634f6-f5af-249c-0e64-166b7d1ece2d", true), function(groupname, layer){
			layer.on('click touchstart', showInfoBox);
			safetyLayer = layer.getLayer();
			$scope.layerControl.addOverlay(safetyLayer, "Safety");
			
		}, "Rating_Safety").then(function(map){
			//console.log(map);
		});

		ckConsoleMap.createMapLayersFromMapData($scope.map, ckConsole.getMap("map-cd4634f6-f5af-249c-0e64-166b7d1ece2d", true), function(groupname, layer){
			layer.on('click touchstart', showInfoBox);
			accessibilityLayer = layer.getLayer();
			$scope.layerControl.addOverlay(accessibilityLayer, "Accessibility");
			
		}, "Rating_Accessibility").then(function(map){
			//console.log(map);
		});

		ckConsoleMap.createMapLayersFromMapData($scope.map, ckConsole.getMap("map-cd4634f6-f5af-249c-0e64-166b7d1ece2d", true), function(groupname, layer){
			layer.on('click touchstart', showInfoBox);
			overallLayer = layer.getLayer();
			$scope.layerControl.addOverlay(overallLayer, "Overall Impression");
			
		}, "Rating_Overall").then(function(map){
			//console.log(map);
		});

		ckConsoleMap.createMapLayersFromMapData($scope.map, ckConsole.getMap("map-cd4634f6-f5af-249c-0e64-166b7d1ece2d", true), function(groupname, layer){
			layer.on('click touchstart', showInfoBox);
			frameTypeLayer = layer.getLayer();
			$scope.layerControl.addOverlay(frameTypeLayer, "Frame type");
			
		}, "Frame type").then(function(map){
			//console.log(map);
		});

		ckConsoleMap.createMapLayersFromMapData($scope.map, ckConsole.getMap("map-cd4634f6-f5af-249c-0e64-166b7d1ece2d", true), function(groupname, layer){
			layer.on('click touchstart', showInfoBox);
			frameMaterialLayer = layer.getLayer();
			$scope.layerControl.addOverlay(frameMaterialLayer, "Frame material");
			
		}, "Frame material").then(function(map){
			//console.log(map);
		});

		ckConsoleMap.createMapLayersFromMapData($scope.map, ckConsole.getMap("map-cd4634f6-f5af-249c-0e64-166b7d1ece2d", true), function(groupname, layer){
			layer.on('click touchstart', showInfoBox);
			sestiereLayer = layer.getLayer();
			$scope.layerControl.addOverlay(sestiereLayer, "Sestiere");
			
		}, "Sestiere").then(function(map){
			//console.log(map);
		});

		var dataLegend = L.control({position: "bottomright"});
		var ratingLegend = L.control({position: "bottomright"});
		var sestiereLegend = L.control({position: "bottomleft"});
		var frameTypeLegend = L.control({position: "bottomright"});
		var frameMaterialLegend = L.control({position: "bottomright"});

		var numConditionsActive = 0;

		$scope.map.on('overlayadd', function(eventLayer){
			// remove the active layer
			if (numLayers > 0) {
				var temp = activeLayer;
				$('label:contains(' + temp + ') input[type=checkbox]').click();
			}
			activeLayer = eventLayer.name;
			numLayers++;

			// add correct layer legend
			switch(true){
				case eventLayer.name ==='Data Collected':
					dataLegend.addTo($scope.map);
					break;
				//case eventLayer.name ==='Condition':
				case eventLayer.name ==='Safety' :
				case eventLayer.name ==='Accessibility' :
				case eventLayer.name ==='Overall Impression' :
					if (numConditionsActive == 0) {
						ratingLegend.addTo($scope.map);
					}
					numConditionsActive++;
					break;
				case eventLayer.name ==='Sestiere':
					sestiereLegend.addTo($scope.map);
					break;
				case eventLayer.name ==='Frame type':
					frameTypeLegend.addTo($scope.map);
					break;
				case eventLayer.name ==='Frame material':
					frameMaterialLegend.addTo($scope.map);
					break;
				default:
					window.alert("System Error: Contact VPC");
					break;

			};
		});

		$scope.map.on('overlayremove', function(eventLayer){
			numLayers--;
			switch(true){
				case eventLayer.name ==='Data Collected':
					$scope.map.removeControl(dataLegend);
					break;
				//case eventLayer.name ==='Condition':
				case eventLayer.name ==='Safety' :
				case eventLayer.name ==='Accessibility' :
				case eventLayer.name ==='Overall Impression' :
					numConditionsActive--;
					if(numConditionsActive == 0)
						$scope.map.removeControl(ratingLegend);
					break;
				case eventLayer.name ==='Sestiere':
					$scope.map.removeControl(sestiereLegend);
					break;
				case eventLayer.name ==='Frame type':
					$scope.map.removeControl(frameTypeLegend);
					break;
				case eventLayer.name ==='Frame material':
					$scope.map.removeControl(frameMaterialLegend);
					break;
				default:
					window.alert("System Error: Contact VPC");
					break;

			};
		});


		
		function showInfoBox(e, member, marker, layer){
			$scope.popupLayer= layer;
			$scope.popupItem = member;
			$scope.$apply();//make sure to update popup before displaying it
			$scope.infoPopup.setLatLng(e.latlng).openOn($scope.map);
		}
		
		$scope.showMoreInfo = function(){
			$location.path('/moreInfo/'+$scope.popupLayer.properties.moreLink.id+'/'+$scope.popupItem.birth_certificate.ckID);
		}
		
		$scope.visitVenipedia = function(){
			var pageTitle = $scope.popupItem.data['Page name'];
			window.open("http://venipedia.org/wiki/index.php?title="+pageTitle);
		}

		$scope.playSound = function(){
			return new Audio($scope.getSound($scope.popupItem)).play();
		}

		$scope.getSound = function(popupItem){
			if(!popupItem) return;
			var bellCode = $scope.popupItem.data['Bell Tower ID'];
			audioFiles = { 'APON': '../Sounds/APONC3_2012_audio_hitonce.mp3', 'BART': '../Sounds/BARTC1_audio.mp3', 'GIMA': '../Sounds/GIMA_2012_C1.mp3','GIOB': '../Sounds/GIOB_2012_C1.mp3', 'MARC': '../Sounds/MARCCC_2012_audio.mp3', 'MICH': '../Sounds/MICHC1_audio.mp3', 'RAFF1': '../Sounds/RAFF_audio.mp3', 'SALV': '../Sounds/SALVC1_audio.mp3', 'STAE': '../Sounds/STAEC1_audio.mp3', 'VIGN': '../Sounds/VIGNCC_audio.mp3'};
			if(typeof audioFiles[bellCode] != 'undefined'){
				return audioFiles[bellCode];
			}
			else{
				return false;
			}
		}


		/* Displays question mark and vpc logo */
			// function createBrandBox(){
			// 	var info = L.control({position: "bottomleft"});
			// 	info.onAdd = function (map) {
			// 		var htmlContent = '<div class="info" style="width:auto;">'+
			// 			'<span ng-click="showAbout()"><img src="bells_icons/about.png" style="cursor:pointer;padding-right:7px;"></span>'+
			// 			'<a href="http://veniceprojectcenter.org" target="_blank"><img src="bells_icons/vpc25logo.png"></a>'+
			// 			'</div>';
			// 		$scope.compiled = $compile(htmlContent)($scope);
			// 		this._content = $scope.compiled[0];
			// 		return this._content;
			// 	};
			// 	return info;
			// }


			function createLegendBox(){
				var info = dataLegend;//L.control({position: "bottomright"});
				info.onAdd = function (map) {
					var htmlContent = '<div style="padding: 6px 8px;font: 14px/16px Arial, Helvetica, sans-serif;background: white;background: rgba(255,255,255,0.9);box-shadow: 0 0 15px rgba(0,0,0,0.2);border-radius: 5px; width: 150px;"class="info"><h4 style="text-align:center;">Data Collected</h4>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_red.png"><span style="vertical-align:middle;margin-left:2px;">Audio and Tour</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_yellow.png"><span style="vertical-align:middle;margin-left:2px;">Tour</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_green.png"><span style="vertical-align:middle;margin-left:2px;">Audio</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_white.png"><span style="vertical-align:middle;margin-left:2px;">Neither</span></div>'+
						'</div>';
					$scope.compiled = $compile(htmlContent)($scope);
					this._content = $scope.compiled[0];
					return this._content;
				};
				return info;
			}

			function createLegendBoxCondition(){
				var info = ratingLegend;//L.control({position: "bottomright"});
				info.onAdd = function (map) {
					var htmlContent = '<div style="padding: 6px 8px;font: 14px/16px Arial, Helvetica, sans-serif;background: white;background: rgba(255,255,255,0.9);box-shadow: 0 0 15px rgba(0,0,0,0.2);border-radius: 5px; width: 150px;"class="info"><h4 style="text-align:center;">Rating</h4>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_green.png"><span style="vertical-align:middle;margin-left:2px;">Excellent</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_yellow-green.png"><span style="vertical-align:middle;margin-left:2px;">Good</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_yellow.png"><span style="vertical-align:middle;margin-left:2px;">Fair</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_orange.png"><span style="vertical-align:middle;margin-left:2px;">Poor</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_red.png"><span style="vertical-align:middle;margin-left:2px;">Very Poor</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_gray.png"><span style="vertical-align:middle;margin-left:2px;">No Data</span></div>'+
						'</div>';
					$scope.compiled = $compile(htmlContent)($scope);
					this._content = $scope.compiled[0];
					return this._content;
				};
				return info;
			}

			function createLegendBoxFrameType(){
				var info = frameTypeLegend;//L.control({position: "bottomright"});
				info.onAdd = function (map) {
					var htmlContent = '<div style="padding: 6px 8px;font: 14px/16px Arial, Helvetica, sans-serif;background: white;background: rgba(255,255,255,0.9);box-shadow: 0 0 15px rgba(0,0,0,0.2);border-radius: 5px; width: 150px;"class="info"><h4 style="text-align:center;">Frame Type</h4>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_yellow.png"><span style="vertical-align:middle;margin-left:2px;">H Frame</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_red.png"><span style="vertical-align:middle;margin-left:2px;">A Frame</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_white.png"><span style="vertical-align:middle;margin-left:2px;">Other</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_gray.png"><span style="vertical-align:middle;margin-left:2px;">No Data</span></div>'+
						'</div>';
					$scope.compiled = $compile(htmlContent)($scope);
					this._content = $scope.compiled[0];
					return this._content;
				};
				return info;
			}

			function createLegendBoxFrameMaterial(){
				var info = frameMaterialLegend;//L.control({position: "bottomright"});
				info.onAdd = function (map) {
					var htmlContent = '<div style="padding: 6px 8px;font: 14px/16px Arial, Helvetica, sans-serif;background: white;background: rgba(255,255,255,0.9);box-shadow: 0 0 15px rgba(0,0,0,0.2);border-radius: 5px; width: 150px;"class="info"><h4 style="text-align:center;">Frame Material</h4>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_green.png"><span style="vertical-align:middle;margin-left:2px;">Wood</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_red.png"><span style="vertical-align:middle;margin-left:2px;">Metal</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_white.png"><span style="vertical-align:middle;margin-left:2px;">Other</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_gray.png"><span style="vertical-align:middle;margin-left:2px;">No Data</span></div>'+
						'</div>';
					$scope.compiled = $compile(htmlContent)($scope);
					this._content = $scope.compiled[0];
					return this._content;
				};
				return info;
			}

			function createLegendBoxSestiere(){
				var info = sestiereLegend;//L.control({position: "bottomright"});
				info.onAdd = function (map) {
					var htmlContent = '<div style="padding: 6px 8px;font: 14px/16px Arial, Helvetica, sans-serif;background: white;background: rgba(255,255,255,0.9);box-shadow: 0 0 15px rgba(0,0,0,0.2);border-radius: 5px; width: 150px;"class="info"><h4 style="text-align:center;">Sestiere</h4>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_yellow.png"><span style="vertical-align:middle;margin-left:2px;">Santa Croce</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_yellow-orange.png"><span style="vertical-align:middle;margin-left:2px;">Sant\'Erasmo</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_orange.png"><span style="vertical-align:middle;margin-left:2px;">Dorsoduro</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_red-orange.png"><span style="vertical-align:middle;margin-left:2px;">Burano</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_red.png"><span style="vertical-align:middle;margin-left:2px;">Cannaregio</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_red-violet.png"><span style="vertical-align:middle;margin-left:2px;">Guidecca</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_violet.png"><span style="vertical-align:middle;margin-left:2px;">San Marco</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_blue-violet.png"><span style="vertical-align:middle;margin-left:2px;">Lido</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_blue.png"><span style="vertical-align:middle;margin-left:2px;">Castello</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_blue-green.png"><span style="vertical-align:middle;margin-left:2px;">Murano</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_green.png"><span style="vertical-align:middle;margin-left:2px;">San Polo</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_yellow-green.png"><span style="vertical-align:middle;margin-left:2px;">Mazzorbo</span></div>'+
									  '<div><img class="legend-icon" src="bells_icons/belltower_white.png"><span style="vertical-align:middle;margin-left:2px;">Other Islands</span></div>'+
						'</div>';
					$scope.compiled = $compile(htmlContent)($scope);
					this._content = $scope.compiled[0];
					return this._content;
				};
				return info;
			}

			$scope.showAbout = function (){
				$('#aboutPanel').show();
			}
			$scope.hideAbout = function (){
				$('#aboutPanel').hide();
			}
			$scope.toAbout = function(){
		    console.log("TO about and beyond!");
		    $location.path("/about");
		  }
//			createBrandBox().addTo($scope.map);
			createLegendBox().addTo($scope.map);
			createLegendBoxCondition().addTo($scope.map);
			createLegendBoxFrameType().addTo($scope.map);
			createLegendBoxFrameMaterial().addTo($scope.map);
			createLegendBoxSestiere().addTo($scope.map);

			$scope.map.removeControl(dataLegend);
			$scope.map.removeControl(ratingLegend);
			$scope.map.removeControl(frameTypeLegend);
			$scope.map.removeControl(frameMaterialLegend);
			$scope.map.removeControl(sestiereLegend);

			$('#aboutPanel').hide();
	});
}]);