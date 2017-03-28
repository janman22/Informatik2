(function () {

function Card (rank, suit, x, y, reverseValue) {

    this.rank = rank;
    this.suit = suit;
    this.x = x;
    this.y = y;
    this.value = 14 - reverseValue;

};

function Deck() {

    this.deck = [];
    this.makeDeck = makeDeck;
    this.shuffle = shuffle;
}
function makeDeck() {

    var ranks = new Array("A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2", "W", "N");
    var suits = new Array("Clubs", "Spades", "Diamonds", "Hearts");

    this.deck = [];

    var i, j;
    for (i = 0; i < suits.length; i++) {
        for (j = 0; j < ranks.length; j++) {
            this.deck[i*ranks.length + j] = new Card(ranks[j], suits[i], getX(j, i), getY(j, i), j);
        }
    }
};

function getX (rank, suit) {
  var x;
  if (rank <= 12) {
    x = (13 * suit + rank) % 11;
  }
  else if (rank == 13) {
    x = 9;
  }
  else if (rank == 14) {
    x = 10;
  }
  return x;
};

function getY (rank, suit) {
  var y;
  if (rank <= 12) {
    y = Math.floor((13 * suit + rank) / 11);
  }
  else {
    y = 4;
  }
  return y;
};

function shuffle(n) {
    var i, j, temp;
    for (i = 0; i < n; i++) {
        for (j = 0; j < this.deck.length; j++) {
            k = Math.floor(Math.random() * this.deck.length);
            temp = this.deck[j];
            this.deck[j] = this.deck[k];
            this.deck[k] = temp;
        }
    }
};

myDeck = new Deck();

//Deck befüllen
myDeck.makeDeck();
// 3 Mal mischen
myDeck.shuffle(3);

} ());
