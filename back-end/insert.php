<?php
$con=mysqli_connect("127.0.0.1","root","","topics");
// Check connection
if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

$sql="INSERT INTO topics (title, term)
VALUES
('$_POST[category]','$_POST[term]')";

if (!mysqli_query($con,$sql))
  {
  die('Error: ' . mysqli_error($con));
  }
echo "Success!";

mysqli_close($con);

?> 