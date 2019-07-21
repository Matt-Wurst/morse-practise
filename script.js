
var config_speed_wpm = 20;







var beepQueue = [];
var correctLetter;

var tickLengthMs =  1000 / (config_speed_wpm * 50 / 60);  //that's the actual formula


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function faster()
{
	if(config_speed_wpm < 50)
	{
		config_speed_wpm += 1;
		tickLengthMs =  1000 / (config_speed_wpm * 50 / 60);
		document.getElementById("speedDisplay").innerHTML = "Words per minute: " + config_speed_wpm;
	}
}


function slower()
{
	if(config_speed_wpm > 5)
	{
		config_speed_wpm -= 1;
		tickLengthMs =  1000 / (config_speed_wpm * 50 / 60);
		document.getElementById("speedDisplay").innerHTML = "Words per minute: " + config_speed_wpm;
	}
}


async function play()
{
	var input = document.getElementById("inputWord").value;
	addStringToQueue(input);
	playQueue();
}


async function playQueue(callback)
{
	var context = new AudioContext()
	while(beepQueue.length > 0)
	{
		var nextLetter = beepQueue.shift();
		if(nextLetter === '.')
		{
			var o = context.createOscillator()
			o.type = "sine"
			o.connect(context.destination)
			o.start()
			await sleep(tickLengthMs);
			o.stop()
			await sleep(tickLengthMs);
		}
		else if(nextLetter === '-')
		{
			var o = context.createOscillator()
			o.type = "sine"
			o.connect(context.destination)
			o.start()
			await sleep(3 * tickLengthMs);
			o.stop()
			await sleep(tickLengthMs);
		}
		else if(nextLetter === ' ')
		{
			await sleep(2 * tickLengthMs);
		}
	}
	if(callback)
	{
		callback()
	}
}


function addStringToQueue(string)
{
	var array = Array.from(string)
	addLetterArrayToQueue(array)
}

function addLetterArrayToQueue(array)
{
	while(array.length > 0)
	{
		var letter = array.shift()
		addLetterToQueue(letter)
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
















