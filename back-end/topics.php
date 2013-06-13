<?php
  $db_host='127.0.0.1';
  $db_database='topics';
  $db_username='root';
  $db_password='';

function addTerm($topic, $term) {
	//connect to db
	mysql_connect($db_host,$db_username,$db_password);
	@mysql_select_db($db_database) or die( "Unable to select database");
	
	//insert term associated with topic
	$query = "INSERT INTO topics (title, term) VALUES
	($topic, $term)";

	mysql_query($query);

	mysql_close();

}

function removeTerm($topic, $term) {
	//connect to db
	mysql_connect($db_host,$db_username,$db_password);
	@mysql_select_db($db_database) or die( "Unable to select database");
	
	//insert term associated with topic
	$query = "DELETE FROM topics WHERE title=$topic AND term=$term";

	mysql_query($query);

	mysql_close();

}

?>