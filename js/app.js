
//Positions
let positionYArray = [72, 154, 236];
let positionXArray = [-50, -70, -90, -110];
// where: [x,y]
let waterTiles = [[0,-10],
                  [100,-10],
                  [200,-10],
                  [300,-10],
                  [400,-10]]
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

//Game Objects
let maxEnemies = 4;
let maxStars = 1;

//Difficulty spikes
let spikes = [500, 1000, 1500, 2000, 2500, 5000, 10000];
let difficultyFlag = 0;
let addedSpeed = 0;

//Logic
let isStarCollected = false;

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
  this.score = 0;
  this.lives = 3;
  this.sprite = 'images/char-boy.png';
}

Player.prototype.render = function() {

  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.update = function(dt){

  $("#score").text(this.score);
  $("#lives").text(this.lives);

  /* Checks for Player-Enemy colision. It checks for both back of enemy(second condition)
   * and it's front side(first condition). It resets position on collision,
   */
  allEnemies.forEach(function(enemy){
    if (((player.x >= enemy.x) &&
       (player.x +20 <= (enemy.x + window.Resources.get("images/enemy-bug.png").width))  &&
       (player.y == enemy.y ))
       ||
       (((player.x < enemy.x) &&
       (player.x >= (enemy.x - window.Resources.get("images/char-boy.png").width * .8 ))) &&
       ((player.y == enemy.y )))) {
         player.lives -= 1;
         player.x = startingPosition[0];
         player.y = startingPosition[1];
         if (player.lives < 0 ) {
           resetGame();
         }
    }
  });

  //Checks for collision Player-Star (loops through all stars)
  allStars.forEach(function(star){
    if(player.x == star.x && player.y == star.y){
      console.log("works");
      isStarCollected = true;
      allStars.splice(0, 1);
    }
  })

  //Checks if Player entered water.
  if(this.y <= 40) {
    this.x = startingPosition[0];
    this.y = startingPosition[1];
    if (isStarCollected) {
      console.log(this.score);
      isStarCollected = false;
      this.score += 100;
    } else {
      this.score += 1;
    }
    difficultyUp();
  }
}

//Checks for arrows clicks and makes sure player can't get out of bounds
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

//Star constructor to create star collectible, star is respawned on random stone tile
var Star = function(){
  this.x = stoneTiles[Math.round(Math.random() * ((stoneTiles.length - 1) - 0) + 0)][0];
  this.y = stoneTiles[Math.round(Math.random() * ((stoneTiles.length - 1) - 0) + 0)][1];
  this.sprite = 'images/Star.png';
}

Star.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];
let allStars = [];
let player = new Player();

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

/*Function increasing difficulty based on score, gets called every time player scores points. It loops infinitely after 10000 points, every 1000 extra points
  While difficultyFlag variable makes sure same difficulty adjustment is applied only once per run.
  */
const difficultyUp = function() {
  if (player.score >= spikes[0] && player.score < spikes[1] && difficultyFlag == 0) {
    maxEnemies+=1;
    allEnemies.forEach(function(enemy){
      enemy.speed +=.02;
    });
    addedSpeed += .02;
    difficultyFlag += 1;
  } else if (player.score >= spikes[1] && player.score < spikes[2] && difficultyFlag == 1) {
    allEnemies.forEach(function(enemy){
      enemy.speed +=.02;
    });
    addedSpeed += .02;
    difficultyFlag += 1;
  } else if (player.score >= spikes[2] && player.score < spikes[3] && difficultyFlag == 2) {
    maxEnemies +=1;
    allEnemies.forEach(function(enemy){
      enemy.speed +=.02;
    });
    addedSpeed += .02;
    difficultyFlag += 1;
  } else if (player.score >= spikes[3] && player.score < spikes[4] && difficultyFlag == 3) {
    allEnemies.forEach(function(enemy){
      enemy.speed +=.02;
    });
    addedSpeed += .02;
    difficultyFlag += 1;
  } else if (player.score >= spikes[4] && player.score < spikes[5] && difficultyFlag == 4) {
    maxEnemies +=1;
    allEnemies.forEach(function(enemy){
      enemy.speed +=.02;
    });
    addedSpeed += .02;
    difficultyFlag += 1;
  } else if (player.score >= spikes[5] && player.score < spikes[6] && difficultyFlag == 5) {
    maxEnemies +=1;
    allEnemies.forEach(function(enemy){
      enemy.speed +=.01;
    });
    addedSpeed += .01;
    difficultyFlag += 1;
  } else if (player.score >= spikes[6] && player.score < (player.score + 1000) && difficultyFlag == 6) {
    maxEnemies +=.5;
    allEnemies.forEach(function(enemy){
      enemy.speed +=.01;
    });
    addedSpeed += .01;
    difficultyFlag += 1;
  }
};

/* Function resets gamr after losing all lives. It resets score, lives and
 * basic variables. Also makes sure that buffs applied to enemies get reverted.
 * In the end star is replaced with new one and collected star is discarded.
 */
const resetGame = function() {
  player.score = 0;
  player.lives = 3;
  difficultyFlag = 0;
  maxEnemies = 4;
  allEnemies.forEach(function(enemy){
    enemy.speed -= addedSpeed;
  });
  addedSpeed = 0;
  if (!isStarCollected) {
    allStars.splice(0,1);
  } else {
    isStarCollected = false;
  }
}
