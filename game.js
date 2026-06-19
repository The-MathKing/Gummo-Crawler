// --- 1. GAME CONFIGURATION ---
const config = {
    type: Phaser.AUTO, // Automatically choose WebGL or Canvas rendering
    width: 800,        // Game window width
    height: 600,       // Game window height
    backgroundColor: '#2d2d2d', // A dark grey background color
    pixelArt: true,    // CRITICAL: This prevents your pixel art from getting blurry
    physics: {
        default: 'arcade', // The lightweight physics engine for collision and movement
        arcade: {
            gravity: { y: 0 }, // Set to 0 for a top-down game (no falling)
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Initialize the game
const game = new Phaser.Game(config);

// Global variables so we can access them in different functions
let player;
let cursors;

// --- 2. PRELOAD: Load Assets & Slice Spritesheets ---
function preload() {
    /* * THE SLICING MAGIC: 
     * Tell Phaser the width and height of a SINGLE frame of your character.
     * If your character is 32x32 pixels, use those numbers. Phaser will
     * automatically chop the whole sheet into a usable grid.
     */
    this.load.spritesheet('character', 'assets/player-sheet.png', { 
        frameWidth: 32, 
        frameHeight: 32 
    });
}

// --- 3. CREATE: Setup the Game World ---
function create() {
    // Add the player to the exact center of the screen
    // The '0' at the end tells it to use the very first frame of your sliced spritesheet
    player = this.physics.add.sprite(400, 300, 'character', 0);

    // Make sure the player can't walk off the edge of our 800x600 screen (for now)
    player.setCollideWorldBounds(true);

    // Set up keyboard inputs (Arrow keys by default)
    cursors = this.input.keyboard.createCursorKeys();
    
    // Add WASD keys as an alternative
    this.wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });
}

// --- 4. UPDATE: The Game Loop (Runs 60 times a second) ---
function update() {
    const speed = 160; // Player movement speed

    // Reset player velocity every frame
    player.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown || this.wasd.left.isDown) {
        player.setVelocityX(-speed);
    } else if (cursors.right.isDown || this.wasd.right.isDown) {
        player.setVelocityX(speed);
    }

    // Vertical movement
    if (cursors.up.isDown || this.wasd.up.isDown) {
        player.setVelocityY(-speed);
    } else if (cursors.down.isDown || this.wasd.down.isDown) {
        player.setVelocityY(speed);
    }

    // Normalize diagonal speed (prevents moving 1.4x faster when pressing two keys)
    player.body.velocity.normalize().scale(speed);
}