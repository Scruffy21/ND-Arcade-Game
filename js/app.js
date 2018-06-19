// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    const speedRange = [100, 400];
    const spawnPositions = [62, 147, 227];
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = - 100;
    this.y = spawnPositions[Math.floor(Math.random() * spawnPositions.length)];
    this.speed = Math.floor(Math.random() * (speedRange[1]-speedRange[0]) + speedRange[0]);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x >= 600) {
        this.remove();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.remove = function () {
    allEnemies.splice(allEnemies.indexOf(this), 1);
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function (character) {
    this.sprite = `images/char-${character}.png`;
    this.speed = 1000;
    this.moveDir = null;
    this.x = 200;
    this.y = 380;
};

Player.prototype.update = function (dt) {
    let tempX = this.x, tempY = this.y;
    switch (this.moveDir) {
        case "left":
            tempX -= this.speed * dt;
            break;
        case "up":
            tempY -= this.speed * dt;
            break;
        case "right":
            tempX += this.speed * dt;
            break;
        case "down":
            tempY += this.speed * dt;
            break;
    }

    if (this.checkBounds(tempX, tempY)) {
        this.x = tempX;
        this.y = tempY;
    }
    this.moveDir = null;

    // check if there is a collision with an enemy
    if (allEnemies.some(function (enemy) {
        return player.checkCollision(enemy);
    })) {
        gameOver("lost");
    }

    //check if reached water
    if (player.y <= 3) {
        gameOver("won");
    }

    if (Math.random() < 0.03) {
        allEnemies.push(new Enemy());
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.checkBounds = function (tempX, tempY) {
    return tempX >= -15 && tempX <= 415 && tempY > -20 && tempY < 450;
}

Player.prototype.handleInput = function (key) {
    if (key === "left" || key === "up" || key === "right" || key === "down") {
        this.moveDir = key;
    }
}

Player.prototype.checkCollision = function (obj) {
    //check if left border of player is further to the left than right border of enemy
    //and if top border of player is further up than bottom border of enemy
    // and the 2 other borders
    // then check the same for the other borders
    return (this.x + 18 <= obj.x + 98 && this.y + 65 <= obj.y + 143) &&
    (this.x + 84 >= obj.x + 2 && this.y + 138 >= obj.y + 78)
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const allEnemies = [new Enemy()];
// const allEnemies = [new Enemy(100, 100, 0)];

const player = new Player("boy");


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

const msg = document.querySelector(".outcome-message");
const replay = document.querySelector(".play-again");


function gameOver(result) {
    window.cancelAnimationFrame(window.frameRequestID);
    if (result === "won") {
        msg.textContent = "Congratulations, you won.";
    }
    else {
        msg.textContent = "You lost.";
    }
    msg.parentElement.parentElement.style.display = "flex";
}