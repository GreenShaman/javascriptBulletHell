
function degToRad(angle) {
	return 0.0174533 * angle;
}

function clamp(val, minVal, maxVal) {
	return Math.max(minVal, Math.min(val, maxVal));
}

function randomRange(min, max) {
	return Math.random() * (max - min) + min;
}

function drawOutlineText(context, text, x, y, colourInner, colourOuter) {
	context.fillStyle = colourOuter;
	context.fillText(text, x - 1, y);
	context.fillText(text, x + 1, y);
	context.fillText(text, x, y - 1);
	context.fillText(text, x, y + 1);
	context.fillStyle = colourInner;
	context.fillText(text, x, y);
	context.fillStyle = 'white';
}

function drawRotatedImage(context, image, x, y, angle) { 
	context.save(); 
	context.translate(x, y);
	context.rotate(angle * (Math.PI / 180));
	context.drawImage(image, -(image.width / 2), -(image.height/ 2));
	context.restore(); 
}

function getAngleTwoPoints(x1, y1, x2, y2) {
	return Math.atan2(-(y2 - y1), x2 - x1) * (180 / Math.PI);
}

//Borrowed from Orteil.
var Sounds = [];
function playSound(url, vol) {
	var volume = 1;
	if (vol !== undefined) volume = vol;
	if (!GlobalVolume || volume == 0) return 0;
	if (!Sounds[url]) {
		Sounds[url] = new Audio(url);
		Sounds[url].onloadeddata = function(e) {
			e.target.volume = Math.pow(volume * GlobalVolume / 100, 2);
		}
	} else if (Sounds[url].readyState >= 2) {
		Sounds[url].currentTime = 0;
		Sounds[url].volume = Math.pow(volume * GlobalVolume / 100, 2);
	}
	Sounds[url].play();
}

function angleDiff(angle0, angle1) {
    return ((((angle0 - angle1) % 360) + 540) % 360) - 180;
}

function rescaleCanvas(canvasIn, scale) {
	var style = canvasIn.getAttribute('style') || '';
	canvasIn.setAttribute('style', style + ' ' + '-ms-transform-origin: left top; -webkit-transform-origin: left top; -moz-transform-origin: left top; -o-transform-origin: left top; transform-origin: left top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
}

function changeIcon(file) {
	/*var link = document.createElement('link'), 
		oldLink = document.getElementById('dynamic-favicon');
	link.id = 'dynamic-favicon';
	link.rel = 'shortcut icon';
	link.href = file;
	if (oldLink) {
		document.head.removeChild(oldLink);
	}
	document.head.appendChild(link);*/
}

function changeTitle(text) {
	document.title = text;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}


