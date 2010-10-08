/*
 * KOLUMBUS-NESTEBUSS
 * Author: Hallvard Nygård, http://hnygard.no/
 * Source code: http://github.com/HNygard/kolumbus-nestebuss
 * 
 * License: Creative Commons Attribution-Share Alike 3.0 Norway License, http://creativecommons.org/licenses/by-sa/3.0/no/
 */

function loadNesteBuss(tag, hpl)
{
	$(tag).load("nestebuss.php?hpl=" + hpl + " .regulartable", "", function () {
		$(tag).append('<span style="display: none;" class="antallVises">0</span>');
		firstUpdateTable(tag);
		updateTable(tag);
	});
}

function firstUpdateTable(tag)
{
	// Run through all tr with the tag
	$(tag + ' tr').each(function(index, row)
	{
		$("th", $(this)).each(function (index, td) {
			
			if(disable_heading)
			{
				$(this).hide();
				return;
			}
			
			if(index == 0) {
				// Klokkeslett
				avgang = $(this).text();
				$(this).parent().append("<th>Gjenst&aring;r</th>");
			} else if (index == 1) {
				// Rute
			} else if (index == 2) {
				// Type
			} else if (index == 3) {
				// Destiasjon
				$(this).hide(); // Don't care...
			} else if (index == 4) {
				// Merknad
			} else if (index == 5) {
				// Selskap
				$(this).hide(); // Don't care...
			}
		});
	});
}

function updateTable(tag)
{
	antallVises = 0;
	$(tag + ' .antallVises').text("0");
	setTimeout("updateTable('"+tag+"');", 1000); // Update every second
	
	// Run through all tr with the tag
	$(tag + ' tr').each(function(index, row)
	{
		tag = $(this).closest("div").attr('id');
		if(parseInt($('#' + tag + ' .antallVises').text()) < maxLines)
		{
			// Go through all of the rows
			$("td", $(this)).each(function (index, td)
			{
				if(index == 0) {
					// Klokkeslett
					avgang = $(this).text();
					tid_time = parseInt(avgang.split(':')[0]);
					tid_min = parseInt(avgang.split(':')[1]);
					tid = ((tid_time * 60) + tid_min);
					var now = new Date();
					now_min = ((now.getHours()*60) + now.getMinutes());
					
					// Antall minutt igjen
					gjenstor = tid - now_min;
					
					
					var td_gjenstor = $(".gjenstor", $(this).parent());
					if(td_gjenstor.length == 0)
						$(this).parent().append("<td class='gjenstor'></td>");
				
					DisplayStr = "%%H%%:%%M%%:%%S%%";
					var dthen = new Date();
					dthen.setMinutes(tid_min);
					dthen.setHours(tid_time);
					dthen.setSeconds(0);
					var dnow = new Date();
					ddiff = new Date(dthen-dnow);
					secs = Math.floor(ddiff.valueOf()/1000);
					if(secs > 0)
					{
						DisplayStr = DisplayStr.replace(/%%D%%/g, calcage(secs,86400,100000));
						DisplayStr = DisplayStr.replace(/%%H%%/g, calcage(secs,3600,24));
						DisplayStr = DisplayStr.replace(/%%M%%/g, calcage(secs,60,60));
						DisplayStr = DisplayStr.replace(/%%S%%/g, calcage(secs,1,60));
					} else {
						ddiff = new Date(dnow-dthen);
						secs = Math.floor(ddiff.valueOf()/1000);
					
						DisplayStr = DisplayStr.replace(/%%D%%/g, calcage(secs,86400,100000));
						DisplayStr = DisplayStr.replace(/%%H%%/g, calcage(secs,3600,24));
						DisplayStr = DisplayStr.replace(/%%M%%/g, calcage(secs,60,60));
						DisplayStr = DisplayStr.replace(/%%S%%/g, calcage(secs,1,60));
					}
					$(".gjenstor", $(this).parent()).text(DisplayStr);
					
					// Unhide if hidden
					$(this).parent().show();
					tag = $(this).closest("div").attr('id');
					antallVises = parseInt($('#' + tag + ' .antallVises').text()) + 1;
					
					if(gjenstor <= time_RemoveAfter) {
						// Remove if too old
						$(this).parent().fadeOut(300,function() { $(this).remove(); });
					} else if(gjenstor <= 0) {
						// The bus has left without you... (or is late and you must run!)
						$('#' + tag + ' .antallVises').text(antallVises);
						$("td", $(this).parent()).addClass("justLeft");
					} else if(gjenstor <= time_LeavingSoon) {
						// Not too many minuttes until
						$('#' + tag + ' .antallVises').text(antallVises);
						$("td", $(this).parent()).addClass("leavingSoon");
					}
				
				} else if (index == 1) {
					// Rute
				} else if (index == 2) {
					// Type
				} else if (index == 3) {
					// Destiasjon
					$(this).hide(); // Don't care...
				} else if (index == 4) {
					// Merknad
				} else if (index == 5) {
					// Selskap
					$(this).hide(); // Don't care...
				} else if (index == 6) {
					// Gjenstår
				}
			});
		} else {
			$(this).hide();
		}
	});
}

function calcage(secs, num1, num2) {
	s = ((Math.floor(secs/num1))%num2).toString();
	if (s.length < 2)
		s = "0" + s;
	return s;
}

