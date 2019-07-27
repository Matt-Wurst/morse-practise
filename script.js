
var config_speed_wpm = 20;
var config_beep_frequency_hz = 600;





var beepQueue = [];
var correctLetter;
var isPlaying = false;

var tickLengthMs =  1000 / (config_speed_wpm * 50 / 60);  //that's the actual formula
var rampLengthMs = tickLengthMs / 2;
if(rampLengthMs > 50) rampLengthMs = 50;

function sleep(ms)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}


function faster()
{
	if(config_speed_wpm < 50)
	{
		config_speed_wpm += 1;
		tickLengthMs =  1000 / (config_speed_wpm * 50 / 60);
		rampLengthMs = tickLengthMs / 3;
		if(rampLengthMs > 50) rampLengthMs = 50;
		document.getElementById("speedDisplay").innerHTML = "Words per minute: " + config_speed_wpm;
	}
}


function slower()
{
	if(config_speed_wpm > 5)
	{
		config_speed_wpm -= 1;
		tickLengthMs =  1000 / (config_speed_wpm * 50 / 60);
		rampLengthMs = tickLengthMs / 3;
		if(rampLengthMs > 50) rampLengthMs = 50;
		document.getElementById("speedDisplay").innerHTML = "Words per minute: " + config_speed_wpm;
	}
}




window.onkeydown = confirmChar
var chars = new Array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z')
var isFirstPress = true;

function confirmChar(c)
{
	var pressed = c.key;
	if(isFirstPress)
	{
		isFirstPress = false;
		playRandomChar();
	}
	else if(!isPlaying && chars.includes(pressed))
	{
		if(pressed === correctLetter)
		{
			document.body.style.backgroundColor = "lightgreen";
			playRandomChar();
		}
		else
		{
			document.body.style.backgroundColor = "red";
			playChar(correctLetter);
		}
	}
}

function playChar(c)
{
	addLetterToQueue(c);
	playQueue();
}

function playRandomChar()
{
	var charIndex = Math.floor(Math.random() * chars.length);   
	var c = chars[charIndex];
	playChar(c);
	correctLetter = c;
}


async function play()
{
	var input = document.getElementById("inputWord").value;
	addStringToQueue(input);
	playQueue();
}



var context = new AudioContext();


async function playQueue(callback)
{
	if(isPlaying){return;}
	isPlaying = true;
	
	while(beepQueue.length > 0)
	{
		var currentTime = context.currentTime;
		var nextLetter = beepQueue.shift();
		var o = context.createOscillator();
		var g = context.createGain();
		
		if(nextLetter === '.')
		{
			g.gain.setValueAtTime(1, currentTime);
			g.gain.setValueAtTime(1, currentTime + 0.001*(tickLengthMs));
			g.gain.linearRampToValueAtTime(0, currentTime + 0.001*(tickLengthMs+rampLengthMs));
			o.frequency.value = config_beep_frequency_hz;
			o.type = "sine";
			o.connect(g);
			g.connect(context.destination);
			o.start();
			await sleep(2*tickLengthMs);
			o.stop();
		}
		else if(nextLetter === '-')
		{
			g.gain.setValueAtTime(1, currentTime);
			g.gain.setValueAtTime(1, currentTime + 0.001*(3*tickLengthMs));
			g.gain.linearRampToValueAtTime(0,  currentTime + 0.001*(3*tickLengthMs+rampLengthMs));
			o.frequency.value = config_beep_frequency_hz;
			o.type = "sine";
			o.connect(g);
			g.connect(context.destination);
			o.start();
			await sleep(4 * tickLengthMs);
			o.stop();
		}
		else if(nextLetter === ' ')
		{
			await sleep(2 * tickLengthMs);
		}
	}
	isPlaying = false;
	if(callback)
	{
		callback();
	}
}


function addStringToQueue(string)
{
	var array = Array.from(string);
	addLetterArrayToQueue(array);
}

function addLetterArrayToQueue(array)
{
	while(array.length > 0)
	{
		var letter = array.shift();
		addLetterToQueue(letter);
	}
}

function addLetterToQueue(letter)
{
	switch(letter)
	{
		case 'a': case 'A':beepQueue.push('.','-',			' '); break;
		case 'b': case 'B':beepQueue.push('-','.','.','.',	' '); break;
		case 'c': case 'C':beepQueue.push('-','.','-','.',	' '); break;
		case 'd': case 'D':beepQueue.push('-','.','.',		' '); break;
		case 'e': case 'E':beepQueue.push('.',				' '); break;
		case 'f': case 'F':beepQueue.push('.','.','-','.',	' '); break;
		case 'g': case 'G':beepQueue.push('-','-','.',		' '); break;
		case 'h': case 'H':beepQueue.push('.','.','.','.',	' '); break;
		case 'i': case 'I':beepQueue.push('.','.',			' '); break;
		case 'j': case 'J':beepQueue.push('.','-','-','-',	' '); break;
		case 'k': case 'K':beepQueue.push('-','.','-',		' '); break;
		case 'l': case 'L':beepQueue.push('.','-','.','.',	' '); break;
		case 'm': case 'M':beepQueue.push('-','-',			' '); break;
		case 'n': case 'N':beepQueue.push('-','.',			' '); break;
		case 'o': case 'O':beepQueue.push('-','-','-',		' '); break;
		case 'p': case 'P':beepQueue.push('.','-','-','.',	' '); break;
		case 'q': case 'Q':beepQueue.push('-','-','.','-',	' '); break;
		case 'r': case 'R':beepQueue.push('.','-','.',		' '); break;
		case 's': case 'S':beepQueue.push('.','.','.',		' '); break;
		case 't': case 'T':beepQueue.push('-',				' '); break;
		case 'u': case 'U':beepQueue.push('.','.','-',		' '); break;
		case 'v': case 'V':beepQueue.push('.','.','.','-',	' '); break;
		case 'w': case 'W':beepQueue.push('.','-','-',		' '); break;
		case 'x': case 'X':beepQueue.push('-','.','.','-',	' '); break;
		case 'y': case 'Y':beepQueue.push('-','.','-','-',	' '); break;
		case 'z': case 'Z':beepQueue.push('-','-','.','.',	' '); break;
		case ' ': beepQueue.push(' ',' ',' ',' ',' ',' '); break;
	}
	
}
















