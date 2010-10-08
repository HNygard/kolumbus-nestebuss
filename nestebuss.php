<?php

/*
 * KOLUMBUS-NESTEBUSS
 * Author: Hallvard Nygård, http://hnygard.no/
 * Source code: http://github.com/HNygard/kolumbus-nestebuss
 * 
 * License: Creative Commons Attribution-Share Alike 3.0 Norway License, http://creativecommons.org/licenses/by-sa/3.0/no/
 */

// To get around the same origin policy of most browsers

if(!isset($_GET['hpl']))
	exit();

$url = 'http://reiseplanlegger.kolumbus.no/scripts/TravelMagic/travelmagicwe.dll/avgangsinfo?hpl='.$_GET['hpl'];


ini_set('user_agent', 'Neste buss-skript');
$handle = fopen ($url, "r");
echo stream_get_contents($handle);
fclose($handle);

exit();

?>
