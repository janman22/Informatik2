<?php
include 'config.php';

// Verbindung herstellen
$conn = new mysqli($servername, $username, $password);

// Verbindung testen
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";

// Datenbank erstellen
$sql = "CREATE DATABASE ".$dbname;
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully";
} else {
    echo "Error creating database: " . $conn->error;
}

$conn->close();

// Verbindung zur Datenbank
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Verbindung testen
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// SQL, um Tabelle zu erstellen
$sql = "CREATE TABLE " . $tbname . " (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
highscore_zero INT,
highscore_one INT,
highscore_two INT,
highscore_three INT,
reg_date TIMESTAMP
)";

if (mysqli_query($conn, $sql)) {
    echo "Table " . dbname . " created successfully";
} else {
    echo "Error creating table: " . mysqli_error($conn);
}

$sql = "INSERT INTO " . $tbname . " (id, highscore_zero, highscore_one, highscore_two, highscore_three)
        VALUES (1, 0, 0, 0, 0);";
$conn->query($sql);
$conn->close();

mysqli_close($conn);

$conn->close();
?>
