var Position = function(x, y) {
	var _x, _y;
	this._x = x;
	this._y = y;
}

var Position3D = function(x, y, z) {
	var _x, _y, _z;
	this._x = x;
	this._y = y;
	this._z = z;
}

var Position4D = function(x, y, z, w) {
	var _x, _y, _z, _w;
	this._x = x;
	this._y = y;
	this._z = z;
	this._w = w;
}

var Hitbox = function(left, top, width, height) {
	var _left, _top, _width, _height;
	this._left = left;
	this._top = top;
	this._width = width;
	this._height = height;
}

var Hitbox3D = function(left, top, front, width, height, length) {
	var _left, _top, _front, _width, _height, _length;
	this._left = left;
	this._top = top;
	this._front = front;
	this._width = width;
	this._height = height;
	this._length = length;
}

var Hitbox4D = function(left, top, front, kata, width, height, length, depth) {
	var _left, _top, _front, _kata, _width, _height, _length, _depth;
	this._left = left;
	this._top = top;
	this._front = front;
	this._kata = kata;
	this._width = width;
	this._height = height;
	this._length = length;
	this._depth = depth;
}