<!DOCTYPE HTML>
<html>
<head>

<script language="javascript" type="text/javascript" src="jquery.js"></script>
<script type="text/javascript">

	$(function() {
		$("#select_box").change(function(){
			var result = $.get("getTerms.php");
			var current_topic = document.getElementById("select_box").value;
			if(current_topic == 'Energy') {
				document.getElementById("text_area").innerHTML = "energy, oil, environment, climate, warming, farmer, farmers, agriculture, renewable, solar, turbine, turbines, manufacture, wind, frack, fracking, windmills";
			}
			else if (current_topic == 'Immigration') {
			document.getElementById("text_area").innerHTML = "immigration, immigrant, immigrants, dream, deport, deported, deportation, illegal, citizen,citizenship";
			}
			else if (current_topic == 'Education') {
			document.getElementById("text_area").innerHTML = "education, teacher, teachers, school, schools, student, students, classroom, classrooms, college, colleges, university, universities,tuition";
			}
		});
	});

</script>

</head>

</body>
	<?php
		echo "<h1>Select Categories</h1>";
		$con=mysqli_connect("127.0.0.1","root","","topics");
		// Check connection
		// Check connection
		if (mysqli_connect_errno())
		  {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		  }

		$result = mysqli_query($con,"SELECT title FROM topics GROUP BY title");

		echo "<select id='select_box'>";
		while($row = mysqli_fetch_array($result))
		  {
		  echo "<option value='";
		  echo $row['title'];
		  echo "'>";
		  echo $row['title'];
		  echo "</option>";
		  echo "<br>";
		  }

		echo "</select>";

		mysqli_close($con);
	?>
	<div>
		<textarea rows="4" cols="50" id="text_area">energy, oil, environment, climate, warming, farmer, farmers, agriculture, renewable, solar, turbine, turbines, manufacture, wind, frack, fracking, windmills
		</textarea> 
	</div>

	<div id="new_category">
	<form action="insert.php" method="post">
		Category: <input type="text" name="category"><br>
		Term: <input type="text" name="term"><br>
	<input type="Submit">
	</form>
	</div>

</body>
</html>