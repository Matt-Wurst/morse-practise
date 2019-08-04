
let config_speed_wpm = 20;
let config_speed_farnsworth_wpm = 20;
let config_beep_frequency_hz = 600;





let beepQueue = [];
let correctLetter;

let correctLetterList = [];
let correctLetterIndex = 0;
let numOfChars = 4;

let isPlaying = false;

let tickLengthMs =  1000 / (config_speed_wpm * 50 / 60);  //that's the actual formula
let farnsworthFactor = ((50*config_speed_wpm/config_speed_farnsworth_wpm)-38)/12; //that's close to the actual formula
let rampLengthMs = tickLengthMs / 4;
if(rampLengthMs > 50) rampLengthMs = 50;

function sleep(ms)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}



function updateWpm()
{
	let speedRange = document.getElementById("speedRange");
	let speedDisplay = document.getElementById("speedDisplay");
	let farnsworthRange = document.getElementById("farnsworthRange");
	let farnsworthDisplay = document.getElementById("farnsworthDisplay");
	config_speed_wpm = parseInt(speedRange.value);
	if(config_speed_wpm < config_speed_farnsworth_wpm)
	{
		config_speed_farnsworth_wpm = config_speed_wpm;
		if(farnsworthRange)
		{
			farnsworthRange.value = config_speed_farnsworth_wpm;
			farnsworthDisplay.innerHTML = "Farnsworth WPM: " + config_speed_farnsworth_wpm;
		}
	}
	tickLengthMs =  1000 / (config_speed_wpm * 50 / 60);
	rampLengthMs = tickLengthMs / 4;
	farnsworthFactor = ((50*config_speed_wpm/config_speed_farnsworth_wpm)-38)/12;
	speedDisplay.innerHTML = "Words per minute: " + config_speed_wpm;
}


function updateFarnsworthWpm()
{
	let speedRange = document.getElementById("speedRange");
	let speedDisplay = document.getElementById("speedDisplay");
	let farnsworthRange = document.getElementById("farnsworthRange");
	let farnsworthDisplay = document.getElementById("farnsworthDisplay");
	config_speed_farnsworth_wpm = parseInt(farnsworthRange.value);
	console.log(typeof(config_speed_farnsworth_wpm));
	if(config_speed_wpm < config_speed_farnsworth_wpm)
	{
		config_speed_wpm = config_speed_farnsworth_wpm;
		speedRange.value = config_speed_wpm;
		speedDisplay.innerHTML = "Words per minute: " + config_speed_wpm;
	}
	tickLengthMs =  1000 / (config_speed_wpm * 50 / 60);
	rampLengthMs = tickLengthMs / 4;
	farnsworthFactor = ((50*config_speed_wpm/config_speed_farnsworth_wpm)-38)/12;
	farnsworthRange.value = config_speed_farnsworth_wpm;
	farnsworthDisplay.innerHTML = "Farnsworth WPM: " + config_speed_farnsworth_wpm;
	speedDisplay.innerHTML = "Words per minute: " + config_speed_wpm;
}




let chars = new Array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z')
let isFirstPress = true;

function confirmChar(c)
{
	let pressed = c.key;
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

function confirmChars(c)
{
	let pressed = c.key;
	if(isFirstPress)
	{
		isFirstPress = false;
		playRandomChars(numOfChars);
	}
	else if(!isPlaying && chars.includes(pressed))
	{
		let correct = correctLetterList[correctLetterIndex];
		if(pressed === correct)
		{
			correctLetterIndex++;
			document.body.style.backgroundColor = "lightgreen";
			if(correctLetterIndex === correctLetterList.length)	//End of list reached
			{
				correctLetterIndex = 0;
				correctLetterList = [];
				playRandomChars(numOfChars);
			}
		}
		else
		{
			document.body.style.backgroundColor = "red";
			correctLetterIndex = 0;
			addLetterArrayToQueue(correctLetterList);
			playQueue();
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
	let charIndex = Math.floor(Math.random() * chars.length);   
	let c = chars[charIndex];
	playChar(c);
	correctLetter = c;
}

function playRandomChars(ammount)
{
	while(ammount > 0)
	{
		let charIndex = Math.floor(Math.random() * chars.length);   
		let c = chars[charIndex];
		playChar(c);
		correctLetterList.push(c);
		ammount--;
	}
}


async function play()
{
	let input = document.getElementById("inputWord").value;
	addStringToQueue(input);
	playQueue();
}



let context = new AudioContext();


async function playQueue(callback)
{
	if(isPlaying){return;}
	isPlaying = true;
	
	while(beepQueue.length > 0 && (beepQueue.includes('.') || beepQueue.includes('-')))
	{
		let currentTime = context.currentTime;
		let nextLetter = beepQueue.shift();
		let o = context.createOscillator();
		let g = context.createGain();
		
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
			await sleep(2 * tickLengthMs * farnsworthFactor);
		}
		else
		{
			//do nothing
		}
	}
	isPlaying = false;
	document.body.style.backgroundColor = "#ffff88";
	if(callback)
	{
		callback();
	}
}


function addStringToQueue(string)
{
	let array = Array.from(string);
	addLetterArrayToQueue(array);
}

function addLetterArrayToQueue(array)
{
	for(let i = 0; i < array.length; i++)
	{
		let letter = array[i];
		addLetterToQueue(letter);
	}
}

function addLetterToQueue(letter)
{
	switch(letter)
	{
		//Basic alphabet
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
		
		//Space
		case ' ': beepQueue.push(' ',' ',' '); break;
		
		//Numbers
		case '0': beepQueue.push('-','-','-','-','-',	' '); break;
		case '1': beepQueue.push('.','-','-','-','-',	' '); break;
		case '2': beepQueue.push('.','.','-','-','-',	' '); break;
		case '3': beepQueue.push('.','.','.','-','-',	' '); break;
		case '4': beepQueue.push('.','.','.','.','-',	' '); break;
		case '5': beepQueue.push('.','.','.','.','.',	' '); break;
		case '6': beepQueue.push('-','.','.','.','.',	' '); break;
		case '7': beepQueue.push('-','-','.','.','.',	' '); break;
		case '8': beepQueue.push('-','-','-','.','.',	' '); break;
		case '9': beepQueue.push('-','-','-','-','.',	' '); break;
		
		//Other characters
		case '.': beepQueue.push('.','-','.','-','.','-',		' '); break;	//Period
		case ',': beepQueue.push('-','-','.','.','-','-',		' '); break;	//Comma
		case '?': beepQueue.push('.','.','-','-','.','.',		' '); break;	//Question Mark
		case '\'':beepQueue.push('.','-','-','-','-','.',		' '); break;	//Apostrophe
		case '!': beepQueue.push('-','.','-','.','-','-',		' '); break;	//Exclamation mark
		case '/': beepQueue.push('-','.','.','-','.',			' '); break;	//Slash
		case '(': beepQueue.push('-','.','-','-','.',			' '); break;	//Opening parenthesis
		case ')': beepQueue.push('-','.','-','-','.','-',		' '); break;	//Closing parenthesis
		case '&': beepQueue.push('.','-','.','.','.',			' '); break;	//Ampersand
		case ':': beepQueue.push('-','-','-','.','.','.',		' '); break;	//Colon
		case ';': beepQueue.push('-','.','-','.','-','.',		' '); break;	//Semicolon
		case '=': beepQueue.push('-','.','.','.','-',			' '); break;	//Equals
		case '+': beepQueue.push('.','-','.','-','.',			' '); break;	//Plus
		case '-': beepQueue.push('-','.','.','.','.','-',		' '); break;	//Minus
		case '_': beepQueue.push('.','.','-','-','.','-',		' '); break;	//Underscore
		case '"': beepQueue.push('.','-','.','.','-','.',		' '); break;	//Quotation Mark
		case '$': beepQueue.push('.','.','.','-','.','.','-',	' '); break;	//Dollar sign
		case '@': beepQueue.push('.','-','-','.','-','.',		' '); break;	//At sign
	}
	
}
















