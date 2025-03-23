/**
 * @class InstructionBackground
 * @brief Manages the instruction screen background.
 * Displays the instructions on the screen and transitions to the game when the Enter key is pressed.
 */
class InstructionBackground extends Sprite {
    constructor(image, width, height) {
        super();
        this.image = image;
        this.width = width;
        this.height = height;
        this.showInstructions = true; // Flag to toggle between instruction screen and game screen
    }

    update(sprites, keys) {
        // Toggle between instruction screen and game screen (e.g., when pressing Enter)
        if ('Enter' in keys && this.showInstructions) {
            this.showInstructions = false; // Hide the instruction screen
            // Call the function to start the game (add bricks)
            // Start background music
            gameMusic.play();

            brickResetter.resetBricks();
        }
    }

    draw(ctx) {
        if (this.showInstructions) {
            // Draw the background image
            ctx.drawImage(this.image, 0, 0, this.width, this.height);

            // Draw instructions text
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "20px Arial";
            ctx.fillText("Welcome to Break the Bricks!", 200, 100);
            
            // Game Story/Introduction
            ctx.font = "18px Arial";
            ctx.fillText("The objective is simple: break all the bricks and score points!", 150, 150);
            ctx.fillText("Use the paddle to bounce the ball and destroy the bricks.", 150, 180);
            ctx.fillText("The more bricks you break, the higher your score.", 150, 210);
            
            // Key Instructions
            ctx.font = "20px Arial";
            ctx.fillText("Press Enter to Start", 200, 250);
            ctx.fillText("Press P to Pause", 200, 280);
            ctx.fillText("Press C to Continue", 200, 310);
            ctx.fillText("Use Left and Right Arrow Keys to Move the Paddle", 200, 340);
            
            // Additional Gameplay Information
            ctx.font = "18px Arial";
            ctx.fillText("Avoid letting the ball fall off the bottom of the screen!", 150, 380);
            ctx.fillText("The game ends when all bricks are destroyed or if you run out of lives.", 150, 410);
            ctx.fillText("Can you break all the bricks and reach the highest score?", 150, 440);
        }
    }
}

/**
 * @class Background
 * @brief Manages the background image for the game.
 * Responsible for drawing the background during the game loop.
 */

class Background extends Sprite {
    
    constructor(image, width, height) {
        super();
        this.image = image;
        this.width = width;
        this.height = height;
    }
    
    update() {

    }

    draw(ctx) {
        ctx.drawImage(this.image, 0, 0, this.width, this.height);
    }
    
}

/**
 * @class Heart
 * @brief Represents a heart object in the game.
 * The heart typically represents lives or health, and it can be collected or interacted with by the player.
 */
class Heart extends Sprite {
    constructor(x, y, player) {
        super();
        this.x = x;
        this.y = y;
        this.width = 32; // Size of heart frame
        this.height = 32;
        this.player = player;

        // Animation properties
        this.spriteSheet = new Image();
        this.spriteSheet.src = "image/Heart.png"; // Sprite sheet file
        this.frameIndex = 0; // Current frame
        this.totalFrames = 4; // Total number of frames
        this.animationSpeed = 10; // Frames per update cycle
        this.animationCounter = 0; // Timer for animation
    }

    update() {
        // Animation update logic
        this.animationCounter++;
        if (this.animationCounter >= this.animationSpeed) {
            this.frameIndex = (this.frameIndex + 1) % this.totalFrames; // Cycle through frames
            this.animationCounter = 0;
        }
    }

    draw(ctx) {
        // Calculate the source rectangle for the current frame
        const sx = this.frameIndex * this.width;

        // Draw hearts based on remaining lives
        for (let i = 0; i < this.player.lives; i++) {
            ctx.drawImage(
                this.spriteSheet,
                sx,
                0,
                this.width,
                this.height,
                this.x + i * (this.width + 5),
                this.y,
                this.width,
                this.height
            );
        }
    }
}

/**
 * @class CoinSprite
 * @brief Represents a collectible coin sprite in the game.
 * The coin sprite can be collected by the player to increase score or provide some other form of benefit.
 */
class CoinSprite extends Sprite {
    constructor(x, y, coinWidth, coinHeight, totalFrames, animationSpeed) {
        super();
        this.x = x;
        this.y = y;
        this.coinWidth = coinWidth;
        this.coinHeight = coinHeight;
        this.totalFrames = totalFrames;
        this.animationSpeed = animationSpeed;
        this.coinAnimationFrame = 0; // To track which frame of the sprite sheet to display
        this.frameCounter = 0; // Counter for animation speed

        // Load the sprite sheet image inside the class
        this.spriteSheet = new Image();
        this.spriteSheet.src = "image/coin.png"; // Image URL inside the class
    }

    update() {
        // Update the coin animation frame every few updates
        this.frameCounter++;
        if (this.frameCounter % this.animationSpeed === 0) {
            this.coinAnimationFrame = (this.coinAnimationFrame + 1) % this.totalFrames;
            this.frameCounter = 0;
        }
    }

    draw(ctx) {
        // Draw the current frame of the coin sprite once the image is loaded
        if (this.spriteSheet.complete) { // Check if the image is fully loaded
            ctx.drawImage(
                this.spriteSheet, 
                this.coinAnimationFrame * this.coinWidth, 0,  // Source x and y coordinates (sprite sheet location)
                this.coinWidth, this.coinHeight,             // Source width and height of a single coin sprite
                this.x, this.y,                              // Position where the coin should be drawn on the canvas
                this.coinWidth * 1.5, this.coinHeight * 1.5  // Make the coin smaller (scaled by 1.5)
            );
        }
    }
}


// Game phases
const GAME_PHASE = {
    PHASE_1: 1,
    PHASE_2: 2,
    PHASE_3: 3
};

/**
 * @class Ball
 * @brief Represents the ball in the game.
 * Handles the ball's position, movement, bouncing, and collision detection.
 */
class Ball extends Sprite {
    constructor(centerX, centerY, radius, color, player) {
        super();
        this.posX = centerX;
        this.posY = centerY;
        this.radius = radius;
        this.color = color;
        this.player = player;
        this.isPlaying = false;
        this.isGameOver = false;
        this.isGameWon = false;
        this.score = 0;

        // Store the original paddle width to use later
        this.originalPaddleWidth = player.width;

        // Initial phase (Phase 1)
        this.phase = GAME_PHASE.PHASE_1;

        // Speed variables
        this.baseSpeed = 2;
        this.increasedSpeed = 6;
        this.speedX = this.baseSpeed;
        this.speedY = -this.baseSpeed;

        // Phase message to display on the screen
        this.phaseMessage = "Phase 1  The Beginning";

        // Sound effect for hitting the paddle
        this.hitPaddleSound = new Audio("assets/paddlesound.wav");
        this.hitPaddleSound.volume = 0.5;  // Adjust volume as needed
        
        // Winning sound flag
        this.winSoundPlayed = false;
    }

    update(sprites, keys) {
        // Handle game restart when 'R' is pressed
        if (('r' in keys) && this.isGameOver) {
            gameResetter.reset(); // Reset the game state when 'R' is pressed
            // Restart the background music when the game is reset
            gameMusic.play();
            gameMusic.loop = true;  // Optional: loop the music for continuous play
        }

        // Start the game when Enter is pressed
        if ('Enter' in keys && !this.isPlaying && !this.isGameOver && !this.isGameWon) {
            this.isPlaying = true;
            this.posX = this.player.x + this.player.width / 2;
            this.posY = this.player.y - 15;
    
            this.initializeSpeed();  // Set the speed based on the current phase
        }

        // If game is over or game is won, do not update ball position
        if (this.isGameOver || this.isGameWon) {
           
            return;
        }
    
        // Ball movement logic
        if (this.posY + this.radius < 140) this.speedY = 2;
        if (this.posX + this.radius < 130) this.speedX = 2;
        if (this.posX + this.radius > tableWidth - 130) this.speedX = -2;
    
        if (this.posY - this.radius > tableHeight - 145) {
            this.isPlaying = false;
            this.player.lives--;  // Decrement lives
            var loseLifeSound = new Audio("assets/lost-life.mp3");
            loseLifeSound.volume = 0.5;
            loseLifeSound.play();
    
            if (this.player.lives === 0) {
                this.isGameOver = true;
                gameMusic.pause();
                gameMusic.currentTime = 0;  // Reset the music to the beginning
                var loseSound = new Audio("assets/lossing-sound.wav");  // Replace with your losing sound
                loseSound.play();
    
            } else {
                this.initializeSpeed();  // Retain the current phase speed
            }
        }
    
        // Ball collision with paddle
        if (this.posX > this.player.x && this.posX < this.player.x + this.player.width && this.posY + this.radius > this.player.y) {
            this.speedY = -this.speedY; // Reverse direction after hitting paddle
            this.hitPaddleSound.play();
        }
    
        // Update ball's position
        this.posX += this.speedX;
        this.posY += this.speedY;
    
        // Handle phase and display phase message
        this.handlePhase();
    
        // Check for game won condition (e.g., score >= 24)
        if (this.score >= 24) {
            this.isGameWon = true;
            gameMusic.pause();
            gameMusic.currentTime = 0;  // Reset the music to the beginning
            var wingSound = new Audio("assets/winning-sound.wav");  // Replace with your losing sound
            wingSound.play();
        }
    }

    // Draw the ball and the phase message
    draw(ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "19px Courier New";

    // Determine the current game state
    switch (true) {
        case this.isGameOver:
            const gameOverMessage = "GAME OVER - PRESS R TO RESTART";
            const gameOverWidth = ctx.measureText(gameOverMessage).width;
            const gameOverX = (tableWidth - gameOverWidth) / 2;
            const gameOverY = tableHeight / 2;
            ctx.fillText(gameOverMessage, gameOverX, gameOverY);
            break;

        case this.isGameWon:
            const gameWonMessage = "YOU WON! - PRESS R TO RESTART";
            const gameWonWidth = ctx.measureText(gameWonMessage).width;
            const gameWonX = (tableWidth - gameWonWidth) / 2;
            const gameWonY = tableHeight / 2;
            ctx.fillText(gameWonMessage, gameWonX, gameWonY);
            break;

        case !this.isPlaying && this.player.lives === 3:
            const startMessage = "PRESS ENTER TO PLAY";
            const startWidth = ctx.measureText(startMessage).width;
            const startX = (tableWidth - startWidth) / 2;
            const startY = tableHeight / 2;
            ctx.fillText(startMessage, startX, startY);
            break;

        default:
            // Display score
            ctx.fillText("Score: " + this.score, tableWidth / 8, tableHeight / 7);

            // Draw the ball
            ctx.beginPath();
            ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();

            // Display the phase message
            ctx.fillStyle = "#FFFFFF"; // Ensure text is white
            const phaseText = `Current Phase: ${this.phaseMessage}`;
            ctx.fillText(phaseText, tableWidth / 8, tableHeight / 6); // Position it below the score
            break;
    }
}



    // Handle changes based on game phase
    handlePhase() {
        // Phase 2: Speed up when score reaches 5
        if (this.score >= 5 && this.phase === GAME_PHASE.PHASE_1) {
            this.phase = GAME_PHASE.PHASE_2;
            this.phaseMessage = "Phase 2 Speed Up!";
            this.increaseSpeed();  // Increase speed
        }

        // Phase 3: Final challenge when score reaches 15
        if (this.score >= 15 && this.phase === GAME_PHASE.PHASE_2) {
            this.phase = GAME_PHASE.PHASE_3;
            this.phaseMessage = "Phase 3 Final Challenge!";
            // Speed should already be increased by Phase 2, so no need to increase again
        }

        // Shrink paddle to half its size when score reaches 10
        if (this.score >= 10 && this.player.width === this.originalPaddleWidth) {
            this.player.width = this.originalPaddleWidth / 2;
            this.phaseMessage = "Paddle Shrunk  Half Size!";
        }
    }

    // Initialize ball speed based on the current phase
    initializeSpeed() {
        if (this.phase === GAME_PHASE.PHASE_1) {
            this.speedX = this.baseSpeed;
            this.speedY = -this.baseSpeed;
        } else if (this.phase === GAME_PHASE.PHASE_2 || this.phase === GAME_PHASE.PHASE_3) {
            // Keep the increased speed once Phase 2 or 3 starts
            this.speedX = this.increasedSpeed;
            this.speedY = -this.increasedSpeed;
        }
    }

    // Increase ball speed for later phases
    increaseSpeed() {
        this.speedX = this.increasedSpeed;
        this.speedY = -this.increasedSpeed;
    }
}


class GameResetter extends Sprite {
    constructor(ball, brickResetter, gameMusic) {
        super();  // Call the Sprite constructor to initialize sprite properties
        this.ball = ball;
        this.brickResetter = brickResetter;
        this.gameMusic = gameMusic;
    }

    // Reset the game state
    reset() {
        this.ball.isGameOver = false;
        this.ball.isGameWon = false;  // Ensure game won state is reset
        this.ball.isPlaying = false;
        this.ball.score = 0;         // Reset score
        this.brickResetter.resetBricks();         // Reset bricks
        this.ball.posX = this.ball.player.x + this.ball.player.width / 2; // Reset ball position
        this.ball.posY = this.ball.player.y - 15;  // Position above the paddle
        this.ball.speedX = 2;  // Reset speed to normal
        this.ball.speedY = -2;

        // Reset paddle to original size
        this.ball.player.width = this.ball.player.originalWidth;  // Set paddle width back to original size

        // Reset phase and phase message to Phase 1
        this.ball.phase = GAME_PHASE.PHASE_1;
        this.ball.phaseMessage = "Phase 1: The Beginning";  // Correct phase message

        // Reset the number of lives (hearts)
        this.ball.player.lives = 3;  // Reset the lives to 3

        // Restart the background music when the game is reset
        this.gameMusic.play();
        this.gameMusic.loop = true;  // Optional: loop the music for continuous play
    }
    // Override draw or update if needed, otherwise keep them empty
    draw(ctx) {}
    update() {}
}

/**
 * @class Brick
 * @brief Represents a single brick in the game.
 * Handles the brick's position, appearance, and whether it is destroyed.
 */
class Brick extends Sprite {
    constructor(x, y, width, height, spriteSheetSrc, frameCount, ball) {
        super();
        this.x = x;
        this.y = y;
        this.width = width; // Width of a single frame
        this.height = height; // Height of a single frame
        this.ball = ball;
        this.isBroken = false;

        // Animation properties
        this.spriteSheet = new Image();
        this.spriteSheet.src = spriteSheetSrc; // Path to the sprite sheet
        this.frameCount = frameCount; // Total number of frames
        this.frameIndex = 0; // Current frame
        this.animationSpeed = 10; // Frames per update cycle
        this.animationCounter = 0; // Timer for animation

        // Sound effect for brick breaking
        this.breakSound = new Audio("assets/hit.mp3"); // Path to sound file
        this.breakSound.volume = 0.5; // Adjust volume as needed
    }

    update(sprites, keys) {
        if (this.ball.isGameOver) return; // Stop updates if the game is over

        // Handle animation
        this.animationCounter++;
        if (this.animationCounter >= this.animationSpeed) {
            this.frameIndex = (this.frameIndex + 1) % this.frameCount; // Cycle through frames
            this.animationCounter = 0;
        }

        // Collision detection with the ball
        if (
            this.ball.posY - this.ball.radius < this.y + this.height &&
            this.ball.posY + this.ball.radius > this.y &&
            this.ball.posX > this.x &&
            this.ball.posX < this.x + this.width &&
            !this.isBroken
        ) {
            this.ball.speedY *= -1; // Bounce back
            this.ball.score++; // Increment score
            this.isBroken = true; // Mark brick as broken

            // Play sound effect
            this.breakSound.play();
        }
    }

    draw(ctx) {
        if (!this.isBroken) {
            // Calculate the source rectangle for the current frame
            const sx = this.frameIndex * this.width;

            // Draw the current frame of the sprite sheet
            ctx.drawImage(
                this.spriteSheet,
                sx,
                0,
                this.width,
                this.height,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
    }
}

/**
 * @class BrickRestarter
 * @brief Manages the resetting of brick states in the game.
 * Used to reset or regenerate bricks after they are destroyed or when the game restarts.
 */
class BrickResetter extends Sprite {
    constructor(instructionBackground, gameInstance, ball) {
        super(); // Call the parent Sprite class constructor
        this.instructionBackground = instructionBackground;
        this.gameInstance = gameInstance;
        this.ball = ball;
    }

    // Reset bricks by adding new Brick instances to the game
    resetBricks() {
        if (!this.instructionBackground.showInstructions) {
            // Remove existing bricks
            this.gameInstance.sprites = this.gameInstance.sprites.filter(sprite => !(sprite instanceof Brick));

            let offset = 0;
            for (let i = 1; i <= 4; i++) {
                for (let j = 1; j <= 4; j += 0.6) {
                    const brick = new Brick(
                        j * 148,
                        (i + offset) * 160,
                        70, // Frame width
                        20, // Frame height
                        "image/Brick/brick_2_basecolor.png", // Path to sprite sheet
                        4, // Number of frames in the sprite sheet
                        this.ball
                    );
                    this.gameInstance.addSprite(brick);
                    if (j % 4 === 0) {
                        offset -= 0.8;
                    }
                }
            }
        }
    }

    // Override draw or update if needed, otherwise keep them empty
    draw(ctx) {

    }
    update() {

    }
}

/**
 * @class PlayerPaddle
 * @brief Represents the player-controlled paddle in the game.
 * Handles the paddle's position, movement, drawing, and collision detection.
 */
class PlayerPaddle extends Sprite {
    constructor(x, y, width, height, color, moveSpeed) {
        super();
        this.x = x / 2.25;
        this.y = y / 1.3;
        this.width = width;
        this.height = height;
        this.color = color;
        this.moveSpeed = moveSpeed;
        this.lives = 3; // Initialize with 3 lives

        // Store the original paddle width
        this.originalWidth = width;
    }

    update(sprites, keys) {
        if (ball.isGameOver) return; // Stop paddle movement if game is over

        if (keys['ArrowRight']) { // Right key
            if (this.x < 590) this.x += this.moveSpeed;
        }

        if (keys['ArrowLeft']) { // Left key
            if (this.x >= 120.62) this.x -= this.moveSpeed;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
    }
}

/**
 * @class GameAnimator
 * @brief Handles the animation of objects within the game.
 * Responsible for animating the movement of sprites such as the ball, paddle, or other objects.
 */
class GameAnimator extends Sprite {
    constructor(gameInstance, ball, gameResetter) {
        super(); // Calls the parent constructor (Sprite class)
        this.gameInstance = gameInstance;
        this.ball = ball;
        this.gameResetter = gameResetter;
    }

    animate() {
        // Handle game states using a switch case
        switch (true) {
            case this.ball.isGameOver:
                // Handle game over state and restart when R is pressed
                if (this.gameInstance.keys['r']) {
                    this.gameResetter.reset();  // Reset the game state when R is pressed
                }

                // Display the "game over" screen
                this.gameInstance.ctx.fillStyle = "#FFFFFF";
                this.gameInstance.ctx.font = "19px Courier New";
                const gameOverMessage = "GAME OVER - PRESS R TO RESTART";
                const gameOverWidth = this.gameInstance.ctx.measureText(gameOverMessage).width;
                const gameOverX = (tableWidth - gameOverWidth) / 2;
                const gameOverY = tableHeight / 2;
                this.gameInstance.ctx.fillText(gameOverMessage, gameOverX, gameOverY);
                break;

            case this.ball.isGameWon:
                // Handle game won state and restart when R is pressed
                if (this.gameInstance.keys['r']) {
                    this.gameResetter.reset();  // Reset the game state when R is pressed
                }

                // Display the "you won" screen
                this.gameInstance.ctx.fillStyle = "#FFFFFF";
                this.gameInstance.ctx.font = "19px Courier New";
                const gameWonMessage = "YOU WON! - PRESS R TO RESTART";
                const gameWonWidth = this.gameInstance.ctx.measureText(gameWonMessage).width;
                const gameWonX = (tableWidth - gameWonWidth) / 2;
                const gameWonY = tableHeight / 2;
                this.gameInstance.ctx.fillText(gameWonMessage, gameWonX, gameWonY);
                break;

            default:
                // Only update and draw if the game is not over or if we're restarting
                this.gameInstance.update();
                this.gameInstance.draw();
                break;
        }

        // Continue the animation loop
        requestAnimationFrame(this.animate.bind(this)); // Using .bind(this) to keep the context of the class
    }
}


/**
 * @file Main.js
 * @brief The main script that initializes and runs the game, creating the game instance, 
 * setting up game objects, and handling game animations and logic.
 */

var tableImage = new Image();
tableImage.src = "image/break.jpg";
var gameInstance = new Game();
// Set table image dimensions to match canvas
tableImage.width = gameInstance.canvas.width;
tableImage.height = gameInstance.canvas.height;
var tableWidth = tableImage.width;
var tableHeight = tableImage.height;
// Game creating
var gameMusic = new Audio("assets/gamemusic.mp3");
gameMusic.loop = true;
gameMusic.volume = 0.5; 
gameMusic.play();
var gameInstance = new Game();
var player = new PlayerPaddle(tableWidth, tableHeight, 90, 10, "#FFFFFF", 5);
var ball = new Ball(player.x, player.y, 8, "#f57f28", player);
var hearts = new Heart(20, 20, player); // Hearts displayed in top-left
var coinSprite = new CoinSprite(tableWidth / 8, tableHeight / 6, 32, 32, 4, 10);
var instructionBackground = new InstructionBackground(tableImage, tableWidth, tableHeight);
var brickResetter = new BrickResetter(instructionBackground, gameInstance, ball);
var gameResetter = new GameResetter(ball, brickResetter, gameMusic, gameInstance);
var gameAnimator = new GameAnimator(gameInstance, ball, gameResetter);


gameInstance.addSprite(new Background(tableImage, tableWidth, tableHeight));
gameInstance.addSprite(player);
gameInstance.addSprite(ball);
gameInstance.addSprite(hearts);
gameInstance.addSprite(coinSprite);
gameInstance.addSprite(instructionBackground);
gameInstance.addSprite(brickResetter);
gameInstance.addSprite(gameAnimator);


// Initial brick setup
brickResetter.resetBricks();
gameAnimator.animate();
