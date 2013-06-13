<?php
	$con=mysqli_connect("127.0.0.1","root","","topics");
	// Check connection
	// Check connection
	if (mysqli_connect_errno())
	  {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	  }

	$result = mysqli_query($con,"SELECT term FROM topics where title='Immigration'");

	if($result) {
		while($row = mysqli_fetch_array($result))
		  {
		  echo $row['term'];
		  }
	}

	mysqli_close($con);

?>