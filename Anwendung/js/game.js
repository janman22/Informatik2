//Configs
var nrPlayers = 4,      // Anzahl Spieler : int
    players = [],        // Array mit Spielerdaten
    playerHands = [],   // Array der Länge von nrPlayers, enthält Arrays mit den Hand-Karten der Spieler Array[Array[Card]]
    cardPosition = 0,   // Gibt an, wie viele Karten wir schon aus dem Deck entnommen haben: int
    round = 1,          // Gibt an wie viele Karten ausgeteilt werden: int
    turn = 0,           // Wert zwischen 0 und nrPlayers * round, gibt an, wie viele Karten insgesamt gelegt wurden: int
    startPlayer = 0,    // Nummer des Spielers der die Runde begonnen hat: int
    turnPlayer = 0,     // Nummer des Spielers, der dran ist: int
    stack = [],         // Karten, die in dieser Runde gelegt wurden: Array[Card]
    myDeck,             // Das Kartendeck aus dem deck.js Objekt: Deck
    trump,              // Die Karte, die Trump angibt, Objekt: Card
    SOUND_dealingCard = new Audio("sounds/dealingCard.wav"), // Sound, wenn eine Karte gespielt wird
    SOUND_tippCheck = new Audio("sounds/tippCheck.wav"), // Sound, wenn der Tipp abgegeben wird
    SOUND_distributeCards = new Audio("sounds/distributeCards.wav"); // Sound, wenn Karten ausgeteilt werden


// Befülle den Array playerHands mit den Arrays für die Karten auf den Spielerhänden
for (var i = 0; i < nrPlayers; i++){
    playerHands[i] = [];
    var nr = i+1;
    players[i] = { name: "Spieler" + nr, points: 0, tipp: "", actual: 0 };
}

// Warte auf das Einfügen der deck.js und führt dann weiter aus (src: require.js)
require(['js/deck.js'], function () {


//fügt eine Karte aus der Hand eines Spielers zum Stack hinzu, wenn erlaubt
var addToStack = function (el, card, player, cardNumber) {
  var stackEl;
  console.log(debugInfo());
  if (player == turnPlayer && isAllowed(card, player, cardNumber)) {
    var t = turn%nrPlayers;

    // Sound abspielen, aktuelle Zeit auf null falls spieler sehr schnell hintereinander legen
    SOUND_dealingCard.currentTime=0;
    SOUND_dealingCard.play();

    // Füge die durch Klick gewählte Karte zum Stack hinzu und setze den Sprite des Stack-Elements
    // auf das der gewählten Karte
    stack[t] = card;
    stackEl = document.getElementById("stack-"+t);
    stackEl.style.backgroundImage = "url('img/CardDeck.png')";
    stackEl.style.backgroundPosition = el.style.backgroundPosition;


    // Karte aus der Hand des Spielers verstecken und Karten-Objekt auf NULL setzen
    el.style.visibility = "hidden";
    playerHands[player][cardNumber] = null;

    // Bestimme den Spieler, der als nächstes dran ist.
    setTurnPlayer();
    showTurnPlayer();
    turn++;
  }
  // Wenn Jeder Spieler eine Karte gelegt hat, setze den Stack zurück
  if (turn !== 0 && turn%nrPlayers == 0) {
    players[whoWins()].actual += 1;
    setTable();
    setTimeout(function() { nextTurnRound(); }, 500);
  }
  // Wenn alle Karten gelegt wurden, beginne eine neue Runde
  if (turn == nrPlayers*round){
    setTimeout(function() { nextRound(); showTurnPlayer(); }, 500);
  }
};

// Fülle die Hände mit Karten und setze die HTML-Elemente mit den Karten in die entsprechenden Hand-Elemente ein
var distributeCards = function (round, playerId) {
  var html = "", offset = (nrPlayers == 4)? -3.2*round : -2.7*round;
  for (var i = 0; i < round; i++) {
    playerHands[playerId][i] = myDeck.deck[cardPosition];
    cardPosition++;
    if (i > 0) {
      html += "<div style=\"margin-left:" + offset + "px\" class=\"card card-"+playerId+"\" id=\"card-pId" +playerId+"-cNr"+i+"\"></div>";
    } else {
      html += "<div class=\"card card-"+playerId+"\" id=\"card-pId" +playerId+"-cNr"+i+"\"></div>";
    }
  }
  // setze auch den Trumpf
  if (playerId === 3) {setTrump();}
  return html;
};

// Gebe den Karten die richtigen Sprites und füge den Click-Listener hinzu, damit die Karten gespielt werden können.
var setCards = function () {
  for (var i = 0; i < nrPlayers; i++) {
    for (var j = 0; j < round; j++) {
      (function () {
        var element = document.getElementById("card-pId"+i+"-cNr"+j);
        var card = playerHands[i][j];
        var player = i;
        var cardNumber = j;
        element.style.backgroundPosition = (card.x*-68)+"px "+(card.y*-96)+"px";
        element.addEventListener("click", function () {addToStack(this, card, player, cardNumber);});
      }());
    }
  }
};

// Befülle das Spielfeld mit den Spielerhand-Elementen.
var buildHands = function (players, rnd) {
  SOUND_distributeCards.play();

  var field = "";
  for (var i = 0; i < players; i++){
    field += "<div class=\"playerHand\" id =\"playerHand-" + i + "\"><div class=\"tipp-container\"><input class=\"tipp\" id=\"tipp-" + i + "\" type=\"number\" placeholder=\"0\" min=\"0\" max=" + round + "><button id=\"tipp-btn-" + i + "\">Tipp</button></div>" + distributeCards(rnd, i) + "</div>";
  }
  document.getElementById("field").innerHTML = field;
  setCards();
};

// Erstelle den Stack mit so vielen Elementen, wie es Spieler gibt.
var buildStacks = function (players) {
  for (var i = 3; i >= (players); i--){
    document.getElementById("stack-"+i).style.visibility = "hidden";
  }
};

// Befülle die Tabelle mit den Spielern
var buildTable = function () {
  var table = document.getElementById("stats");
  for (var i = 1; i <= nrPlayers; i++){
      var row = table.insertRow(i);
      var player = row.insertCell(0), points = row.insertCell(1), tipp = row.insertCell(2), actual = row.insertCell(3);
      player.innerHTML = players[i-1].name;
      points.innerHTML = players[i-1].points;
      actual.innerHTML = players[i-1].actual;
  }
};

// Starte eine neue Runde
var nextRound = function () {
  calcPoints();
  resetActual();
  setTable();
  cardPosition = 0;
  turn = 0;
  stack = [];
  myDeck.shuffle(3);
  for (var i = 0; i < nrPlayers; i++){
      playerHands[i] = [];
      document.getElementById("stack-"+i).style.backgroundImage = "none";
  }
  turnPlayer = round % nrPlayers;
  if (setRound()) {
    buildHands(nrPlayers, round);
    showTippInputs();
    setInfo("Eine neue Runde startet, eure Tipps bitte" ,false);
  }
};

var nextTurnRound = function () {
  turnPlayer = whoWins();
  var pNr = turnPlayer + 1;
  setInfo("Spieler " + pNr + " holt den Stich" ,false);
  showTurnPlayer();
  for (var i = 0; i < nrPlayers; i++){
      document.getElementById("stack-"+i).style.backgroundImage = "none";
      stack[i] = null;
  }
};

// Prüfe, ob es dem Spieler erlaubt ist, diese Karte zu spielen
var isAllowed = function (cardObject, player, cardNumber) {
  // Prüfe, ob alle getippt haben und ob der Spieler dran ist
  if (!checkForStartRound()) {
    setInfo("Warte bis alle getippt haben", true)
    return false;
  }
  if (player !== turnPlayer){
    return false;
  }
  if (typeof stack[0] === "undefined" || cardObject.rank === "W" || cardObject.rank === "N") {
    return true;
  }
  else if (checkForSuit(cardObject, player) && !(didServe(cardObject))) {
    pNr = player + 1;
    setInfo("Spieler " + pNr + ", bitte bedienen!", true);
    return false;
  }
  return true;
};

// Prüfe, ob der Spieler eine Karte auf der Hand hat, mit der er bedienen muss.
var checkForSuit = function (cardObject, player) {
  if (stack[0] === null) {return false;}
  for (var i = 0; i < playerHands[player].length; i++) {
    if (playerHands[player][i] !== null && playerHands[player][i].suit === stack[0].suit && playerHands[player][i].rank !== "W" && playerHands[player][i].rank !== "N"){
      return true;
    }
  }
  return false;
};

// Prüfe, ob richtig bedient wurde
var didServe = function (cardObject) {
  if (stack[0].rank == "W" || stack[0].rank == "N") {
    return true;
  }
  else if (cardObject.suit == stack[0].suit) {
    return true;
  }
  return false;
};

// Wer gewinnt WIZRAD-LOGIK!
var whoWins = function () {
  var highestTrump, highestTrumpVal = -1, highestSecTrump, highestSecTrumpVal = -1;
  var secTrump = getSecTrump();
  for (var i = 0; i < nrPlayers; i++){
      // Der erste gelegte Zauberer gewinnt immer
       if (stack[i].rank == "W") { return convertStackIdToPlayer(i); }
       // Wenn es keinen Zauberer gibt und der Trumpf weder W noch N ist, schaue ob es ein neuer höchster Trumpf ist
       if (trump.rank != "N" && trump.rank != "W" && stack[i].suit == trump.suit && stack[i].value > highestTrumpVal) {
         highestTrump = i;
         highestTrumpVal = stack[i].value;
       }
       // Wenn es keine Trümpfe gibt, schaue nach Karten, die bedient haben und ob sie die neue höchste Karte sind
       if ( secTrump && stack[i].suit == secTrump.suit && stack[i].value > highestSecTrumpVal) {
         highestSecTrump = i;
         highestSecTrumpVal = stack[i].value;
       }
  }
  if (highestTrumpVal >= 0) { return convertStackIdToPlayer(highestTrump); }
  else if (highestSecTrumpVal >= 0) { return convertStackIdToPlayer(highestSecTrump); }

  for (var j = 0; j < nrPlayers; j++){
    // Sonst gewinnt die erste Karte, die kein Narre ist
    if (stack[j] != "N") { return convertStackIdToPlayer(j);}
    // Wenn alle Karten Narren sind, gewinnt der erste Narre
    else { return convertStackIdToPlayer(0);}
  }
};

// Schaue, welcher Spieler die Karte an der Stelle id gelegt hat
// Hierzu wird vom Spieler der als erstes dran war die stack-ID weitergezählt und Modulo nrPlayers genommen
var convertStackIdToPlayer = function (id) {
  return (turnPlayer + id) % nrPlayers;
}

// Schaue, was der zweite Trumpf ist: este Karte, die kein Narre ist
var getSecTrump = function () {
  // Gib die erste Karte, die Kein Narre ist im Stack zurück
  for (var i = 0; i < nrPlayers; i++){
    if (stack[i].rank != "N") {
      return stack[i];
    }
  }
  // Wenn alle Karten Narren sind, gib null zurück
  return null;
}

// Berechne die Punkte
var calcPoints = function () {
  for (var i = 0; i < nrPlayers; i++){
      if (players[i].tipp === players[i].actual) {
        players[i].points += (20 + players[i].tipp*10);
      }
      else {
        players[i].points -= (Math.abs(players[i].tipp-players[i].actual)*10);
      }
  }
};

// Bestimme Trumpf und setze ihn aufs Spielfeld
var setTrump = function () {
  if (cardPosition < 60){
    trump = myDeck.deck[cardPosition];
    cardPosition++;
    document.getElementById("trump").style.backgroundPosition = (trump.x*-68)+"px "+(trump.y*-96)+"px";
  }
  else {
    trump = myDeck.deck[0];
    trump.rank = "N";
    document.getElementById("trump").style.backgroundImage = "none";
  }
};

// Erhöhre Round um 1 und aktualisiere es in der View
var setRound = function () {
  if (round < (60 / nrPlayers)) {
    round++;
    document.getElementById("round").innerHTML = round;
    return true;
  }
  else {
    // Highscores eintragen
    setHighscores();

    var max = -1000, winner;
    for (var i = 0; i < nrPlayers; i++){
        if (players[i].points > max) {
          max = players[i].points;
          winner = i + 1;
        }
    }
    setInfo("Das Spiel ist vorbei. Der Gewinner ist Spieler " + winner + " mit " + max + " Punkten", false);
    setInfo("Ein neues Spiel startet, viel Glück", false);
    round = 1;
    document.getElementById("round").innerHTML = round;
    return false;
  }
};

//Bestimme, wer dran ist
var setTurnPlayer = function () {
  turnPlayer = (turnPlayer+1) % nrPlayers;
};

// Aktualisiere die Tabellendaten mit den Stats
var setTable = function () {
  var table = document.getElementById("stats");
  for (var i = 1; i <= nrPlayers; i++){
      table.rows[i].cells[1].innerHTML = players[i-1].points;
      table.rows[i].cells[2].innerHTML = players[i-1].tipp;
      table.rows[i].cells[3].innerHTML = players[i-1].actual;
  }
};

// Aktualisiere den Inhalt der Infobox
var setInfo = function (info, warning) {
  var history = document.getElementById("info").innerHTML
  if (!warning) {
    history = info + "...<br>" + history;
  }
  else {
    history = "<span style=\"color:red;\"> " + info + "...</span><br>" + history;
  }
  document.getElementById("info").innerHTML = history;
}

// Setze die aktuellen Stiche und Tipps wieder auf 0
var resetActual = function () {
  for (var i = 0; i < nrPlayers; i++){
      players[i].actual = 0;
      players[i].tipp = "";
  }
};

// Übernehme die Punkteschätzungen aus den input Feldern
// Prüfe ob alle Spieler einen Tipp abgegeben haben
var takeTipps = function (id) {
  SOUND_tippCheck.currentTime=0;
  SOUND_tippCheck.play();
  pNr = id + 1;
  players[id].tipp = Number (document.getElementById("tipp-"+id).value);
  setInfo("Spieler " + pNr + " tippt " + players[id].tipp + " Stich(e)", false);
  document.getElementById("tipp-"+id).style.visibility = "hidden";
  document.getElementById("tipp-btn-"+id).style.visibility = "hidden";
  setTable();
  pNr = 1 + turnPlayer;
  if (checkForStartRound()){ setInfo("Los geht's - Spieler " + pNr + " beginnt<br>.....", false) }
};

// Schaue, ob alle getippt haben und die neue Runde starten kann
var checkForStartRound = function () {
  for (var i = 0; i < nrPlayers; i++) {
    if (document.getElementById("tipp-"+i).style.visibility === "" || document.getElementById("tipp-"+i).style.visibility === "visible"){
      return false;
    }
  }
  return true;
};

// Zeige die Tipps und setze zu zurück. Immer zu Beginn einer neuen Runde
var showTippInputs = function ()  {
    for (var i = 0; i < nrPlayers; i++) {
      document.getElementById("tipp-"+i).value = "";
      document.getElementById("tipp-"+i).style.visibility = "visible";
      document.getElementById("tipp-btn-"+i).style.visibility = "visible";
      (function () {
        var id = i;
        document.getElementById("tipp-btn-"+i).addEventListener("click", function () {takeTipps(id);});
      }());
    }
};

// Füge die Klick-Event-Listener zu den Buttons hinzu.
var setTippInputs = function () {
  for (var i = 0; i < nrPlayers; i++) {
    (function () {
      var id = i;
      document.getElementById("tipp-btn-"+i).addEventListener("click", function () {takeTipps(id);});
    }());
  }
};

// Zeige an, wer dran ist
var showTurnPlayer = function () {
  for (var i = 0; i < nrPlayers; i++){
    if (i == turnPlayer){
      document.getElementById("playerHand-"+i).style.backgroundColor = "rgba(39, 174, 96, 0.7)";
    }
    else {document.getElementById("playerHand-"+i).style.backgroundColor = "rgba(165, 42, 42, 0.7)";}
  }
};

// Speichere neue highscores, falls es welche gibt
var setHighscores = function () {
  xmlhttpSet = new XMLHttpRequest();
  xmlhttpSet.open("GET","set_highscores.php?pzero=" + players[0].points + "&pone=" + players[1].points + "&ptwo=" + players[2].points + "&pthree=" + players[3].points, true);
  xmlhttpSet.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var scores = JSON.parse(this.responseText);
      document.getElementById("highscores").innerHTML = "Highscores:</br>" + "Spieler 1: " + scores.player0 +
      " - Spieler 2: " + scores.player1 + "</br>Spieler 3: " + scores.player2 + " - Spieler 4: " + scores.player3;
    }
  };
  xmlhttpSet.send();
}

// Info-Objekt in der Konsole zum Debuggen
var debugInfo = function () {
  return {"Spielerhände": playerHands,
      "Karten aus Deck entnommen": cardPosition,
      "Runde": round,
      "Zug": turn,
      "Startspieler": startPlayer,
      "Spieler ist dran": turnPlayer,
      "Stapel in der Mitte": stack};
};

// Leg los!
setRound();
buildStacks(nrPlayers);
buildHands(nrPlayers, round);
showTurnPlayer();
setTippInputs();
buildTable();
setInfo("Eine neue Runde startet, eure Tipps bitte", false);

setHighscores();
});
