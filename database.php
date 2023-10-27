<html>
<head>
	<title>Database</title>
	<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
	<link href="vb_stylesheet.css" rel="stylesheet" type="text/css">
	<script type="text/javascript" src="active_tab.js"></script>
</head>
<body>
	<div class="nav">
		<a id="home_tab" class="menu" href="index.html" onclick="press_tab_1()">Home</a>
		<a id="bells_tab" class="menu" href="bells.html">Bells!</a>
		<!--a id="gallery_tab" class="menu" href="gallery.html" onclick="press_tab_2()">Gallery</a>
		<a id="appDownload_tab" class="menu" href="appDownload.html">App Download</a-->
		<a id="projectLinks_tab" class="menu" href="projectLinks.html">Project Links</a>
		<a id="team_tab" class="menu" href="team.html">Team</a>
		<a id="database_tab" class="menu" href="database.php">Database</a>
	</div>
	
	<div class="header">
		<img src="Images/heading_9_logo.png" alt="header" height=100/>
	</div>
	
	<br/><br/>
	
	<div class="main">
	<!--form name="form1" action="php page?" method="post" onsubmit="xmlhttpPost('response_ajax.php, 'form1', 'MyResult', 'Wait Please'); return false;"-->
	<form method="GET">
		<select id="select_box" name="select_box" onchange="document.getElementById('text-input').value = this.value;"> <!--onchange="this.form.submit();" -->
		  <option id="all_opt" value="all">View all Belltower Data</option>
		  <option id="codice_opt" value="codices">Church codes</option>
		</select>
		<input type="text" id="text-input">
		<input type="submit" value="check" name="check">
	<form>
	
	<br/><br/>
	<?php
	$select = $_POST['select_box'];
	$allbox = ($select == 'all');
	$codicebox = ($select == 'codice');
	$check = $_POST['check'];
	
	$db="test1"; //belltechnical2004 & janelle
	$link = mysql_connect("localhost", "web", "MPfFmtGvnvmCp8BE"); //MPfFmtGvnvmCp8BE
	if (! $link)
	die("Couldn't connect to MySQL");
	mysql_select_db($db , $link)
	or die("Couldn't open $db: ".mysql_error());
	$result = mysql_query( "SELECT * FROM belltechnical2004" )
	or die("SELECT Error: ".mysql_error());
	$num_rows = mysql_num_rows($result);
	print "There are $num_rows records.<P>";
	
	//getElementById('all_opt');
	//getElementById('codice_opt');
	print "<table width=200 border=1>\n";
	while ($get_info = mysql_fetch_row($result)){ 
	print "<tr>\n";
	foreach ($get_info as $field) 
	print "\t<td><font face=arial size=2/>$field</font></td>\n";
	print "</tr>\n";
	}
	print "</table>\n";
	mysql_close($link);
	?>
	</div>
</body>
</html>