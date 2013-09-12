// Globals
// -------

// Game managers
var __evt = new EventManager();
var __em = new EntityManager(__evt);
var __gm = new GroupManager(__evt);
var __sm = new SystemManager(__evt);
var __tm = new TagManager(__evt);

// Tick dispatcher
var __ticker = new Ticker();

// Rendering engine
var __stage = new Stage();
var __buffer = new Buffer($('g'), __PW_GAME_WIDTH, __PW_GAME_HEIGHT, __PW_GAME_SCALE);
var __textureManager = new TextureManager();


// Identifiers
// -----------

// Tags
var TAG_PLAYER = 1;
var TAG_WORLD = 2;

// Groups
var GROUP_PORTALS = 1;
var GROUP_DOORS = 2;
var GROUP_ENEMIES = 3;
var GROUP_BULLETS = 4;

// Events
var EVENT_HIT = 'h';

// Animation states
var STATE_IDLE = '_';
var STATE_WALK = 'w';
var STATE_ATTACK = 'a';

// Weapons
var WEAPON_PISTOL = 0;
var WEAPON_SMG = 3;
var WEAPON_SHOTGUN = 5;
var WEAPON_RIFLE = 7;
var WEAPON_SNIPER = 9;


// Textures
// --------

// World tiles
__textureManager.s('r', 0, 0, 16, 16);    // Roof
__textureManager.s('w', 0, 16, 16, 16);   // North wall
__textureManager.s('f', 0, 32, 16, 16);   // Floor
__textureManager.s('dh', 16, 30, 16, 18); // Horizontal door
__textureManager.s('dv', 112, 0, 5, 25);  // Vertical door
__textureManager.s('e', 32, 31, 16, 16);  // Elevator
__textureManager.s('a', 48, 30, 7, 10);   // Light arrow

// Mobs
__textureManager.s('h', 16, 0, 8, 15, 12);  // Hero
__textureManager.s('b', 16, 15, 8, 15, 12); // Bodyguard

// Weapons
__textureManager.s('w' + WEAPON_SMG, 0, 48, 8, 15, 12);     // SMG
__textureManager.s('w' + WEAPON_RIFLE, 15, 48, 8, 18, 10);  // Rifle
__textureManager.s('w' + WEAPON_PISTOL, 33, 48, 8, 13, 11); // Pistol
__textureManager.s('w' + WEAPON_SNIPER, 46, 48, 8, 18, 10); // Sniper
__textureManager.s('w' + WEAPON_SHOTGUN, 66, 49, 8, 18, 8); // Shotgun

// Effects
__textureManager.s('bh', 44, 47, 4, 1); // Horizontal bullet
__textureManager.s('bv', 48, 44, 1, 4); // Vertical bullet

// Digits
__textureManager.s('9', 55, 30, 6, 7);  // 9
__textureManager.s('8', 61, 30, 6, 7);  // 8
__textureManager.s('7', 67, 30, 6, 7);  // 7
__textureManager.s('6', 73, 30, 6, 7);  // 6
__textureManager.s('5', 79, 30, 6, 7);  // 5
__textureManager.s('4', 85, 30, 6, 7);  // 4
__textureManager.s('3', 91, 30, 6, 7);  // 3
__textureManager.s('2', 97, 30, 6, 7);  // 2
__textureManager.s('1', 103, 30, 4, 7); // 1
__textureManager.s('0', 107, 30, 6, 7); // 0
__textureManager.s('/', 113, 30, 6, 7); // Slash

// HUD
__textureManager.s('hh', 55, 37, 10, 9);  // Heart
__textureManager.s('hb', 65, 37, 10, 10); // Bullets
__textureManager.s('tb', 76, 37, 1, 12);  // Text box background
__textureManager.s('tr', 76, 37, 5, 12);  // Text box right border
__textureManager.s('bl', 82, 37, 4, 18);  // Big box left border
__textureManager.s('bb', 86, 37, 1, 18);  // Big box background
__textureManager.s('br', 87, 37, 4, 18);  // Big box right border


// Animations
// ----------

__textureManager.d('_s', [0]);             // Idle south
__textureManager.d('_n', [1]);             // Idle north
__textureManager.d('_h', [2]);             // Idle west or east
__textureManager.d('ws', [3, 4], 6);       // Walking south
__textureManager.d('wn', [5, 6], 6);       // Walking north
__textureManager.d('wh', [7, 2, 8, 2], 9); // Walking west or east
__textureManager.d('as', [9]);             // Attacking south
__textureManager.d('an', [10]);            // Attacking north
__textureManager.d('ah', [11]);            // Attacking west or east


// Game runner
// -----------

/**
 * Start the game.
 */
function main() {
  // Load the main spritesheet
  __textureManager.l(__PW_ASSETS_DIR + 't.png', function onLoad() {
    __ticker.r(function titleLoop() {
      if (Input.a()) {
        // Initialize the game
        initializeGame();

        // Start the game loop
        __ticker.s();
        __ticker.r(gameLoop);

        // Display game screen
        $('p').className = 'g';
      }
    });
  });
}

/**
 * Process the current tick.
 * @param  {float} elapsed
 */
function gameLoop(elapsed) {
  __sm.u(elapsed);
  __buffer.r(__stage);
}


// Game initialization
// -------------------

function initializeGame() {
  // Create game layers
  var cameraLayer = __stage.a(new DisplayObjectContainer());
  var hudLayer    = __stage.a(new DisplayObjectContainer());
  var gameLayer   = cameraLayer.a(new DisplayObjectContainer());
  var fogLayer    = cameraLayer.a(new DisplayObjectContainer());
  var debugLayer  = __PW_DEBUG ? cameraLayer.a(new DisplayObjectContainer()) : null;

  // Create game systems
  __sm.a(new KeyboardControlSystem());
  __sm.a(new AISystem());
  __sm.a(new PathFollowSystem());
  __sm.a(new MovementSystem());
  __sm.a(new CollisionSystem());
  __sm.a(new BulletSystem());
  __sm.a(new DamageSystem());
  __sm.a(new DoorSystem());
  __sm.a(new CameraSystem(cameraLayer));
  __PW_DEBUG && __sm.a(new BoundsRenderingSystem(debugLayer));
  __sm.a(new SpriteDirectionSystem());
  __sm.a(new RenderingSystem(gameLayer));
  __PW_DEBUG && __sm.a(new FogSystem(cameraLayer, fogLayer));
  __sm.a(new HUDSystem(hudLayer));
  __sm.a(new ExpirationSystem());

  // Generate world
  var world = EntityCreator.world();
  var dungeon = world.g(Dungeon);

  // Initialize path finder
  AStar.init(dungeon.m, isWallTile);

  // Create player
  var hero = EntityCreator.hero(dungeon.p);

  // Create doors
  for (i = dungeon.d.length; i--;) {
    EntityCreator.door(dungeon.d[i]);
  }

  // Create enemies
  for (i = dungeon.e.length; i--;) {
    EntityCreator.bodyguard(dungeon.e[i]);
  }
}
