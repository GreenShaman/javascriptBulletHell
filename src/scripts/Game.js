var canvas, canvasContext, theCookie;
const sprites = new Image();
sprites.src = 'sprites/sprites.png';
var DEBUG = false;
var gridWidth = 30, gridHeight = 20;
var timer1 = 0, globalTimer = 0;
var gameSpeed = 60, gameScore = 0;

var iconList = [];
for (var i = 0; i < 8; i++) {
	iconList[i] = new Image();
	iconList[i].src = 'sprites/icon' + i + '.png';
}

const KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40,
	KEY_A = 65, KEY_S = 83, KEY_D = 68, KEY_Z = 90, KEY_X = 88, KEY_C = 67;
var controlKeys = [];
controlKeys.fill(false, 0, 255);
var GlobalVolume = 50;

//Classes
var Projectile = function(x, y, xSpd, ySpd, type, colour, damage) {
	var _x, _y, _h, _w, _texX, _texY, _xSpd, _ySpd, _type, _damage, _colour;
	var _frameId;
	var _hitbox;
	
	this._xSpd = xSpd;
	this._ySpd = ySpd;
	this._type = type;
	this._damage = damage;
	this._colour = colour;
	
	if (this._type === 0) {
		this._h = 8;
		this._w = 8;
		this._texX = 0;
		this._texY = 144;
		this._hitbox = new Hitbox(2, 2, 4, 4);
		this._frameId = 0;
	} else if (this._type === 1) {
		this._h = 8;
		this._w = 8;
		this._texX = 0;
		this._texY = 152;
		this._hitbox = new Hitbox(2, 2, 4, 4);
		this._frameId = 0;
	} else if (this._type === 2) {
		this._h = 16;
		this._w = 16;
		this._texX = 0;
		this._texY = 160;
		this._hitbox = new Hitbox(3, 3, 10, 10);
		this._frameId = 0;
	} else if (this._type === 3) {
		this._h = 16;
		this._w = 16;
		this._texX = 0;
		this._texY = 176;
		this._hitbox = new Hitbox(3, 3, 10, 10);
		this._frameId = 0;
	} else if (this._type === 10) {
		this._h = 8;
		this._w = 8;
		this._texX = 16;
		this._texY = 112;
		this._hitbox = new Hitbox(1, 1, 6, 6);
		this._frameId = 0;
	} else if (this._type === 11) {
		this._h = 12;
		this._w = 12;
		this._texX = 16;
		this._texY = 120;
		this._hitbox = new Hitbox(2, 2, 8, 8);
		this._frameId = 0;
	} else {
		this._h = 8;
		this._w = 8;
		this._hitbox = new Hitbox(0, 0, 8, 8);
		this._frameId = 0;
	}
	
	this._x = x - (this._w / 2);
	this._y = y - (this._h / 2);
}
Projectile.prototype.doProcess = function() {
	this._x += this._xSpd;
	this._y += this._ySpd;
	//this._frameId = (this._frameId + 1) % 4;
}

var Player = function(x, y) {
	var _x, _y, _h, _w;
	var _HL, _HLmax, _AM, _AMmax, _EN, _ENmax, _Lv, _shotDelay, _shotCost;
	var _powerupRapid, _powerupPower, _powerupShotSpeed, _powerupType,
		_powerupShots, _powerupSpread, _powerupLevel, _powerupMulti,
		_powerupGenerator, _powerupRandom, _powerupEfficiency;
	var _inventory = [];
	var _hitbox;
	
	this._x = x;
	this._y = y;
	this._h = 16;
	this._w = 16;
	
	this._Lv = 1;
	this._HLmax = (this._Lv * 8) + 92;
	this._HL = this._HLmax;
	this._AMmax = (this._Lv * 2) + 28;
	this._AM = this._AMmax;
	this._ENmax = (this._Lv * 4) + 46;
	this._EN = Math.floor(this._ENmax / 4);
	this._hitbox = new Hitbox(5, 2, 6, 12);
	this._shotDelay = 0;
	this._shotCost = 0;
	
	this._powerupRapid 		= 0; //max 4
	this._powerupPower 		= 0; //max 8
	this._powerupShotSpeed 	= 0; //max 4
	this._powerupType 		= 0; //max 4
	this._powerupShots 		= 0; //max 4
	this._powerupSpread 	= 0; //max 5
	this._powerupLevel 		= 0; //max 1
	this._powerupMulti 		= 0; //max 2
	this._powerupGenerator 	= 0; //max 10
	this._powerupRandom 	= 0; //max 5
	this._powerupEfficiency = 0; //max 5
};
Player.prototype.doProcess = function() {
	var xOff = 0, yOff = 0;
	this._shotCost = clamp(Math.ceil(((((1 + this._powerupPower) * (1 + this._powerupLevel)) * (1 + this._powerupShots)) * (1 + this._powerupMulti)) * (1 - (this._powerupEfficiency * 0.06))), 1, 9999);
	this._shotDelay--;
	if (controlKeys[KEY_RIGHT]) {
		xOff += 1.5;
	} 
	if (controlKeys[KEY_LEFT]) {
		xOff -= 1.5;
	}
	if (controlKeys[KEY_UP]) {
		yOff -= 1.5;
	} 
	if (controlKeys[KEY_DOWN]) {
		yOff += 1.5;
	}
	if (controlKeys[KEY_C]) {
		if (this._shotDelay <= 0 && this._EN >= this._shotCost) {
			var shots = 1 + this._powerupShots, spread = 2 + this._powerupSpread, bulletSpeed = 5 + this._powerupShotSpeed, 
				power = 1 + this._powerupPower, multi = 1 + this._powerupMulti, rando = this._powerupRandom * 0.1, 
				powerType = this._powerupType;
			if (this._powerupType == 5) {
				powerType = Math.floor(globalTimer / 5) % 5;
			}
			playSound('sounds/shot' + powerType + '.wav', 0.25);
			this._EN -= this._shotCost;
			
			if (multi === 3) {
				for (var i = 0; i < shots; i++) {
					playerProjectileList.push(new Projectile(thePlayer._x + (thePlayer._w / 2) - 6, thePlayer._y, 
						(Math.cos(degToRad(90 + (spread / 2) - ((shots * spread) / 2) + (i * spread))) * (bulletSpeed + randomRange(-rando, rando))), 
						(-Math.sin(degToRad(90 + (spread / 2) - ((shots * spread) / 2) + (i * spread))) * (bulletSpeed + randomRange(-rando, rando))), 
						10 + this._powerupLevel, powerType, power));
					playerProjectileList.push(new Projectile(thePlayer._x + (thePlayer._w / 2) + 6, thePlayer._y, 
						(Math.cos(degToRad(90 + (spread / 2) - ((shots * spread) / 2) + (i * spread))) * (bulletSpeed + randomRange(-rando, rando))), 
						(-Math.sin(degToRad(90 + (spread / 2) - ((shots * spread) / 2) + (i * spread))) * (bulletSpeed + randomRange(-rando, rando))), 
						10 + this._powerupLevel, powerType, power));
					playerProjectileList.push(new Projectile(thePlayer._x + (thePlayer._w / 2), thePlayer._y - 5, 
						(Math.cos(degToRad(90 + (spread / 2) - ((shots * spread) / 2) + (i * spread))) * (bulletSpeed + randomRange(-rando, rando))), 
						(-Math.sin(degToRad(90 + (spread / 2) - ((shots * spread) / 2) + (i * spread))) * (bulletSpeed + randomRange(-rando, rando))), 
						10 + this._powerupLevel, powerType, power));
				}
			} else if (multi === 2) {
				for (var i = 0; i < shots; i++) {
					playerProjectileList.push(new Projectile(thePlayer._x + (thePlayer._w / 2) - 4, thePlayer._y - 2, 
						(Math.cos(degToRad(90 + (spread / 2) - ((shots * spread) / 2) + (i * spread))) * (bulletSpeed + randomRange(-rando, rando))), 
						(-Math.sin(degToRad(90 + (spread / 2) - ((shots * spread) / 2) + (i * spread))) * (bulletSpeed + randomRange(-rando, rando))), 
						10 + this._powerupLevel, powerType, power));
					playerProjectileList.push(new Projectile(thePlayer._x + (thePlayer._w / 2) + 4, thePlayer._y - 2, 
						(Math.cos(degToRad(90 + (spread / 2) - ((shots * spread) / 2) + (i * spread))) * (bulletSpeed + randomRange(-rando, rando))), 
						(-Math.sin(degToRad(90 + (spread / 2) - ((shots * spread) / 2) + (i * spread))) * (bulletSpeed + randomRange(-rando, rando))), 
						10 + this._powerupLevel, powerType, power));
				}
			} else {
				for (var i = 0; i < shots; i++) {
					playerProjectileList.push(new Projectile(thePlayer._x + (thePlayer._w / 2), thePlayer._y - 5, 
						(Math.cos(degToRad(90 + (spread / 2) - ((shots * spread) / 2) + (i * spread))) * (bulletSpeed + randomRange(-rando, rando))), 
						(-Math.sin(degToRad(90 + (spread / 2) - ((shots * spread) / 2) + (i * spread))) * (bulletSpeed + randomRange(-rando, rando))), 
						10 + this._powerupLevel, powerType, power));
				}
			}
			this._shotDelay = 9 - this._powerupRapid;
		}
	}
	
	this._x = clamp(this._x + xOff, 0, canvas.width - this._w - 96);
	this._y = clamp(this._y + yOff, 0, canvas.height - this._h);
	
	this.testHit();
	if (this._EN < this._ENmax) {
		this._EN += (0.4 * (1 + this._powerupGenerator));
	}
	
	this._HLmax = (this._Lv * 8) + 92;
	this._AMmax = (this._Lv * 2) + 28;
	this._ENmax = (this._Lv * 4) + 46;
	this._HL = clamp(this._HL, 0, this._HLmax);
	this._AM = clamp(this._AM, 0, this._AMmax);
	this._EN = clamp(this._EN, 0, this._ENmax);
}
Player.prototype.testCollision = function(targetEntity) {
	return (this._x + this._hitbox._left < targetEntity._x + targetEntity._hitbox._left + targetEntity._hitbox._width &&
		this._x + this._hitbox._left + this._hitbox._width > targetEntity._x + targetEntity._hitbox._left &&
		this._y + this._hitbox._top < targetEntity._y + targetEntity._hitbox._top + targetEntity._hitbox._height &&
		this._y + this._hitbox._top + this._hitbox._height > targetEntity._y + targetEntity._hitbox._top);
}
Player.prototype.testHit = function() {
	var len = enemyProjectileList.length;
	for (var i = len - 1; i > -1; i--) {
		if (this.testCollision(enemyProjectileList[i])) {
			this._HL -= enemyProjectileList[i]._damage;
			enemyProjectileList.splice(i, 1);
			//playSound('sounds/hitPlayer.wav', 1.0);
		}
	}
}

var Enemy = function(x, y, hull, shotPattern) {
	var _x, _y, _h, _w, _xSpd, _ySpd;
	var _HL, _HLmax, _shotDelay, _shotPattern, _shotFreq, _dead;
	var _hitbox;
	
	this._x = x;
	this._y = y;
	this._h = 16;
	this._w = 16;
	this._xSpd = 0;
	this._ySpd = 1;
	
	this._HLmax = hull;
	this._HL = this._HLmax;
	this._dead = false;

	this._hitbox = new Hitbox(2, 2, 12, 12);
	this._shotFreq = 20;
	this._shotPattern = shotPattern;
	this._shotDelay = this._shotFreq;
};
Enemy.prototype.doProcess = function() {
	this._shotDelay--;
	this._x += this._xSpd;
	this._y += this._ySpd;
	if (this._x > canvas.width - 96 || this._x < -this._w || this._y > canvas.height || this._y < -this._h) {
		this._dead = true;
	}
	//this._x = clamp(this._x, 0, canvas.width - this._w - 96);
	//this._y = clamp(this._y, 0, canvas.height - this._h);
	
	if (this._shotDelay <= 0) {
		this.fireWeapon(this._shotPattern);
		this._shotDelay = this._shotFreq;
		//this._ySpd += 0.1;
	}
	
	if (!this._dead) {
		this.testHit();
	}
	this._HL = clamp(this._HL, 0, 9999);
}
Enemy.prototype.testCollision = function(targetEntity) {
	return (this._x + this._hitbox._left < targetEntity._x + targetEntity._hitbox._left + targetEntity._hitbox._width &&
		this._x + this._hitbox._left + this._hitbox._width > targetEntity._x + targetEntity._hitbox._left &&
		this._y + this._hitbox._top < targetEntity._y + targetEntity._hitbox._top + targetEntity._hitbox._height &&
		this._y + this._hitbox._top + this._hitbox._height > targetEntity._y + targetEntity._hitbox._top);
}
Enemy.prototype.testHit = function() {
	var len = playerProjectileList.length;
	for (var i = len - 1; i > -1; i--) {
		if (this.testCollision(playerProjectileList[i])) {
			this._HL -= playerProjectileList[i]._damage;
			playerProjectileList.splice(i, 1);
			playSound('sounds/hitPlayer.wav', 1.0);
			if (this._HL <= 0) {
				gameScore += 100;
				this._dead = true;
				break;
			}
		}
	}
}
Enemy.prototype.fireWeapon = function(patternId) {
	if (patternId == 0) {
		var tempVelo = 2;
		var tempDir = getAngleTwoPoints(this._x + (this._w / 2), this._y + this._h, thePlayer._x + (thePlayer._w / 2), thePlayer._y + (thePlayer._h / 2));
		if (!(tempDir < -150 || tempDir > -30)) {
			tempDir = getAngleTwoPoints(this._x + (this._w / 2) - 6, this._y + this._h - 2, thePlayer._x + (thePlayer._w / 2), thePlayer._y + (thePlayer._h / 2));
			enemyProjectileList.push(new Projectile(this._x + (this._w / 2) - 6, this._y + this._h - 2, 
				Math.cos(degToRad(tempDir)) * tempVelo, -Math.sin(degToRad(tempDir)) * tempVelo, 0, 0, 2));
			tempDir = getAngleTwoPoints(this._x + (this._w / 2) + 6, this._y + this._h - 2, thePlayer._x + (thePlayer._w / 2), thePlayer._y + (thePlayer._h / 2));
			enemyProjectileList.push(new Projectile(this._x + (this._w / 2) + 6, this._y + this._h - 2, 
				Math.cos(degToRad(tempDir)) * tempVelo, -Math.sin(degToRad(tempDir)) * tempVelo, 0, 0, 2));
		}
	} else if (patternId == 1) {
		var tempVelo = 4;
		if (!(tempDir < -150 || tempDir > -30)) {
			var tempDir = 270;
			enemyProjectileList.push(new Projectile(this._x + (this._w / 2), this._y + this._h + 4, 
				Math.cos(degToRad(tempDir)) * tempVelo, -Math.sin(degToRad(tempDir)) * tempVelo, 11, 1, 2));
		}
	}
}

var Entity = function(x, y, type) {
	var _x, _y, _h, _w, _type;
	var _hitbox;
	
	this._x = x;
	this._y = y;
	this._h = 16;
	this._w = 16;
	this._type = type;
	this._hitbox = new Hitbox(0, 0, 16, 16);
}

//Prepare entities
var thePlayer;
var enemyList = [];
var lootList = [];
var playerProjectileList = [];
var enemyProjectileList = [];

window.onload = function() {
	canvas = document.getElementById('baseCanvas');
	canvasContext = canvas.getContext('2d');
	theCookie = document.cookie;
	/*gameScore = getCookie("score");
	if (gameScore == "") {
		setCookie("score", 0, 365);
		gameScore = "FAIL";
	}*/
	//rescaleCanvas(canvas, 1.5);
	
	thePlayer = new Player((canvas.width - 96) / 2, canvas.height - 64);
	thePlayer._x -= (thePlayer._w / 2);

	canvas.addEventListener('mousemove', function(event) {
		var mousePos = calcMousePos(event);
	});
	canvas.addEventListener('mousedown', handleMouseClick);
	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);
	
	setInterval(function() {
		processAll();
		drawAll();
		globalTimer++;
	}, 1000 / gameSpeed);
}

function processAll() {	
	if (globalTimer % 45 == 0) {
		enemyList.push(new Enemy(randomRange(0, (canvas.width - 96) - 16), -15, 4, 1));
	}
	
	var len = playerProjectileList.length;
	for (var i = len - 1; i > -1; i--) {
		if (playerProjectileList[i]._x > canvas.width - 96 || playerProjectileList[i]._x < -playerProjectileList[i]._w
		 || playerProjectileList[i]._y > canvas.height || playerProjectileList[i]._y < -playerProjectileList[i]._h) {
			playerProjectileList.splice(i, 1);
		}
	}
	for (var i = 0; i < playerProjectileList.length; i++) {
		playerProjectileList[i].doProcess();
	}
	
	var len = enemyProjectileList.length;
	for (var i = len - 1; i > -1; i--) {
		if (enemyProjectileList[i]._x > canvas.width - 96 || enemyProjectileList[i]._x < -enemyProjectileList[i]._w
		 || enemyProjectileList[i]._y > canvas.height || enemyProjectileList[i]._y < -enemyProjectileList[i]._h) {
			enemyProjectileList.splice(i, 1);
		}
	}
	for (var i = 0; i < enemyProjectileList.length; i++) {
		enemyProjectileList[i].doProcess();
	}
	
	var len = enemyList.length;
	for (var i = len - 1; i > -1; i--) {
		if (enemyList[i]._dead) {
			enemyList.splice(i, 1);
		}
	}
	for (var i = 0; i < enemyList.length; i++) {
		enemyList[i].doProcess();
	}
	
	thePlayer.doProcess();
	//document.getElementById('favicon').href = iconList[Math.floor(globalTimer / (gameSpeed / 4)) % 8].src;
}

function drawAll() {
	//Backdrop
	canvasContext.fillStyle = '#1f1f1f';
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	
	//Tiles
	//canvasContext.drawImage(sprites, uvX, uvY, uvW, uvH, x, y, w, h);
	/*for (var yy = 0; yy < gridHeight; yy++) {
		for (var xx = 0; xx < gridWidth; xx++) {
			canvasContext.drawImage(sprites, 0, 16, 16, 16, xx * 16, yy * 16, 16, 16);
		}
	}*/
	
	//Player and Entities
	for (var i = 0; i < enemyList.length; i++) {
		canvasContext.drawImage(sprites, 0, 128, enemyList[i]._w, enemyList[i]._h, enemyList[i]._x, enemyList[i]._y, enemyList[i]._w, enemyList[i]._h);
	}
	canvasContext.drawImage(sprites, 0, 112, thePlayer._w, thePlayer._h, thePlayer._x, thePlayer._y, thePlayer._w, thePlayer._h);
	canvasContext.globalCompositeOperation = 'lighter';
	for (var i = 0; i < enemyProjectileList.length; i++) {
		canvasContext.drawImage(sprites, enemyProjectileList[i]._texX + (enemyProjectileList[i]._w * enemyProjectileList[i]._colour), enemyProjectileList[i]._texY, 
			enemyProjectileList[i]._w, enemyProjectileList[i]._h, 
			enemyProjectileList[i]._x, enemyProjectileList[i]._y, 
			enemyProjectileList[i]._w, enemyProjectileList[i]._h);
		//canvasContext.fillText(projectileList[i]._frameId, projectileList[i]._x, projectileList[i]._y);
	}
	for (var i = 0; i < playerProjectileList.length; i++) {
		canvasContext.drawImage(sprites, playerProjectileList[i]._texX + (playerProjectileList[i]._w * playerProjectileList[i]._colour), playerProjectileList[i]._texY, 
			playerProjectileList[i]._w, playerProjectileList[i]._h, 
			playerProjectileList[i]._x, playerProjectileList[i]._y, 
			playerProjectileList[i]._w, playerProjectileList[i]._h);
		//canvasContext.fillText(projectileList[i]._frameId, projectileList[i]._x, projectileList[i]._y);
	}
	canvasContext.globalCompositeOperation = 'source-over';
	
	//Stats
	canvasContext.fillStyle = 'black';
	canvasContext.fillRect(canvas.width - 96, 0, canvas.width, canvas.height);
	canvasContext.font = "bold 9px Lucida Console";
	canvasContext.textAlign = "center";
	
	canvasContext.textAlign = "start";
	canvasContext.fillStyle = 'white';
	canvasContext.fillText("Score x" + 1, canvas.width - 89, 11);
	canvasContext.textAlign = "end";
	canvasContext.fillText(gameScore, canvas.width - 8, 19);
	
	//drawBar(canvas.width - 92, 28, 48, 8, thePlayer._HL, thePlayer._HLmax, "HL", '#ff8888', 0);
	//drawBar(canvas.width - 92, 36, 48, 8, thePlayer._AM, thePlayer._AMmax, "AM", '#8888ff', 1);
	//drawBar(canvas.width - 92, 44, 48, 8, thePlayer._EN, thePlayer._ENmax, "EN", '#88ff88', 2);
	//drawBar(canvas.width - 92, 60, 48, 8, 50, 100, "PP", '#ffff88', 3);
	drawBar2(canvas.width - 92, 28, 48, 8, thePlayer._HL, thePlayer._HLmax,'#ff8888', 0);
	drawBar2(canvas.width - 92, 36, 48, 8, thePlayer._AM, thePlayer._AMmax, '#8888ff', 1);
	drawBar2(canvas.width - 92, 44, 48, 8, thePlayer._EN, thePlayer._ENmax, '#88ff88', 2);
	drawBar2(canvas.width - 92, 60, 48, 8, 50, 100, '#cc44cc', 3);
	canvasContext.fillText("ENpS " + thePlayer._shotCost, canvas.width - 76, 59);
	
	canvasContext.fillStyle = 'white';
	canvasContext.fillText(theCookie, 4, 8);
	
	//Draw hitboxes
	if (DEBUG) {
		canvasContext.fillStyle = 'green';
		canvasContext.fillRect(thePlayer._x + thePlayer._hitbox._left, thePlayer._y + thePlayer._hitbox._top, thePlayer._hitbox._width, thePlayer._hitbox._height);
		for (var i = 0; i < enemyList.length; i++) {
			canvasContext.fillStyle = 'red';
			canvasContext.fillRect(enemyList[i]._x + enemyList[i]._hitbox._left, enemyList[i]._y + enemyList[i]._hitbox._top, 
			enemyList[i]._hitbox._width, enemyList[i]._hitbox._height);
		}
		for (var i = 0; i < enemyProjectileList.length; i++) {
			canvasContext.fillStyle = 'blue';
			canvasContext.fillRect(enemyProjectileList[i]._x + enemyProjectileList[i]._hitbox._left, enemyProjectileList[i]._y + enemyProjectileList[i]._hitbox._top, 
			enemyProjectileList[i]._hitbox._width, enemyProjectileList[i]._hitbox._height);
		}
		for (var i = 0; i < playerProjectileList.length; i++) {
			canvasContext.fillStyle = 'yellow';
			canvasContext.fillRect(playerProjectileList[i]._x + playerProjectileList[i]._hitbox._left, playerProjectileList[i]._y + playerProjectileList[i]._hitbox._top, 
			playerProjectileList[i]._hitbox._width, playerProjectileList[i]._hitbox._height);
		}
		canvasContext.fillStyle = 'white';
		canvasContext.fillText("Proj: " + enemyProjectileList.length + " " + playerProjectileList.length + " Enemy: " + enemyList.length, 4, canvas.height - 4);
	}
}

function drawBar(x, y, w, h, val, valMax, name, colour, barId) {
	canvasContext.font = "bold 9px Lucida Console";
	canvasContext.textAlign = "center";
	var ratio = clamp((val / valMax), 0, 1);
	canvasContext.drawImage(sprites, 0, 208, w, h, x + 14, y, w, h);
	canvasContext.drawImage(sprites, 0, 224 + (barId * h), (ratio * w), h, x + 14, y, (ratio * w), h);
	canvasContext.fillStyle = colour;
	canvasContext.fillText(name, x + 8, y + 7);
	canvasContext.textAlign = "start";
	canvasContext.fillText(Math.floor(val), x + w + 15, y + 7);
	canvasContext.fillStyle = 'white';
}

function drawBar2(x, y, w, h, val, valMax, colour, barId) {
	canvasContext.font = "bold 9px Lucida Console";
	canvasContext.textAlign = "center";
	var ratio = clamp((val / valMax), 0, 1);
	canvasContext.drawImage(sprites, 0, 208, w, h, x + 16, y, w, h);
	canvasContext.drawImage(sprites, 0, 224 + (barId * h), (ratio * w), h, x + 16, y, (ratio * w), h);
	canvasContext.drawImage(sprites, 0 + w, 208, 16, h, x, y, 16, h);
	canvasContext.drawImage(sprites, 0 + w, 224 + (barId * h), 16, h, x, y, 16, h);
	canvasContext.fillStyle = colour;
	canvasContext.textAlign = "start";
	canvasContext.fillText(Math.floor(val), x + w + 17, y + 7);
	canvasContext.fillStyle = 'white';
}

function calcMousePos(event) {
	var canvasRect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = event.clientX - canvasRect.left - root.scrollLeft;
	var mouseY = event.clientY - canvasRect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(event) {
	
}

function keyPressed(evt) {
	//console.log("Key pressed: " + evt.keyCode);
	controlKeys[evt.keyCode] = true;
	evt.preventDefault();
}

function keyReleased(evt) {
	//console.log("Key released: " + evt.keyCode);
	controlKeys[evt.keyCode] = false;
}
