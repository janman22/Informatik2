<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <title>Wizard Kartenspiel</title>
    <link rel="stylesheet" href="style/style.css">
  </head>
  <body>
    <div id="flex">
      <div id="left">
        <div id="trump"></div>
        <div class="stack" id="stack-0"></div>
        <div class="stack" id="stack-1"></div>
        <div class="stack" id="stack-2"></div>
        <div class="stack" id="stack-3"></div>
        <div id="field"></div>
      </div>
      <div id="right">
        <h2>Wizard Block</h2>
        <div id="round-container">Runde: <span id="round"></span></div>
        <table id="stats" style="width:100%">
         <tr>
           <th>Spieler</th>
           <th>Punkte</th>
           <th>Tipp</th>
           <th>Stiche</th>
         </tr>
       </table>
       <div id="info"></div>
       <?php
       include 'config.php';
       $conn = new mysqli($servername, $username, $password, $dbname);
       if ($conn->connect_error) {
           die("Connection failed: " . $conn->connect_error);
       }
       $sql = "SELECT * FROM " .$tbname;
       $result = $conn->query($sql);

       if ($result->num_rows > 0) {
           while($row = $result->fetch_assoc()) {
               echo '<div id="highscores"> <b>Highscores:</b><br>Spieler 1: ' .$row["highscore_zero"]. ' - '.
               'Spieler 2: ' .$row["highscore_one"]. '<br>'.
               'Spieler 3: ' .$row["highscore_two"]. ' - '.
               'Spieler 4: ' .$row["highscore_three"]. '</div><br>';
           }
         }?>
       <img src="img/wizard.png" alt="Wizard" width="30%"/>
       <footer><> with &#x2764; by Jannick Apitz</footer>
      </div>
    </div>
  </body>
      <script data-main="js/game" src="js/require.js"></script>
</html>
