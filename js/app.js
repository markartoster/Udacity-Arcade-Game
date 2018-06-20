let positionYArray = [72, 154, 236];
let positionXArray = [-50, -70, -90, -110];
let stoneTiles = [[0,72],
                  [100,72],
                  [200,72],
                  [300,72],
                  [400,72],
                  [0,154],
                  [100,154],
                  [200,154],
                  [300,154],
                  [400,154],
                  [0,236],
                  [100,236],
                  [200,236],
                  [300,236],
                  [400,236]];
let startingPosition = [0,400];

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = positionXArray[Math.round(Math.random() * (3-0) + 0)];
    this.y = positionYArray[Math.round(Math.random() * (2-0) + 0)];
    this.speed = Math.random() * (100 - 25 ) + 25;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    this.speed += Math.random()*(.5 - .1) + .1;
    //console.log(allEnemies);
    if (window.ctx.canvas.width < this.x) {
      allEnemies.splice(allEnemies.indexOf(this), 1);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

let Player = function() {
  this.x = startingPosition[0];
  this.y = startingPosition[1];
  this.sprite = 'images/char-boy.png';
}

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.update = function(dt){

  allEnemies.forEach(function(enemy){

    if (((player.x >= enemy.x) &&
       (player.x +20 <= (enemy.x + window.Resources.get("images/enemy-bug.png").width))  &&
       (player.y == enemy.y ))
       ||
       (((player.x < enemy.x) &&
       (player.x >= (enemy.x - window.Resources.get("images/char-boy.png").width * .8 ))) &&
       ((player.y == enemy.y )))) {
         player.x = startingPosition[0];
         player.y = startingPosition[1];
    }

  });
  // console.log(`X: ${player.x}, Y: ${player.y}`);
  if(this.y <= 40) {
    this.x = startingPosition[0];
    this.y = startingPosition[1];
  }
}

Player.prototype.handleInput = function(keyNum) {
  if (keyNum === 'up') {
    this.y += -82;
  }
  if (keyNum === 'down') {
    if(this.y <399)
      this.y+= 82;
  }
  if (keyNum === 'right') {
    if(this.x < 400)
      this.x+= 100;
  }
  if (keyNum === 'left') {
    if(this.x > 50)
      this.x+= -100;
  }
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


var Star = function(){
  this.x = stoneTiles[Math.round(Math.random() * (stoneTiles.length - 0) + 0)][0];
  this.y = stoneTiles[Math.round(Math.random() * (stoneTiles.length - 0) + 0)][1];
  this.score = 10;
  this.sprite = 'images/Star.png';
}

Star.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

let allEnemies = [];

let player = new Player();
let star = new Star();
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
