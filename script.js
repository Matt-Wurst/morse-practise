
var config_speed_wpm = 20;




var context = new AudioContext()



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
	addLetterToQueue('h');
	addLetterToQueue('e');
	addLetterToQueue('l');
	addLetterToQueue('l');
	addLetterToQueue('o');
	addLetterToQueue(' ');
	addLetterToQueue('w');
	addLetterToQueue('o');
	addLetterToQueue('r');
	addLetterToQueue('l');
	addLetterToQueue('d');
	playQueue();
}


async function playQueue(callback)
{
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
	callback(NULL)
}




function addLetterToQueue(letter)
{
	switch(letter)
	{
		case 'a': beepQueue.push('.','-',			' '); break;
		case 'b': beepQueue.push('-','.','.','.',	' '); break;
		case 'c': beepQueue.push('-','.','-','.',	' '); break;
		case 'd': beepQueue.push('-','.','.',		' '); break;
		case 'e': beepQueue.push('.',				' '); break;
		case 'f': beepQueue.push('.','.','-','.',	' '); break;
		case 'g': beepQueue.push('-','-','.',		' '); break;
		case 'h': beepQueue.push('.','.','.','.',	' '); break;
		case 'i': beepQueue.push('.','.',			' '); break;
		case 'j': beepQueue.push('.','-','-','-',	' '); break;
		case 'k': beepQueue.push('-','.','-',		' '); break;
		case 'l': beepQueue.push('.','-','.','.',	' '); break;
		case 'm': beepQueue.push('-','-',			' '); break;
		case 'n': beepQueue.push('-','.',			' '); break;
		case 'o': beepQueue.push('-','-','-',		' '); break;
		case 'p': beepQueue.push('.','-','-','.',	' '); break;
		case 'q': beepQueue.push('-','-','.','-',	' '); break;
		case 'r': beepQueue.push('.','-','.',		' '); break;
		case 's': beepQueue.push('.','.','.',		' '); break;
		case 't': beepQueue.push('-',				' '); break;
		case 'u': beepQueue.push('.','.','-',		' '); break;
		case 'v': beepQueue.push('.','.','.','-',	' '); break;
		case 'w': beepQueue.push('.','-','-',		' '); break;
		case 'x': beepQueue.push('-','.','.','-',	' '); break;
		case 'y': beepQueue.push('-','.','-','-',	' '); break;
		case 'z': beepQueue.push('-','-','.','.',	' '); break;
		case ' ': beepQueue.push(' ',' ',' ',' ',' ',' '); break;
	}
	
}
















