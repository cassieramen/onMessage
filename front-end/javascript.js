function httpGet(theUrl)
{
	var xmlHttp = null;

	xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, false );
	try {
		xmlHttp.send(null);
	}
	catch(e) {
		console.log(e);
		console.log(xmlHttp);
	}
	alert(xmlHttp.responseText);
	return xmlHttp.responseText;
}