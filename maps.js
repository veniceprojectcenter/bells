$(document).ready(function() {

        var myOptions = {
                        center: new google.maps.LatLng(45.4360, 12.3340),//initial center
                        zoom: 14,//inital zoom level
                        mapTypeId: google.maps.MapTypeId.SATELLITE //the map tyoe
                };
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
                $.getJSON("http://bells.veniceprojectcenter.org/bells.json", function(result) {
                   var markers = new Array();                           
                   $.each(result, function(key, val) {
                        var marker=new google.maps.Marker({
                            position: new google.maps.LatLng(val.latitude, val.longitude),
                            map: map,
                            icon: bell0_icon,
                            name: val.name,
                            fullname: val.fullname,
                            hourly: val.hourly,
                            time: val.time
                        });

                        var infoWindow = new google.maps.InfoWindow();

                        google.maps.event.addListener(marker, 'click', function () {
                            var markerContent = marker.fullname;
                            console.log("Marker content:" + markerContent);
                            infoWindow.setContent(markerContent);
                            infoWindow.open(map, this);
                        });
                        markers.push(marker);
                    });
                    console.log(markers);

                cur_icon = 0;

                function currentVeniceTime() {
                        var now = new Date(),
                                utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000),
                                veniceOffset = 1;
                        return new Date(utc + (3600*1000*veniceOffset));
                }

                
                function ring(name){
                        if(name === "APON"){
                            document.getElementById("ringer").innerHTML="<embed src=\""+"Sounds/APONC3_2012_audio_hitonce.mp3"+"\" hidden=\"true\"  />"; 
                        }
                        else if(name === "BART"){
                            document.getElementById("ringer").innerHTML="<embed src=\""+"Sounds/BARTC1_audio.mp3"+"\" hidden=\"true\"  />"; 
                        }
                        else if(name === "BASI"){
                            document.getElementById("ringer").innerHTML="<embed src=\""+"Sounds/BASICC_2012_audio.mp3"+"\" hidden=\"true\"  />"; 
                        }
                        else if(name === "GIMA"){
                            document.getElementById("ringer").innerHTML="<embed src=\""+"Sounds/GIMA_2012_C1.mp3"+"\" hidden=\"true\"  />"; 
                        }
                        else if(name === "GIOB"){
                            document.getElementById("ringer").innerHTML="<embed src=\""+"Sounds/GIOB_2012_C1.mp3"+"\" hidden=\"true\"  />"; 
                        }
                        else if(name === "MARC"){
                            document.getElementById("ringer").innerHTML="<embed src=\""+"Sounds/MARCCC_2012_audio.mp3"+"\" hidden=\"true\"  />"; 
                        }
                        else if(name === "MICH"){
                            document.getElementById("ringer").innerHTML="<embed src=\""+"Sounds/MICHC1_audio.mp3"+"\" hidden=\"true\"  />"; 
                        }
                        else if(name === "SALV"){
                            document.getElementById("ringer").innerHTML="<embed src=\""+"Sounds/SALVC1_audio.mp3"+"\" hidden=\"true\"  />"; 
                        }
                        else if(name === "STAE"){
                            document.getElementById("ringer").innerHTML="<embed src=\""+"Sounds/STAEC1_audio.mp3"+"\" hidden=\"true\"  />"; 
                        }
                        else if(name === "VIGN"){
                            document.getElementById("ringer").innerHTML="<embed src=\""+"Sounds/VIGNCC_audio.mp3"+"\" hidden=\"true\"  />"; 
                        }
                        else{
                            document.getElementById("ringer").innerHTML="<embed src=\""+"Sounds/ASST_2012_C3.mp3"+"\" hidden=\"true\"  />"; 
                        }
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
                                                        ring(markerObj.name);
                                                }
                                        }else if(markerObj.ringBellsLit){
                                                markerObj.marker.setIcon(bell0_icon);
                                                markerObj.ringBellsLit = false;
                                        }
                                }
                                

                                if(now.getHours() >= 7 && now.getHours() <= 24){        //bells only ring between 7am and 12am
                                        if(mins >= 0 && mins <= 4 && markerObj.hourly == 1){
                                                        markerObj.marker.setIcon(icon);
                                                        markerObj.ringBellsLit = true;
                                                //call ring function
                                                if(ringPlease.checked){
                                                        ring(markerObj.name);
                                                }
                                        } else if(mins >= 30 && mins <= 34 && markerObj.hourly == 1){
                                                markerObj.marker.setIcon(icon);
                                                markerObj.ringBellsLit = true;
                                                //call ring function
                                                if(ringPlease.checked){
                                                        ring(markerObj.name);
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
                                                        ring(markerObj.name);
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
                                        }       */
                                        
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
});