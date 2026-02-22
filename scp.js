const displayElement = document.getElementById('display-text');
const inputElement = document.getElementById('input-field');
const wpmElement = document.getElementById('wpm');
const timerElement = document.getElementById('timer');
const accuracyElement = document.getElementById('accuracy');
const resultScreen = document.getElementById('result-screen');
const retryBtn = document.getElementById('retry-btn');

let timerStarted = false;
let timeLeft = 60;
let timerInterval;

const wordBank = [
    "the", "code", "logic", "array", "string", "function", "variable", "system",
    "syntax", "object", "return", "const", "let", "binary", "compiler", "debug",
    "program", "script", "markup", "style", "server", "client", "database", "query",
    "loop", "while", "for", "each", "input", "output", "render", "event", "mouse",
    "keyboard", "monitor", "pixel", "color", "paint", "music", "guitar", "rhythm",
    "sound", "visual", "canvas", "graphic", "modern", "simple", "clean", "fast",
    "speed", "type", "master", "pro", "gamer", "level", "power", "energy", "focus"
];

function renderNewQuote() {

    let randomWords = [];
    for (let i = 0; i < 50; i++) {
        const randomIndex = Math.floor(Math.random() * wordBank.length);
        randomWords.push(wordBank[randomIndex]);
    }


    const fullText = randomWords.join(' ');

    displayElement.innerHTML = '';


    fullText.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        displayElement.appendChild(charSpan);
    });

    inputElement.value = null;
    inputElement.disabled = false;
    inputElement.focus();
}

function finishTest() {
    clearInterval(timerInterval);
    timerStarted = false;

    displayElement.classList.add('hidden');
    inputElement.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    const timeTaken = 60 - timeLeft;
    const finalWpm = Math.round(((inputElement.value.length / 5) / (timeTaken / 60))) || 0;

    document.getElementById('final-wpm').innerText = finalWpm;
    document.getElementById('final-acc').innerText = accuracyElement.innerText;
}

retryBtn.addEventListener('click', () => {
    timeLeft = 60;
    timerStarted = false;
    timerElement.innerText = timeLeft;
    accuracyElement.innerText = 100;


    inputElement.value = '';

    resultScreen.classList.add('hidden');
    displayElement.classList.remove('hidden');
    inputElement.classList.remove('hidden');

    renderNewQuote();


    setTimeout(() => {
        inputElement.focus();
    }, 10);
});

inputElement.addEventListener('input', () => {
    if (!timerStarted) startTimer();

    const arrayQuote = displayElement.querySelectorAll('span');
    const arrayValue = inputElement.value.split('');
    let errorFound = false;
    let correctChars = 0;

    arrayQuote.forEach((charSpan, index) => {
        const character = arrayValue[index];
        if (character == null) {
            charSpan.classList.remove('correct', 'incorrect');
        } else if (character === charSpan.innerText) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
            correctChars++;
        } else {
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct');
            errorFound = true;
        }
    });


    if (arrayValue.length > 0) {
        let acc = Math.round((correctChars / arrayValue.length) * 100);
        accuracyElement.innerText = acc;
    }


    if (errorFound) {
        inputElement.style.borderColor = "#ca4754";
        inputElement.classList.remove('shake-it');
        void inputElement.offsetWidth; // Reflow for animation
        inputElement.classList.add('shake-it');
    } else {
        inputElement.style.borderColor = "#646669";
    }


    if (arrayValue.length === arrayQuote.length && !errorFound) {
        finishTest();
    }
});

function startTimer() {
    timerStarted = true;
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            finishTest();
        } else {
            timeLeft--;
            timerElement.innerText = timeLeft;
        }
    }, 1000);
}


window.addEventListener('keydown', (e) => {

    if (e.key === 'Enter' && !resultScreen.classList.contains('hidden')) {
        e.preventDefault();
        retryBtn.click();
    }
});
renderNewQuote();