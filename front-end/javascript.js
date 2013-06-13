var obama = new Array();
var romney = new Array();
var obama_data = new Array();
var romney_data = new Array();
var obama_dates = ['06.12.12', '06.22.12', '07.10.12','07.19.12', '07.23.12', '07.27.12', '08.01.12', '08.09.12', '08.12.12', '08.14.12',
	'09.07.12', '09.09.12', "09.17.12","09.18.12","09.21.12",'10.04.12', "10.19.12","10.25.12", '11.05.12', "11.06.12"];
var romney_dates = ['06.15.12', '06.21.12', '07.11.12', '07.24.12', '07.29.12', '07.31.12', '08.10.12', '08.15.12', 
	'08.29.12', '08.30.12', '09.11.12', '09.17.12', '09.25.12', '10.08.12', '10.19.12', '10.26.12', '11.02.12', '11.06.12'];
//var obama_dates = ['06.12.12'];
//var romney_dates = ['06.15.12'];

var terms = new Array();
var j; //keeping track of when we've been through all the dates

//tabs
var tabLinks = new Array();
var contentDivs = new Array();

function collectData(topic) {
	//Obama
	if(j<obama_dates.length) {
		ob_data = eval(httpGet('http://localhost:8080/pres_rhetoric_scrape_obama', obama_dates[j], topic));
		if(ob_data.length>0) {
			var date = createJSDate(ob_data[0].date);
			var count = termCountTotal(ob_data[0].terms);
			var length = ob_data[0].speech_length;
			obama.push([date, count/length]);
			addTerms(ob_data[0].terms, terms);
			obama_data.push(ob_data[0]);
		}
	}
	//Romney
	if(j<romney_dates.length) {
		ro_data = eval(httpGet('http://localhost:8080/pres_rhetoric_scrape_romney', romney_dates[j], topic));
		if(ro_data.length>0) {
			var date = createJSDate(ro_data[0].date);
			var count = termCountTotal(ro_data[0].terms);
			var length = ob_data[0].speech_length;
			romney.push([date, count/length]);
			addTerms(ro_data[0].terms, terms);
			
			romney_data.push(ro_data[0]);
		}
	}

	j=j+1;
};

function httpGet(theUrl, date, topic)
{
	var xmlHttp = null;

	xmlHttp = new XMLHttpRequest();
	params = "date=" + date + "&topic=" + topic
	xmlHttp.open( "GET", theUrl + "?" + params, false );
	try {
		xmlHttp.send(null);
	}
	catch(e) {
		console.log(e);
		console.log(xmlHttp);
	}
	return xmlHttp.responseText;
}

function graph(topic) 
{
		j=0;
		obama = [];
		romney = [];
		obama_data = [];
		romney_data = [];
		terms = [];
		var updateInterval = 30;

		function showTooltip(x, y, contents) {
			$("<div id='tooltip'>" + contents + "</div>").css({
				position: "absolute",
				display: "none",
				top: y + 5,
				left: x + 5,
				border: "1px solid #fdd",
				padding: "2px",
				"background-color": "#fee",
				opacity: 0.80,
				"list-style-type" : "none",
			}).appendTo("body").fadeIn(200);
		}

		function update(topic) {
			collectData(topic);
			$.plot("#placeholder", [
				{ color: "blue", data: obama, label: "Obama"},
				{ color: "red", data: romney, label: "Romney"}
			], 
			{
				series: {
					lines: {
						show: true
					},
					points: {
						show: true
					}
				},
				grid: {
					hoverable: true,
					clickable: true
				},
				xaxis: { 
					mode: "time",
					min: (new Date(2012, 05, 12)).getTime(),
					max: (new Date(2012, 10, 06)).getTime()
				}
			});

			$("#placeholder").bind("plothover", function (event, pos, item) {
				if (item) {
					$("#tooltip").remove();
					//var x = item.datapoint[0].toFixed(2),
					//y = item.datapoint[1].toFixed(2);

					var data = {};
					if(item.series.label == "Romney") {
						data = romney_data[item.dataIndex].terms;
					}
					else if (item.series.label == "Obama") {
						data = obama_data[item.dataIndex].terms;
					}
					term_array = "";
					for(var i=0; i<data.length; i++) {
						term_array = term_array + data[i][0] + " : " + data[i][1] + "<br />";
					}
					showTooltip(item.pageX, item.pageY,
				    "Term Counts: <br />" + term_array);
				}
			});

			$("#placeholder").bind("plothoverout", function (event, pos, item) {
				$("#tooltip").remove();
			});

			$("#placeholder").bind("plotclick", function (event, pos, item) {
				data = "";
				if(item.series.label == "Romney") {
						data = romney_data[item.dataIndex].full_url;
				}
				else if (item.series.label == "Obama") {
						data = obama_data[item.dataIndex].full_url;
				}
			
				window.location = data;
			});

			if(j<obama_dates.length || j<romney_dates.length) {
				setTimeout(function() {update(topic);}, updateInterval);
			}
		}

		update(topic);

		// Add the Flot version string to the footer

		$("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
};

	function termCountTotal(termArray) {
		total = 0;
		for(var i=0;i<termArray.length;i++) {
			total+=termArray[i][1];
		}
		return total;
	}

	function createJSDate(dateString) {
		var date = dateString.split(".");
		//Adjust the date
		date[2] = "20" + date[2];
		date[0] = date[0] - 1;
		return new Date(date[2], date[0], date[1])
	}

	function addTerms(termArray, terms) {
		for(var i=0;i<termArray.length;i++) {
			if(($.inArray(termArray[i][0], terms))==-1) {
				terms.push(termArray[i][0]);
			}
		}

		display_html = "Terms we looked for included:"
		for(var i=0;i<terms.length;i++) {
			if(i==terms.length-1) {
				display_html = display_html + " " + terms[i];
			}
			else {
				display_html = display_html + " " + terms[i] + ",";
			}
		}
		document.getElementById("terms").innerHTML = display_html;
	}

//Tabbing features

    function init() {

      // Grab the tab links and content divs from the page
      var tabListItems = document.getElementById('tabs').childNodes;
      for ( var i = 0; i < tabListItems.length; i++ ) {
        if ( tabListItems[i].nodeName == "LI" ) {
          var tabLink = getFirstChildWithTagName( tabListItems[i], 'A' );
          var id = getHash( tabLink.getAttribute('href') );
          tabLinks[id] = tabLink;
          contentDivs[id] = document.getElementById( id );
        }
      }

      // Assign onclick events to the tab links, and
      // highlight the first tab
      var i = 0;

      for ( var id in tabLinks ) {
        tabLinks[id].onclick = showTab;
        tabLinks[id].onfocus = function() { this.blur() };
        if ( i == 0 ) tabLinks[id].className = 'selected';
        i++;
      }

      // Hide all content divs except the first
      var i = 0;

      for ( var id in contentDivs ) {
        if ( i != 0 ) contentDivs[id].className = 'tabContent hide';
        i++;
      }

    }

    function showTab() {
      var selectedId = getHash( this.getAttribute('href') );

      // Highlight the selected tab, and dim all others.
      // Also show the selected content div, and hide all others.
      for ( var id in contentDivs ) {
        if ( id == selectedId ) {
          tabLinks[id].className = 'selected';
          contentDivs[id].className = 'tabContent';
          graph(selectedId);
        } else {
          tabLinks[id].className = '';
          contentDivs[id].className = 'tabContent hide';
        }
      }

      // Stop the browser following the link
      return false;
    }

    function getFirstChildWithTagName( element, tagName ) {
      for ( var i = 0; i < element.childNodes.length; i++ ) {
        if ( element.childNodes[i].nodeName == tagName ) return element.childNodes[i];
      }
    }

    function getHash( url ) {
      var hashPos = url.lastIndexOf ( '#' );
      return url.substring( hashPos + 1 );
    }