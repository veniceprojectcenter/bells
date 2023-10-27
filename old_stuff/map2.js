/*
VeniceBells.com
@author: Madalyn Coryea
@modified: 12/11/2012
*/
$(document).ready(function() {

	var myOptions = {
			center: new google.maps.LatLng(45.4360, 12.3340),//initial center
			zoom: 14,//inital zoom level
			mapTypeId: google.maps.MapTypeId.SATELLITE //the map tyoe
		},
		map = new google.maps.Map(document.getElementById("map"), myOptions),
		bell0_icon = new google.maps.MarkerImage(
							'Images/bell2_gold.png',//belltower_black2.png 
							new google.maps.Size(20, 20), //(50,50)
        					new google.maps.Point(0,0),
        					new google.maps.Point(25, 25)),
		bell1_icon = new google.maps.MarkerImage(
							'Images/bell3_green.png', //belltower_gold2.png bell_gif.gif bell3_green.png
							new google.maps.Size(20, 20), //(50,50)
        					new google.maps.Point(0,0),
        					new google.maps.Point(25, 25)),
		bell2_icon = new google.maps.MarkerImage(
							'Images/bell4_blue.png', //belltower_gold2.png bell_gif.gif bell3_green.png
							new google.maps.Size(20, 20), //(50,50)
        					new google.maps.Point(0,0),
        					new google.maps.Point(25, 25)),
		/*					
		HOURLY:
			0 == does not ring hourly
			1 == rings hourly & half-hourly
			2 == rings hourly (only)
		*/				
		markers = [//time: [{day:4, hour:11, minute:0},{day:5, hour:12, minute:0}],
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.446796, 12.329563),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "ALVI"},
				   {marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.437654, 12.316192),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "ANDR"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.457724, 12.348853),
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "ANGE"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.488133, 12.412062),
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "ANGM"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.434976, 12.346553),
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "ANTN"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.282036, 12.302909),
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "ANTP"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.437382, 12.332519),
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "APON"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.439752, 12.336737),
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "APOS"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.442797, 12.33945),
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 2,
					name: "ASSG"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.371875, 12.338552),
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "ASSM"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.497427, 12.419881),
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "ASST"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.432597, 12.325862),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "BARN"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.436985, 12.336573),
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "BART"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.433372, 12.339252),
						map: map,
						icon: bell0_icon}),
					time: [{day:2, hour:7, minute:0}],
					hourly: 0,
					name: "BASI"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.435021, 12.332682),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 1,
					name: "BENE"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.438841, 12.328863),
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "BOLD"},
					//BONA no data (45.447935, 12.326754) -- Data from Churches Team
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.447935, 12.326754),
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "BONA"},
					//BURA no data
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.439536, 12.338727),
						map: map,
						icon: bell0_icon}),
					time: [], 
					hourly: 0,
					name: "CANC"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.432375, 12.322414),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "CARM"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.439153, 12.332613),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "CASS"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.483263, 12.406211),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "CATM"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.436338, 12.338521),
						map: map,
						icon: bell0_icon}),
					time: [{day:4, hour:11, minute:0},{day:5, hour:12, minute:0}],	
					hourly: 0,
					name: "CONS1"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.43621, 12.338475),
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "CONS2"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.424767, 12.323256),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "COSM"},
					{marker:new google.maps.Marker({
						position: new google.maps.LatLng(45.434902, 12.337934),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "CROA"},
					{maker: new google.maps.Marker({
						position: new google.maps.LatLng(45.456576, 12.357145),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "DONA"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.438153, 12.334718),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "ELEM"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.426656, 12.365999),
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "ELEN"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.458302, 12.410644),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "ERAS"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.441703, 12.377698),
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "EROS"},
					//EUFE no data
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.437553, 12.326325),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "EVAN"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.441215, 12.333505),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 2,
					name: "FELI"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.436505, 12.340979),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "FORM"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.442286, 12.33264),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "FOSC"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.436005, 12.326652),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 1,
					name: "FRAR"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.442238, 12.325747),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 1,
					name: "GERE"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.428898, 12.327634),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "GESU1"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.428956, 12.327403),
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "GESU2"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.42882, 12.344017),
						map: map,
						icon: bell0_icon}), 
					time: [{day:2, hour:7, minute:0}],
					hourly: 1,
					name: "GIMA"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.444338, 12.320756),//GIOB
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "GIOB"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.434636, 12.344739),//GREC
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "GREC"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.438566, 12.337351),//GRIS
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "GRIS"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.429946, 12.357881),//ISEP
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "ISEP"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.433646, 12.326975),//LAPI1
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "LAPI1"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.433627, 12.326975),//LAPI2
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "LAPI2"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.440508, 12.343137),//LAZZ
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "LAZZ"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.435261, 12.334109),//LUCA
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "LUCA"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.434454, 12.317355),//MAGG
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "MAGG"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.425842, 12.362849),//MANT
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "MANT"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.483366, 12.418712),//MARB
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 2,
					name: "MARB"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.442295, 12.329057),//MARC
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "MARC"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.43435, 12.324197),//MARG
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "MARG"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.433776, 12.34913),//MART
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "MART"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.443167, 12.333278),//MARZ
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "MARZ"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.439265, 12.330481),//MATE
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "MATE"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.431714, 12.315872),//MEND
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 1,
					name: "MEND"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.448472, 12.347256),//MICH
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "MICH"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.438949, 12.339484),//MIRA
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "MIRA"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.432295, 12.336308),//MOIS
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "MOIS"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.427351, 12.38117),//NICO
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "NICO"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.430732, 12.323379),//OGNI
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "OGNI"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.265021, 12.301482),//OGNP
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "OGNP"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.439659, 12.327531),//ORIO
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "ORIO"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.446015, 12.332678),//ORTO
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "ORTO"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.435072, 12.325099),//PANT*
						map: map,
						icon: bell0_icon}),
					time: [{day:3, hour:8, minute:0}],
					name: "PANT"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.431866, 12.354502),//PAUL
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "PAUL"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.316855, 12.316435),//PIAP
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "PIAP"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.454553, 12.352535),//PIEM
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "PIEM"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.433591, 12.359162),//PIET
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "PIET"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.436283, 12.329657),//POLO
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "POLO"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.431694, 12.319028),//RAFF1
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "RAFF1"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.431721, 12.319393),//RAFF2
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "RAFF2"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.424113, 12.332682),//REDE1
						map: map,
						icon: bell0_icon}),
					time: [{day:3, hour:7, minute:0}],
					hourly: 0,
					name: "REDE1"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.42414, 12.33244),//REDE2
						map: map,
						icon: bell0_icon}), 
					time: [{day:3, hour:7, minute:0}],
					hourly: 0,
					name: "REDE2"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.442689, 12.336796),//RINA
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "RINA"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.43638, 12.325235),//ROCC
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "ROCC"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.431305, 12.32469),//ROMI
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "ROMI"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.429705, 12.334844),//SALU1
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "SALU1"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.429712, 12.335056),//SALU2
						map: map,
						icon: bell0_icon}), 
					time: [{day:4, hour:11, minute:0},{day:5, hour:12, minute:0}],
					hourly: 0,
					name: "SALU2"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.435747, 12.336898),//SALV
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "SALV"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.432889, 12.328321),//SAMU
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "SAMU"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.440978, 12.321998),//SCAL
						map: map,
						icon: bell0_icon}), 
					time: [{day:3, hour:8, minute:15}],
					hourly: 0,
					name: "SCAL"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.431305, 12.320007),//SEBA
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "SEBA"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.436888, 12.333405),//SILV
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "SILV"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.440108, 12.324529),//SIMG
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "SIMG"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.439488, 12.322731),//SIMP
						map: map,
						icon: bell0_icon}), 
					time: [],
					hourly: 0,
					name: "SIMP"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.436937, 12.338849),//SILO
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "SILO"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.416534, 12.369271),//SMEL
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "SMEL"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.440334, 12.335111),//SOFI
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "SOFI"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.440576, 12.330653),//STAE
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "STAE"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.432641, 12.332151),//STEF
						map: map,
						icon: bell0_icon}),
					time: [{day:2, hour:7, minute:30}],
					hourly: 0,
					name: "STEF"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.454693, 12.353281),//STEM
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "STEM"},
					//TAMA no data available
					//for TAMA hourly: 2,
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.432436, 12.3163),//TERE
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "TERE"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.436975, 12.322443),//TOLE
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "TOLE"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.457948, 12.360443),//TORR
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "TORR"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.42451, 12.330852),//TRIN
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "TRIN"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.430176, 12.326424),//TROV
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "TROV"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.443424, 12.335362),//VALV
						map: map,
						icon: bell0_icon}),
					time: [{day:3, hour:7, minute:30}],
					hourly: 0,
					name: "VALV"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.431627, 12.329753),//VIDA
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "VIDA"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.437519, 12.348848),//VIGN
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "VIGN"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.429054, 12.326975),//VISI
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "VISI"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.433811, 12.34356),//ZACC
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "ZACC"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.440871, 12.328194),//ZAND
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "ZAND"},
					//ZANI
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.426345, 12.33937),//ZITE1
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "ZITE1"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.426298, 12.339226),//ZITE2
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "ZITE2"},
					{marker: new google.maps.Marker({
						position: new google.maps.LatLng(45.435239, 12.3389),//ZULI
						map: map,
						icon: bell0_icon}),
					time: [],
					hourly: 0,
					name: "ZULI"}
		],
		cur_icon = 0;

		function currentVeniceTime() {
			var now = new Date(),
				utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000),
				veniceOffset = 1;
			return new Date(utc + (3600*1000*veniceOffset));
		}

		
		function ring(){
			document.getElementById("ringer").innerHTML=/*document.getElementById(id).innerHTML +*/
			"<embed src=\""+"Sounds/ASST_2012_C3.mp3"+"\" hidden=\"true\"  />"; //autostart=\"true\" loop=\"false\"
		}
		
		//var testDiff = -2;
		function ringBell(){
			var now = currentVeniceTime();
			var localTime = document.getElementById("localTime");
			var ringPlease = document.getElementById("ringPlease");
			
			localTime.innerHTML="<p>"+now.toLocaleString()+"</p>";
			
			var icon;
				if(cur_icon == 0) {
					cur_icon = 1;
					icon = bell1_icon
				} else {
					cur_icon = 0;
					icon = bell0_icon;
				}
				
			for(var i = 0; i < markers.length; i++) {
				var markerObj = markers[i];
				var mins = now.getMinutes();
				
				for(var j = 0; j < markerObj.time.length; j++){
					var timeObj = markerObj.time[j];
				//Note change here, used to be markers[i].setIcon(icon)
					if(timeObj.day == now.getDay() && timeObj.hour == now.getHours() && timeObj.minute >= mins && timeObj.minute <= (mins + 4)){
						markerObj.marker.setIcon(icon);
						markerObj.ringBellsLit = true;
						//set called to 1
						//call ring function if checkbox was checked
						if(ringPlease.checked){
							ring();
						}
					}else if(markerObj.ringBellsLit){
						markerObj.marker.setIcon(bell0_icon);
						markerObj.ringBellsLit = false;
					}
				}
				

				if(now.getHours() >= 7 && now.getHours() <= 24){	//bells only ring between 7am and 12am
					if(mins >= 0 && mins <= 4 && markerObj.hourly == 1){
							markerObj.marker.setIcon(icon);
							markerObj.ringBellsLit = true;
						//call ring function
						if(ringPlease.checked){
							ring();
						}
					} else if(mins >= 30 && mins <= 34 && markerObj.hourly == 1){
						markerObj.marker.setIcon(icon);
						markerObj.ringBellsLit = true;
						//call ring function
						if(ringPlease.checked){
							ring();
						}
					} else if(markerObj.hourly == 1 && markerObj.ringBellsLit) {
						markerObj.marker.setIcon(bell0_icon);
						markerObj.ringBellsLit = false;
					}

					if(mins >= 0 && mins <= 4 && markerObj.hourly == 2){
						markerObj.marker.setIcon(icon);
						markerObj.ringBellsLit = true;
						//call ring function
						if(ringPlease.checked){
							ring();
						}
					} else if(markerObj.hourly == 2 && markerObj.ringBellsLit) {
						markerObj.marker.setIcon(bell0_icon);
						markerObj.ringBellsLit = false;
					}
				}	
					//set called to 0
			}
		}
	
	setInterval(ringBell,1000);

	//NEW CODE!!!!
		var time = {hour: -1, min:-1, day: 0},
			lastTime = {hour: -1, min:-1, day:-1},
			usedSlider = false,
			minslider_max = 24*60,
			dayslider_max = 6;

		$("#minslider").slider({min: 0, 
							 max: minslider_max, //number of minutes in a day
							 step:15,
							 slide: update_min_value //function called everytime the user slides the slider
							});

		$("#dayslider").slider({min: 0,
								max: dayslider_max,
								step: 1,
								slide: update_day_value//function called everytime the user slides the slider
								})

		$('.ui-slider-handle').click(function () {
			if(time.hour == -1) {
				time.hour = 0;
				time.min = 0;
			}
		})

		//function to update the hour and min values based on the slider
		function update_min_value(event, ui) {
			var newTime = minToTime(ui.value);
			time.hour = newTime.hour;
			time.min = newTime.min;
			$( "#minslider-value" ).html(timeFormat(time));
			$('#minslider-color').css('width', ((ui.value / minslider_max)*100) + '%');
		}

		function timeFormat(time) {
			var hour = time.hour,
				min = time.min,
				tod = 'AM';
			if (hour > 11) {
				tod = 'PM';
			}
			if (hour > 12) {
				hour = hour - 12;
			}
			if(hour == 0) {
				hour = 12;
			}
			if (min < 10) {
				min = '0' + min;
			}
			return hour + ':' + min + ' ' + tod;
		}
		//function to update day value based on slider
		function update_day_value(event, ui) {
			var newDay = ui.value;
			time.day = newDay;
			var weekday;
			if(time.day == 0){
				weekday = "Sunday";
			}else if (time.day == 1){
				weekday = "Monday";
			}else if (time.day == 2){
				weekday = "Tuesday";
			}else if (time.day == 3){
				weekday = "Wednesday";
			}else if (time.day == 4){
				weekday = "Thursday";
			}else if (time.day == 5){
				weekday = "Friday";
			}else if (time.day == 6){
				weekday = "Saturday";
			}
			
			$( "#dayslider-value" ).html(weekday);
			$('#dayslider-color').css('width', ((ui.value / dayslider_max)*100) + '%');
		}
		//convert the number of minutes from the slider into am hour and minute
		function minToTime(min) {
			var hour = Math.floor(min/60),
				min = min % 60;
			return {hour: hour, min: min};
		}

		function lightUpBells() {
			if(time.hour == lastTime.hour && time.min == lastTime.min && time.day == lastTime.day) {
				//if time is the same no reason to do anything, this is an
				//important optimization since this is function is called a lot
				return;
			}
			lastTime.hour = time.hour;
			lastTime.min = time.min;
			lastTime.day = time.day;
			for(var i = 0; i < markers.length; i++) {
				var markerObj = markers[i];

				for(var j = 0; j < markerObj.time.length; j++){
					var timeObj = markerObj.time[j];
					//if it is time for this bell to ring
					if(timeObj.hour == time.hour && timeObj.minute == time.min && timeObj.day == time.day){
						//light it up
						markerObj.marker.setIcon(bell2_icon);
						markerObj.lightUpLit = true;
					}else if(markerObj.lightUpLit){//otherwise
						//make sure it is not lit up
						markerObj.marker.setIcon(bell0_icon);
						markerObj.lightUpLit = false;
					}
				}
				
				//if(time.hour >= 7 && time.hour <= 24){
					if(time.min == 0 && markerObj.hourly == 1 && time.hour >= 7 && time.hour <= 24){
						markerObj.marker.setIcon(bell2_icon);
						markerObj.lightUpLit = true;
					}	
					if(markerObj.hourly == 1 && time.min != 0){
						markerObj.marker.setIcon(bell0_icon);
						markerObj.lightUpLit = false;
					}
					
					if(time.min == 30 && markerObj.hourly == 1 && time.hour >= 7 && time.hour <= 24){
						markerObj.marker.setIcon(bell2_icon);
						markerObj.lightUpLit = true;
					}	
					/*if(time.min != 30 && markerObj.hourly == 1){
						markerObj.marker.setIcon(bell0_icon);
					}	*/
					
					if(time.min == 0 && markerObj.hourly == 2 && time.hour >= 7 && time.hour <= 24){
						markerObj.marker.setIcon(bell2_icon);
						markerObj.lightUpLit = true;
					}
					if(markerObj.hourly == 2 && time.min != 0){
						markerObj.marker.setIcon(bell0_icon);
						markerObj.lightUpLit = false;
					}	
				//}
					
				
			}
		}
		//the interval below is what lights up lights based on a change in time
		//this change can come from the slider or the current time. The interval should
		//be less than a second so when you change the slider the changes are reflected
		//immediatley and the user doesn't have to wait. We could hook this up to the slide
		//event of the slider but that gets called very often when the slider is dragged
		//and might slow down the page. 
		//Could probably up this to 2-5 hundred and it would still work
		setInterval(lightUpBells, 100);
});
