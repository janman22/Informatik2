<?php
include 'config.php';

// Verbindung herstellen
$conn = mysqli_connect($servername, $username, $password, $dbname);
if (!$conn) {
   die('Could not connect: ' . mysqli_error($con));
}

$sql = "SELECT * FROM " .$tbname;
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
      $max_zero = max (intval($_GET["pzero"]), intval($row["highscore_zero"]));
      $max_one = max (intval($_GET["pone"]), intval($row["highscore_one"]));
      $max_two = max (intval($_GET["ptwo"]), intval($row["highscore_two"]));
      $max_three = max (intval($_GET["pthree"]), intval($row["highscore_three"]));

      $sql = "UPDATE " .$tbname. " SET highscore_zero='".$max_zero."', highscore_one='".$max_one."', highscore_two='".$max_two."', highscore_three='".$max_three."' WHERE id='1'";

      if ($conn->query($sql) === TRUE) {
        echo '{"player0": ' .$row["highscore_zero"]. ', "player1": ' .$row["highscore_one"].
        ', "player2": '.$row["highscore_two"]. ', "player3": ' .$row["highscore_three"]. '}';
      } else {
          echo "Error: " . $sql . "<br>" . $conn->error;
      }

      $conn->close();
      // echo max (intval($_GET["pzero"]), intval($row["highscore_zero"]));
    }
}
mysqli_close($conn);
?>
