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
        echo '{"player0": ' .$row["highscore_zero"]. ', "player1": ' .$row["highscore_one"].
        ', "player2": '.$row["highscore_two"]. ', "player3": ' .$row["highscore_three"]. '}';
    }
}
mysqli_close($con);
?>
