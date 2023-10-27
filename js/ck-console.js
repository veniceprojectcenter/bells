angular.module('ckServices', [])

/*******************************************
  CKConsole service
********************************************/
	.service('ckConsole', ['$rootScope', '$q', function($rootScope, $q) {
		this.rootRef = new Firebase('http://cityknowledge.firebaseio.com');
		this.groupsRef = this.rootRef.child('groups');
		this.mapsRef = this.rootRef.child('maps');
		this.dataRef = this.rootRef.child('data');
		this.layersRef = this.rootRef.child('layers');
		this.formsRef = this.rootRef.child('forms');
		
		this.groups = {};
		this.maps = {};
		this.forms = {};
		this.data = {};
		this.expandedData = {};

		/**
		 * @param groupname the name of the group to get
		 * @return AsyncValue<{groupname:<string>,members:<{ckId, memberData}[]>}>
		 */
		this.getGroup = function(groupname){
			var _this = this;
			
			if(this.groups[groupname]){
				return this.groups[groupname];
			}
			else{
				var deferred = $q.defer();
				this.getValue(this.groupsRef, groupname).then(function(firebaseGroupData) {
					var groupData = {
						groupname: groupname,
						members: {}
					}
					deferred.notify({type: 'groupData', groupData: groupData});
					return _this.reduceEntriesAsync(firebaseGroupData.members, function(id){
						return _this.getData(id);
					}).then(function(members){
						groupData.members = members;
						deferred.resolve(groupData);
					}, undefined, function(notification){
						var member = notification.value;
						var memberId = notification.key;
						groupData.members[memberId] = member;
						deferred.notify({type: 'newGroupMember', groupData: groupData, memberId: memberId, member: member});
					});
				});
				return this.groups[groupname] = deferred.promise;
			}
		}
		
		/**
		 * @param formId the id of the form
		 * @return AsyncValue<formData>
		 */
		this.getForm = function(formId){
			if(this.forms[formId]){
				return this.forms[formId];
			}
			else{
				return this.forms[formId] = this.getValue(this.formsRef, formId);
			}
		}
		
		/**
		 * @param dataId the id of the form
		 * @return AsyncValue<data>
		 */
		this.getData = function(dataId){
			if(this.data[dataId]){
				return this.data[dataId];
			}
			else{
				return this.data[dataId] = this.getValue(this.dataRef, dataId);
			}
		}
		
		this.isReferenceSubgroup = function (propertyValue){
			if(!(propertyValue instanceof Object))
				return false;
			for(id in propertyValue){
				if (propertyValue.hasOwnProperty(id)) {
					var val = propertyValue[id];
					if(typeof val != 'string' || id!=val)
						return false;
				}
			}
			return true;
		};
		
		/**
		 * @param dataId the id of the form
		 * @return AsyncValue<data>
		 */
		this.getExpandedData = function(dataId){
			if(this.expandedData[dataId]){
				return this.expandedData[dataId];
			}
			else{
				var _this = this;
				return this.expandedData[dataId] = this.getData(dataId).then(function(baseData){
					var extendedData = $.extend(true, {}, baseData);//deep copy
					var expansions = [];
					for(propertyGroupId in extendedData){
						if (extendedData.hasOwnProperty(propertyGroupId)) {
							var propertyGroup = extendedData[propertyGroupId];
							for(propertyId in propertyGroup){
								if (propertyGroup.hasOwnProperty(propertyId)) {
									var value = propertyGroup[propertyId];
									if(_this.isReferenceSubgroup(value)){
										var subgroup = {};
										for(id in value){
											expansions.push((function(_subgroup, _id){
												return _this.getData(id).then(function(v){
													return _subgroup[_id] = v;
												});
											})(subgroup, id));
										}
										propertyGroup[propertyId] = subgroup;
									}
								}
							}
						}
					}
					return $q.all(expansions).then(function(){return extendedData;});
				});
			}
		}


		/**
		 * @param mapId the id of the map to get
		 * @param fetchGroups if true then the group data will be retrieved and stored in the map before this completes
		 * @return AsyncValue<mapData>
		 */
		this.getMap = function(mapId, fetchGroups){
			var _this = this;
			
			if(this.maps[mapId]){
				return this.maps[mapId];
			}
			else{
				var deferred = $q.defer();
				
				this.getValue(this.mapsRef, mapId).then(function(map){
					deferred.notify({type: 'mapData', mapData: map});
					var asyncLayers = {};
					for (key in map.layers) {
						var layer = map.layers[key];
						asyncLayers[key] = _this.getValueAndMergeFromId(_this.layersRef, layer).then(
							function(layerData){
								deferred.notify({type: 'newLayer', mapData: map, layerData: layerData});
								
								var layerProcessActions = new Array();
								if(layerData.bubble){
									if(layerData.bubble.type == 'form'){
										layerProcessActions.push(_this.getForm(layerData.bubble.id).then(function(form){
											layerData.bubble.form = form;
											deferred.notify({type: 'layerBubble', mapData: map, layerData: layerData, data: layerData.bubble});
										}));
									}
									else
										deferred.notify({type: 'layerBubble', mapData: map, layerData: layerData, data: layerData.bubble});
								}
								if(layerData.moreLink){
									if(layerData.moreLink.type == 'form'){
										layerProcessActions.push(_this.getForm(layerData.moreLink.id).then(function(form){
											layerData.moreLink.form = form;
											deferred.notify({type: 'layerMoreLink', mapData: map, layerData: layerData, data: layerData.moreLink});
										}));
									}
									else
										deferred.notify({type: 'layerMoreLink', mapData: map, layerData: layerData, data: layerData.moreLink});
								}
								if(fetchGroups){
									layerProcessActions.push(_this.getGroup(layerData.groupname).then(function(groupData){
										layerData.members = groupData.members;
									}, undefined, function(notification){
										switch(notification.type){
											case 'newGroupMember':
											case 'groupData':
												deferred.notify($.extend({},  notification, {mapData: map, layerData: layerData}));
												break;
											default:
												console.warn('got unknown notification', notification);
												break;
										}
									}));
								}
								return $q.all(layerProcessActions).then(function(){
									return layerData;
								});
							}
						);
					}
					return $q.all(asyncLayers).then(function(layers){
						map.layers = layers;
						deferred.resolve(map);
					});
				});
				return this.maps[mapId] = deferred.promise;
			}
		}


			


		this.reduceEntriesAsync = function(entries, reduceFunction){
			var deferred = $q.defer();
			
			var asyncItems = {};
			for (var id in entries) {
				asyncItems[id] = reduceFunction(id, entries[id]).then((function(idCapture){return function(resultVal){
					deferred.notify({key: idCapture, value: resultVal});
					return resultVal;
				};})(id));
			}
			
			$q.all(asyncItems).then(function(result){
				deferred.resolve(result);
			});
			
			return deferred.promise;
		}

		this.getValueAndMergeFromId = function(baseRef, data, callback){
			var id = data.id;
			return this.getValue(baseRef, id).then(function(member) {
				return $.extend({}, data, member);
			});
		}

		this.getValue = function(baseRef, id){
			var deferred = $q.defer();
			
			var ref = baseRef.child(id);

			ref.once('value', function(snapshot) {
				var result = snapshot.val();
				deferred.resolve(result);
			});
			
			return deferred.promise;
		}
	}])
	
	
/*******************************************
  Filter for the properties that are in a form
********************************************/
	.filter('displayForm', function () {
		return function (item, form) {
			var resultFields = {};
			if(!item)
				return resultFields;
			if(form){
				if(form.content){
					for(i in form.content){
						var formPropertySpec = form.content[i];
						var value = item[formPropertySpec.subdir][formPropertySpec.key];
						if(formPropertySpec.type=="text")
							resultFields[formPropertySpec.title] = value;
					}
				}
				else{
					for(propertyGroupId in form.permissions){
						var propertyGroup = form.permissions[propertyGroupId];
						for(propertyId in propertyGroup){
							var formPropertySpec = propertyGroup[propertyId];
							var value = item[propertyGroupId][propertyId];
							if(formPropertySpec.read && !(value instanceof Object))
								resultFields[propertyId] = value;
						}
					}
				}
			}
			else{
				for (fieldId in item.data) {
					if (item.data.hasOwnProperty(fieldId)) {
						var value = item.data[fieldId];
						if(value){
							if(!(value instanceof Array) && !(value instanceof Object)){
								resultFields[fieldId] = value;
							}
						}
					}
				}
			}
			return resultFields;
		};
	})
	
/*******************************************
  Filter for the values of the subgroup properties of an item
********************************************/
	.filter('subgroupItems', ['ckConsole', function (ckConsole) {
		return function (item, form) {
			var items = [];
			if(!item)
				return items;
			if(form){
				if(form.content){
					for(i in form.content){
						var formPropertySpec = form.content[i];
						var value = item[formPropertySpec.subdir][formPropertySpec.key];
						if(formPropertySpec.type=="subdir"){
							for(subitemId in value)
								items.push(value[subitemId]);
						}
					}
				}
				else{
					for(propertyGroupId in form.permissions){
						var propertyGroup = form.permissions[propertyGroupId];
						for(propertyId in propertyGroup){
							var formPropertySpec = propertyGroup[propertyId];
							var value = item[propertyGroupId][propertyId];
							if(formPropertySpec.read && value instanceof Object){
								for(subitemId in value)
									items.push(value[subitemId]);
							}
						}
					}
				}
			}
			return items;
		};
	}])
	
	
/*******************************************
  CKConsole Map service
********************************************/
	.service('ckConsoleMap', ['$rootScope', '$q', 'ckConsole', function($rootScope, $q, ckConsole) {
		this.createMapLayersFromMapData = function(map, mapPromise, createCallback, pinType){
			var _this = this;
			var deferred = $q.defer();
			
			var layers = {};
			
			var layerProperties = {};
			
			var groupPromises = {};
			
			function initLayerData(layerData){
				createGroupPromiseIfNeeded(layerData);
			}
			function createGroupPromiseIfNeeded(layerData){
				if(!groupPromises[layerData.groupname]){
					layerProperties[layerData.groupname] = {};
					groupPromises[layerData.groupname] = $q.defer();
					_this.createMapLayerFromGroupData(map, groupPromises[layerData.groupname].promise, function(layer){
						layers[layerData.groupname] = layer;
						$.extend(layer.properties, layerProperties[layerData.groupname]);
						if(layerData.visible)
							;//layer.show();
						if(createCallback)
							createCallback(layerData.groupname, layer);
					}, function(member){
						return _this.createGroupMemberLayer(member, layerData.symbolUrl, pinType);
					});
				}
			}
			function setLayerProperty(groupname, propertyId, value){
				layerProperties[groupname][propertyId] = value;
				if(layers[groupname])
					layers[groupname].properties[propertyId] = value;
			}
			function forwardGroupEvent(groupname, event){
				groupPromises[groupname].notify(event);
			}
			function resolveGroup(groupData){
				groupPromises[groupData.groupname].resolve(groupData);
			}
			
			mapPromise.then(function(mapData){
				for(layerId in mapData.layers){
					var layerData = mapData.layers[layerId];
					initLayerData(layerData);
					if(layerData.bubble)
						setLayerProperty(layerData.groupname, 'bubble', layerData.bubble);
					if(layerData.moreLink)
						setLayerProperty(layerData.groupname, 'moreLink', layerData.moreLink);
					resolveGroup(layerData);
				}
				deferred.resolve(layers);
			}, undefined, function(notification){
				switch(notification.type){
					case 'mapData':
						break;
					case 'newLayer':
						initLayerData(notification.layerData);
						break;
					case 'layerBubble':
						initLayerData(notification.layerData);
						setLayerProperty(notification.layerData.groupname, 'bubble', notification.data);
						break;
					case 'layerMoreLink':
						initLayerData(notification.layerData);
						setLayerProperty(notification.layerData.groupname, 'moreLink', notification.data);
						break;
					case 'groupData':
						initLayerData(notification.layerData);
						forwardGroupEvent(notification.layerData.groupname, notification);
						break;
					case 'newGroupMember':
						initLayerData(notification.layerData);
						forwardGroupEvent(notification.layerData.groupname, notification);
						break;
					default:
						console.warn('got unknown notification', notification);
						break;
				}
			});
			
			return deferred.promise;
		};
		
		this.createMapLayerFromGroupData = function(map, groupPromise, createCallback, memberLayerFactory){
			if(!memberLayerFactory){
				memberLayerFactory = function(member){return _this.createGroupMemberLayer(member);};
			}
			
			var _this = this;
			var deferred = $q.defer();
			var layer;
			
			function createLayerIfNeeded(groupname){
				if(!layer){
					layer = new MapGroupLayer(map, groupname);
					if(createCallback)
						createCallback(layer);
				}
			}
			function createMemberLayerIfNeeded(id, member){
				if(!layer.getMember(id)){
					var mapObject = memberLayerFactory(member);
					layer.addMember(id, member, mapObject);
				}
			}
			
			groupPromise.then(function(groupData){
				createLayerIfNeeded(groupData.groupname);
				for(var id in groupData.members){//create all remaining members if needed
					createMemberLayerIfNeeded(id, groupData.members[id]);
				}
				deferred.resolve(layer);
			}, undefined, function(notification){
				switch(notification.type){
					case 'groupData':
						createLayerIfNeeded(notification.groupData.groupname);
						break;
					case 'newGroupMember':
						createLayerIfNeeded(notification.groupData.groupname);
						createMemberLayerIfNeeded(notification.memberId, notification.member);
						break;
					default:
						console.warn('got unknown notification', notification);
						break;
				}
			});
			
			return deferred.promise;
		};
		
		this.createGroupMemberLayer = function(member, symbolUrl, pinType){
			if(!member)
				return;
			var layer = this.createGroupMemberShape(member);
			if(layer)
				return layer;
				
			layer = this.createGroupMemberMarker(member, symbolUrl, pinType);
			if(layer)
				return layer;
		};
		this.createGroupMemberShape = function(member){
			if (member.shape) {
				return new L.GeoJSON(member.shape, {
					style: {
						fillColor: "#FF0000",
						fillOpacity: 0.35,
						weight: 1,
						color: "#000000",
						opacity: 0.35
					}
				});
			}
		};
		this.createGroupMemberMarker = function(member, symbolUrl, pinType){
			if(member.birth_certificate.lat && member.birth_certificate.lon){
				var newLatLng = [member.birth_certificate.lat, member.birth_certificate.lon];
				var icon = new L.Icon.Default();
				switch (true) {
				case pinType == "Data" :
					// if data is undefined, set vars to null
					var audioLink;
					if (member.data['Bell_Chorus_Audio'] || member.data['Bell_1_Audio']) {
						if (member.data['Bell_1_Audio']) {
							audioLink = member.data['Bell_1_Audio']
						}
						else { 
							audioLink = member.data['Bell_Chorus_Audio'];
						}
					}
					else {
						audioLink = "Null";
					}
					var matterportLink;
					if (member.data.Matterport_Model) {
						matterportLink = member.data.Matterport_Model;
					}
					else {
						matterportLink = "Null";
					}
					
					switch(true){
						// Red = both audio and tour
						case audioLink !='Null' && matterportLink !='Null':
							symbolUrl = 'bells_icons/belltower_red.png';
							break;
						// Yellow = 3D Tour
						case audioLink =='Null' && matterportLink !='Null':
							symbolUrl = 'bells_icons/belltower_yellow.png';
							break;
						// Green = Audio
						case audioLink !='Null' && matterportLink =='Null':
							symbolUrl = 'bells_icons/belltower_green.png';
							break;
						// White = Neither
						default:
							//window.alert("Default");
							symbolUrl = 'bells_icons/belltower_white.png';
							break;
					}
					break;

					/* OLD WAY
					//RED = both audio and view
					//GIMA
					if(member.birth_certificate.lat == "45.42882" && member.birth_certificate.lon == "12.344017"){
						symbolUrl = 'bells_icons/belltower6_red.png';
					}
					//GIOB
					else if(member.birth_certificate.lat == "45.444338" && member.birth_certificate.lon == "12.320756"){
						symbolUrl = 'bells_icons/belltower6_red.png';
					}
					//RAFF
					else if(member.birth_certificate.lat == "45.431694" && member.birth_certificate.lon == "12.319028"){
						symbolUrl = 'bells_icons/belltower6_red.png';
					}
					//YELLOW = only audio
					//APON
					else if(member.birth_certificate.lat == "45.437382" && member.birth_certificate.lon == "12.332519"){
						symbolUrl = 'bells_icons/belltower6_yellow.png';
					}
					//BART
					else if(member.birth_certificate.lat == "45.436985" && member.birth_certificate.lon == "12.336573"){
						symbolUrl = 'bells_icons/belltower6_yellow.png';
					}
					//MARC
					else if(member.birth_certificate.lat == "45.442295" && member.birth_certificate.lon == "12.329057"){
						symbolUrl = 'bells_icons/belltower6_yellow.png';
					}
					//MICH
					else if(member.birth_certificate.lat == "45.448472" && member.birth_certificate.lon == "12.347256"){
						symbolUrl = 'bells_icons/belltower6_yellow.png';
					}
					//SALV
					else if(member.birth_certificate.lat == "45.435747" && member.birth_certificate.lon == "12.336898"){
						symbolUrl = 'bells_icons/belltower6_yellow.png';
					}
					//STAE
					else if(member.birth_certificate.lat == "45.440576" && member.birth_certificate.lon == "12.330653"){
						symbolUrl = 'bells_icons/belltower6_yellow.png';
					}
					//VIGN
					else if(member.birth_certificate.lat == "45.437519" && member.birth_certificate.lon == "12.348848"){
						symbolUrl = 'bells_icons/belltower6_yellow.png';
					}
					//ORANGE = only view
					//DONA
					else if(member.birth_certificate.lat == "45.456576" && member.birth_certificate.lon == "12.357145"){
						symbolUrl = 'bells_icons/belltower6_orange.png';
					}
					//FORM
					else if(member.birth_certificate.lat == "45.436505" && member.birth_certificate.lon == "12.340979"){
						symbolUrl = 'bells_icons/belltower6_orange.png';
					}
					//FRAR
					else if(member.birth_certificate.lat == "45.436005" && member.birth_certificate.lon == "12.326652"){
						symbolUrl = 'bells_icons/belltower6_orange.png';
					}
					//GERE
					else if(member.birth_certificate.lat == "45.442238" && member.birth_certificate.lon == "12.325747"){
						symbolUrl = 'bells_icons/belltower6_orange.png';
					}
					//ORTO
					else if(member.birth_certificate.lat == "45.446015" && member.birth_certificate.lon == "12.332678"){
						symbolUrl = 'bells_icons/belltower6_orange.png';
					}
					//PIET
					else if(member.birth_certificate.lat == "45.433591" && member.birth_certificate.lon == "12.359162"){
						symbolUrl = 'bells_icons/belltower6_orange.png';
					}
					//POLO
					else if(member.birth_certificate.lat == "45.436283" && member.birth_certificate.lon == "12.329657"){
						symbolUrl = 'bells_icons/belltower6_orange.png';
					}
					// default to white icon
					else symbolUrl = 'bells_icons/belltower6_white.png'; */
				
				//case pinType == "Rating_Condition" :
				case pinType == "Rating_Safety" :
				case pinType == "Rating_Accessibility" :
				case pinType == "Rating_Overall" :
					if(member.data[pinType]){
						var rating = member.data[pinType];
						
						switch(true){
							case rating == 1:
								symbolUrl = 'bells_icons/belltower_red.png';
								break;
							case rating == 2:
								symbolUrl = 'bells_icons/belltower_orange.png';
								break;
							case rating == 3:
								symbolUrl = 'bells_icons/belltower_yellow.png';
								break;
							case rating == 4:
								symbolUrl = 'bells_icons/belltower_yellow-green.png';
								break;
							case rating == 5:
								symbolUrl = 'bells_icons/belltower_green.png';
								break;
							default:
								symbolUrl = 'bells_icons/belltower_gray.png';
								break;
						}
					}
					else symbolUrl = 'bells_icons/belltower_gray.png';
					break;

				case pinType == "Frame type" :
					if(member.data[pinType]){
						var frameType = member.data[pinType];

						switch(true) {
							case frameType == "A" :
								symbolUrl = 'bells_icons/belltower_red.png';
								break;
							case frameType == "H" :
								symbolUrl = 'bells_icons/belltower_yellow.png';
								break;
							case frameType == "Null" :
								symbolUrl = 'bells_icons/belltower_gray.png'
								break;
							default:
								symbolUrl = 'bells_icons/belltower_white.png';
								break;
						}
					}
					else symbolUrl = 'bells_icons/belltower_gray.png';
					break;

				case pinType == "Frame material" :
					if(member.data[pinType]){
						var frameMaterial = member.data[pinType];

						switch(true) {
							case frameMaterial == "Wood" :
								symbolUrl = 'bells_icons/belltower_green.png';
								break;
							case frameMaterial == "Metal" :
								symbolUrl = 'bells_icons/belltower_red.png';
								break;
							case frameMaterial == "Null" :
								symbolUrl = 'bells_icons/belltower_gray.png';
								break;
							default:
								symbolUrl = 'bells_icons/belltower_white.png';
								break;
						}
					}
					else symbolUrl = 'bells_icons/belltower_gray.png';
					break;

				case pinType == "Sestiere" :
					var sestiereName;
					if(member.data['Sestiere'])
						sestiereName = member.data['Sestiere'];
					else sestiereName = "Null";
					switch(true) {
						case sestiereName == "Castello" :
							symbolUrl = 'bells_icons/belltower_blue.png';
							break;
						case sestiereName == "Giudecca" :
							symbolUrl = 'bells_icons/belltower_red-violet.png';
							break;
						case sestiereName == "Dorsoduro" :
							symbolUrl = 'bells_icons/belltower_orange.png';
							break;
						case sestiereName == "Santa Croce" :
							symbolUrl = 'bells_icons/belltower_yellow.png';
							break;
						case sestiereName == "San Polo" :
							symbolUrl = 'bells_icons/belltower_green.png';
							break;
						case sestiereName == "Cannaregio" :
							symbolUrl = 'bells_icons/belltower_red.png';
							break;
						case sestiereName == "San Marco" :
							symbolUrl = 'bells_icons/belltower_violet.png';
							break;
						case sestiereName == "Murano" :
							symbolUrl = 'bells_icons/belltower_blue-green.png';
							break;
						case sestiereName == "Lido" :
							symbolUrl = 'bells_icons/belltower_blue-violet.png';
							break;
						case sestiereName == "Sant'Erasmo" :
							symbolUrl = 'bells_icons/belltower_yellow-orange.png';
							break;
						case sestiereName == "Mazzorbo" :
							symbolUrl = 'bells_icons/belltower_yellow-green.png';
							break;
						case sestiereName == "Burano" :
							symbolUrl = 'bells_icons/belltower_red-orange.png';
							break;
						case sestiereName == "Torcello" :
							symbolUrl = 'bells_icons/belltower_white.png';
							break;
						default:
							symbolUrl = 'bells_icons/belltower_white.png';
							break;
					}
					break;

				//we shouldn't be here, but we are. Paint them gray so we know something is up.
				default:
					symbolUrl = 'bells_icons/belltower_gray.png';
					break;

				}
				if (symbolUrl) {
					icon = new L.Icon({
						iconUrl: symbolUrl,
						iconAnchor: [16, 37],
						popupAnchor: [0,-37],
						iconSize: [32, 37]
					});
				}
				return new L.Marker(newLatLng, {
					icon: icon,
				});
			}
		};
		
	}]);





/*******************************************
  MapGroupLayer class
********************************************/
function MapGroupLayer(map, groupname){
	this.groupname = groupname;
	this.map = map;
	this.groupMembers = {};
	this.markers = {};
	this.properties = {};
	this.featureGroup = new L.FeatureGroup();
}
MapGroupLayer.prototype.addMember = function(id, member, marker){
	this.groupMembers[id] = member;
	if(marker){
		this.markers[id] = marker;
		if(this.style)
			marker.setStyle(this.style);
		this.featureGroup.addLayer(marker);
	}
	return this;
}
MapGroupLayer.prototype.getMember = function(id){
	return this.groupMembers[id];
}
MapGroupLayer.prototype.setStyle = function(style){
	for(var id in this.markers){
		var marker = this.markers[id];
		marker.setStyle(style);
	}
	this.style = style;
	return this;
}
MapGroupLayer.prototype.show = function(){
	this.map.addLayer(this.featureGroup);
	return this;
}
MapGroupLayer.prototype.hide = function(){
	this.map.removeLayer(this.featureGroup);
	return this;
}
function containsMarkerRecursive(queryMarker, layer){
	if(queryMarker==layer){
		return true;
	}
	for(var markerId in layer._layers){
		if(containsMarkerRecursive(queryMarker, layer._layers[markerId]))
			return true;
	}
	return false;
}
MapGroupLayer.prototype.getIdFromMarker = function(queryMarker){
	for(var id in this.markers){
		var marker = this.markers[id];
		if(containsMarkerRecursive(queryMarker, marker)){
			return id;
		}
	}
}
MapGroupLayer.prototype.on = function(eventName, callback){
	var _this = this;
	this.featureGroup.on(eventName, function(e){
		var id = _this.getIdFromMarker(e.layer);
		if(id){
			var marker = _this.markers[id];
			var member = _this.groupMembers[id];
			callback(e, member, marker, _this);
		}
		else
			console.warn("event on feature group did not convert to marker", e, _this.markers);
	});
	return this;
}
MapGroupLayer.prototype.getLayer = function(){
	return this.featureGroup;
}
MapGroupLayer.prototype.eachMember = function(callback){
	for(var id in this.groupMembers){
		var member = this.groupMembers[id];
		var marker = this.markers[id];
		callback(member, marker);
	}
	return this;
}
