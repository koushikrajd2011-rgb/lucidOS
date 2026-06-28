var biggestIndex = 10;
var topBar = document.querySelector("#top");

function openWindow(element) {
  element.style.display = "flex";
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
}

function closeWindow(element) {
  element.style.display = "none";
}

function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  topBar.style.zIndex = biggestIndex + 1;
  deselectIcon(selectedIcon);
}

function addWindowTapHandling(element) {
  element.addEventListener("mousedown", function() {
    handleWindowTap(element);
  });
}

function initializeWindow(id) {
  var el = document.querySelector("#" + id);
  dragElement(el);
  addWindowTapHandling(el);
  var closeBtn = document.querySelector("#" + id + "close");
  if (closeBtn) {
    closeBtn.addEventListener("click", function() {
      closeWindow(el);
    });
  }
}

function dragElement(element) {
  var initialX = 0, initialY = 0, currentX = 0, currentY = 0;
  var handle = document.getElementById(element.id + "header");
  if (handle) {
    handle.onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = moveElement;
  }
  function moveElement(e) {
    e = e || window.event;
    e.preventDefault();
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    element.style.top  = (element.offsetTop  - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }
  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

var selectedIcon = undefined;

function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element;
}

function deselectIcon(element) {
  if (element) element.classList.remove("selected");
  selectedIcon = undefined;
}

function handleIconTap(element) {
  if (element.classList.contains("selected")) {
    deselectIcon(element);
  } else {
    deselectIcon(selectedIcon);
    selectIcon(element);
  }
}

var welcomeScreen    = document.querySelector("#welcome");
var calculatorScreen = document.querySelector("#calculator");
var weatherScreen    = document.querySelector("#weather");
var stopwatchScreen  = document.querySelector("#stopwatch");
var emojiScreen      = document.querySelector("#emoji");
var guessScreen      = document.querySelector("#guess");
var pixelScreen      = document.querySelector("#pixel");
var lucidNotesScreen = document.querySelector("#lucidnotes");
var lucidTunesScreen = document.querySelector("#lucidtunes");

document.querySelector("#welcomeopen").addEventListener("click", function() {
  openWindow(welcomeScreen);
});

initializeWindow("welcome");
initializeWindow("calculator");
initializeWindow("weather");
initializeWindow("stopwatch");
initializeWindow("emoji");
initializeWindow("guess");
initializeWindow("pixel");
initializeWindow("lucidnotes");
initializeWindow("lucidtunes");

// ── Calculator ──
var calcExpression = "";
function calcInput(val) {
  var display = document.getElementById("calcDisplay");
  if (val === "C") {
    calcExpression = "";
    display.textContent = "0";
  } else if (val === "=") {
    try {
      var result = eval(calcExpression.replace("%", "/100"));
      display.textContent = result;
      calcExpression = String(result);
    } catch (e) {
      display.textContent = "Error";
      calcExpression = "";
    }
  } else {
    calcExpression += val;
    display.textContent = calcExpression;
  }
}

// ── Weather ──
function fetchWeather() {
  var city = document.getElementById("cityInput").value.trim();
  var result = document.getElementById("weatherResult");
  if (!city) { result.innerHTML = "Please enter a city name."; return; }
  result.innerHTML = "Loading...";
  fetch("https://wttr.in/" + encodeURIComponent(city) + "?format=j1")
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var current = data.current_condition[0];
      var temp = current.temp_C;
      var feels = current.FeelsLikeC;
      var desc = current.weatherDesc[0].value;
      var humidity = current.humidity;
      var emoji = "🌤";
      var d = desc.toLowerCase();
      if (d.includes("rain")) emoji = "🌧";
      else if (d.includes("cloud")) emoji = "☁️";
      else if (d.includes("sun") || d.includes("clear")) emoji = "☀️";
      else if (d.includes("snow")) emoji = "❄️";
      else if (d.includes("storm") || d.includes("thunder")) emoji = "⛈";
      else if (d.includes("fog") || d.includes("mist")) emoji = "🌫";
      result.innerHTML = '<div style="font-size:48px;margin-bottom:6px;">' + emoji + '</div><div style="font-size:32px;font-weight:600;color:var(--text-dark);">' + temp + '°C</div><div style="font-size:14px;color:var(--text-mid);margin:4px 0;">' + desc + '</div><div style="font-size:12px;color:var(--text-muted);">Feels like ' + feels + '°C · Humidity ' + humidity + '%</div>';
    })
    .catch(function() {
      result.style.color = 'var(--text-dark)';
      result.innerHTML = "Couldn't find that city. Try again!";
    });
}
document.getElementById("cityInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") fetchWeather();
});

// ── Stopwatch ──
var swInterval = null, swElapsed = 0, swRunning = false;
function swFormat(ms) {
  var mins = Math.floor(ms / 60000);
  var secs = Math.floor((ms % 60000) / 1000);
  var cents = Math.floor((ms % 1000) / 10);
  return String(mins).padStart(2,"0") + ":" + String(secs).padStart(2,"0") + "." + String(cents).padStart(2,"0");
}
function swStart() {
  if (swRunning) return;
  swRunning = true;
  var startTime = Date.now() - swElapsed;
  swInterval = setInterval(function() {
    swElapsed = Date.now() - startTime;
    document.getElementById("swDisplay").textContent = swFormat(swElapsed);
  }, 10);
}
function swStop() {
  if (!swRunning) return;
  swRunning = false;
  clearInterval(swInterval);
}
function swReset() {
  swStop();
  swElapsed = 0;
  document.getElementById("swDisplay").textContent = "00:00.00";
}

// ── Emoji ──
var emojis = [
  "😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎","😍","😘","🥰","😗",
  "😙","😚","🙂","🤗","🤩","🤔","🤨","😐","😑","😶","🙄","😏","😣","😥","😮","🤐",
  "😯","😪","😫","🥱","😴","😌","😛","😜","😝","🤤","😒","😓","😔","😕","🙃","🤑",
  "😲","☹️","🙁","😖","😞","😟","😤","😢","😭","😦","😧","😨","😩","🤯","😬","😰",
  "😱","🥵","🥶","😳","🤪","😵","🥴","😠","😡","🤬","😷","🤒","🤕","🤢","🤮","🤧",
  "🥳","🥸","🤠","🤡","🥺","🤥","🤫","🤭","🧐","🤓","😈","👿","👹","👺","💀","☠️",
  "👻","👽","👾","🤖","💩","😺","😸","😹","😻","😼","😽","🙀","😿","😾",
  "👋","🤚","🖐","✋","🖖","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆",
  "🖕","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍️",
  "💅","🤳","💪","🦾","🦿","🦵","🦶","👂","🦻","👃","🫀","🫁","🧠","🦷","🦴","👀",
  "🌹","🌺","🌸","🌼","🌻","🌞","🌝","🌛","🌜","🌚","🌕","🌖","🌗","🌘","🌑","🌒",
  "⭐","🌟","💫","✨","☄️","🌈","🌤","⛅","🌥","☁️","🌦","🌧","⛈","🌩","🌨","❄️",
  "🍎","🍊","🍋","🍇","🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑",
  "🍕","🍔","🍟","🌭","🍿","🧂","🥓","🥚","🍳","🧇","🥞","🧈","🍞","🥐","🥨","🧀",
  "🚀","🛸","🌍","🌎","🌏","🪐","⭐","🌟","💫","✨","🌌","🔭","👨‍🚀","👩‍🚀","🛰","🌠"
];
(function buildEmojiGrid() {
  var grid = document.getElementById("emojiGrid");
  emojis.forEach(function(em) {
    var btn = document.createElement("button");
    btn.textContent = em;
    btn.style.cssText = "font-size:20px;background:transparent;border:none;cursor:pointer;padding:4px;border-radius:0px;transition:background 0.15s;";
    btn.addEventListener("mouseenter", function() { btn.style.background = "rgba(177,156,217,0.2)"; });
    btn.addEventListener("mouseleave", function() { btn.style.background = "transparent"; });
    btn.addEventListener("click", function() {
      navigator.clipboard.writeText(em).then(function() {
        document.getElementById("emojiCopied").textContent = "Copied " + em + " to clipboard!";
        setTimeout(function() { document.getElementById("emojiCopied").textContent = ""; }, 2000);
      });
    });
    grid.appendChild(btn);
  });
})();

// ── Guess ──
var secretNumber = Math.floor(Math.random() * 100) + 1;
var guessAttempts = 0;
function makeGuess() {
  var input = parseInt(document.getElementById("guessInput").value);
  var feedback = document.getElementById("guessFeedback");
  var attemptsEl = document.getElementById("guessAttempts");
  if (!input || input < 1 || input > 100) { feedback.textContent = "Enter a number between 1 and 100!"; return; }
  guessAttempts++;
  attemptsEl.textContent = "Attempts: " + guessAttempts;
  if (input === secretNumber) {
    feedback.innerHTML = "🎉 You got it! The number was <b>" + secretNumber + "</b>!";
  } else if (input < secretNumber) {
    var diff = secretNumber - input;
    feedback.textContent = diff > 20 ? "📈 Way too low!" : diff > 10 ? "⬆️ Too low!" : "🔥 A little higher!";
  } else {
    var diff = input - secretNumber;
    feedback.textContent = diff > 20 ? "📉 Way too high!" : diff > 10 ? "⬇️ Too high!" : "🔥 A little lower!";
  }
  document.getElementById("guessInput").value = "";
}
function resetGuess() {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  guessAttempts = 0;
  document.getElementById("guessFeedback").textContent = "Pick a number and guess!";
  document.getElementById("guessAttempts").textContent = "Attempts: 0";
  document.getElementById("guessInput").value = "";
}
document.getElementById("guessInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") makeGuess();
});

// ── Pixel Art ──
var currentColor = "#a78bfa";
var isDrawing = false;
var GRID_SIZE = 20;
var palette = ["#1a0a2e","#3b1f6b","#6d28d9","#a78bfa","#c4b5fd","#e8e4ff","#ffffff","#f0abfc","#ec4899","#f97316"];
(function buildPalette() {
  var pc = document.getElementById("paletteColors");
  palette.forEach(function(color) {
    var swatch = document.createElement("div");
    swatch.style.cssText = "width:24px;height:24px;border-radius:0px;background:" + color + ";cursor:pointer;border:2px solid transparent;transition:border 0.15s;";
    swatch.addEventListener("click", function() {
      currentColor = color;
      document.getElementById("customColor").value = color;
      document.querySelectorAll("#paletteColors div").forEach(function(s) { s.style.borderColor = "transparent"; });
      swatch.style.borderColor = "rgba(255,255,255,0.8)";
    });
    pc.appendChild(swatch);
  });
})();
document.getElementById("customColor").addEventListener("input", function() { currentColor = this.value; });
(function buildPixelGrid() {
  var grid = document.getElementById("pixelGrid");
  for (var i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    var cell = document.createElement("div");
    cell.style.cssText = "width:18px;height:18px;background:rgba(255,255,255,0.05);border-radius:0px;cursor:crosshair;transition:background 0.05s;";
    cell.addEventListener("mousedown", function() { isDrawing = true; this.style.background = currentColor; });
    cell.addEventListener("mouseenter", function() { if (isDrawing) this.style.background = currentColor; });
    cell.addEventListener("mouseup", function() { isDrawing = false; });
    grid.appendChild(cell);
  }
  document.addEventListener("mouseup", function() { isDrawing = false; });
})();
function clearPixelGrid() {
  document.querySelectorAll("#pixelGrid div").forEach(function(cell) { cell.style.background = "rgba(255,255,255,0.05)"; });
}

// ── LucidNotes ──
document.getElementById("lucidNotesText").addEventListener("input", function() {
  document.getElementById("lucidNotesCount").textContent = this.value.length + " characters";
});
function clearLucidNotes() {
  document.getElementById("lucidNotesText").value = "";
  document.getElementById("lucidNotesCount").textContent = "0 characters";
}

// ── LucidTunes ──
function tunesPlay() {
  var a = document.getElementById("tunesAudio");
  a.play();
  document.getElementById("tunesStatus").textContent = "Now playing 🎶";
}
function tunesPause() {
  var a = document.getElementById("tunesAudio");
  a.pause();
  document.getElementById("tunesStatus").textContent = "Paused ⏸";
}
function tunesStop() {
  var a = document.getElementById("tunesAudio");
  a.pause();
  a.currentTime = 0;
  document.getElementById("tunesStatus").textContent = "Stopped ⏹";
}

// ── About & Settings ──
var aboutScreen = document.querySelector("#about");
initializeWindow("about");
var settingsScreen = document.querySelector("#settings");
initializeWindow("settings");

// ── Dock screens ──
var jokeScreen   = document.querySelector("#joke");
var factScreen   = document.querySelector("#fact");
var animalScreen = document.querySelector("#animal");
var wordScreen   = document.querySelector("#word");
initializeWindow("joke");
initializeWindow("fact");
initializeWindow("animal");
initializeWindow("word");

// ── Joke ──
function fetchJoke() {
  var setup = document.getElementById("jokeSetup");
  var punchline = document.getElementById("jokePunchline");
  setup.textContent = "Loading...";
  punchline.textContent = "";
  fetch("https://official-joke-api.appspot.com/random_joke")
    .then(function(r) { return r.json(); })
    .then(function(data) {
      setup.textContent = data.setup;
      setTimeout(function() { punchline.textContent = "👉 " + data.punchline; }, 1000);
    })
    .catch(function() {
      setup.textContent = "Why did the API fail?";
      punchline.textContent = "👉 Because it had too many requests! 😅";
    });
}
fetchJoke();

// ── Facts ──
var facts = [
  "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible.",
  "A group of flamingos is called a 'flamboyance'.",
  "The shortest war in history was between Britain and Zanzibar in 1896 — it lasted only 38 minutes.",
  "Octopuses have three hearts and blue blood.",
  "There are more possible iterations of a game of chess than there are atoms in the known universe.",
  "Bananas are technically berries, but strawberries are not.",
  "A day on Venus is longer than a year on Venus.",
  "The human brain generates about 70,000 thoughts per day.",
  "Crows can recognize and remember human faces.",
  "The Eiffel Tower grows about 6 inches taller in summer due to heat expansion.",
  "Sharks are older than trees — they've existed for over 400 million years.",
  "There is a species of jellyfish that is biologically immortal.",
  "The average person walks the equivalent of 3 times around the world in a lifetime.",
  "A snail can sleep for up to 3 years.",
  "Lightning strikes the Earth about 100 times per second.",
  "The word 'nerd' was first coined by Dr. Seuss in 1950.",
  "Wombat poop is cube-shaped — the only animal known to produce cubic feces.",
  "A single cloud can weigh more than a million pounds.",
  "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
  "The fingerprints of a koala are almost indistinguishable from those of a human."
];
function fetchFact() {
  var factEl = document.getElementById("factText");
  factEl.textContent = "Thinking... 🧠";
  setTimeout(function() {
    factEl.textContent = "💡 " + facts[Math.floor(Math.random() * facts.length)];
  }, 400);
}
fetchFact();

// ── Animals ──
var animals = [
  { name: "Cat", emoji: "🐱", fact: "Cats sleep 12–16 hours a day and have a special collarbone that lets them always land on their feet." },
  { name: "Dog", emoji: "🐶", fact: "Dogs have a sense of smell that is 10,000 to 100,000 times more powerful than humans." },
  { name: "Elephant", emoji: "🐘", fact: "Elephants are the only animals that can't jump — and they're also one of the few that mourn their dead." },
  { name: "Penguin", emoji: "🐧", fact: "Penguins propose to their mates with a pebble. If she accepts, they're together for life." },
  { name: "Octopus", emoji: "🐙", fact: "Octopuses have three hearts, nine brains, and blue blood." },
  { name: "Giraffe", emoji: "🦒", fact: "Giraffes only need 5 to 30 minutes of sleep per day, often in short naps." },
  { name: "Axolotl", emoji: "🦎", fact: "Axolotls can regenerate entire limbs, parts of their heart, and even bits of their brain." },
  { name: "Platypus", emoji: "🦆", fact: "The platypus is one of the few mammals that lays eggs AND produces venom." },
  { name: "Sloth", emoji: "🦥", fact: "Sloths are so slow that algae actually grow on their fur, acting as camouflage." },
  { name: "Dolphin", emoji: "🐬", fact: "Dolphins sleep with one eye open and half their brain awake to watch for predators." },
  { name: "Cheetah", emoji: "🐆", fact: "Cheetahs can accelerate from 0 to 60 mph in just 3 seconds — faster than most sports cars." },
  { name: "Crow", emoji: "🐦", fact: "Crows can recognize human faces and hold grudges against people who have wronged them." },
  { name: "Tardigrade", emoji: "🦠", fact: "Tardigrades (water bears) can survive in outer space, extreme radiation, and near-absolute zero." },
  { name: "Mantis Shrimp", emoji: "🦐", fact: "Mantis shrimp can punch with the force of a bullet and see 16 types of color receptors (humans have 3)." },
  { name: "Honeybee", emoji: "🐝", fact: "A single honeybee produces only 1/12th of a teaspoon of honey in its entire lifetime." }
];
function fetchAnimal() {
  var result = document.getElementById("animalResult");
  result.innerHTML = '<div style="font-size:40px;">🔄</div><p style="color:var(--text-mid);font-size:13px;margin:0;">Finding an animal...</p>';
  setTimeout(function() {
    var a = animals[Math.floor(Math.random() * animals.length)];
    result.innerHTML = '<div style="font-size:72px;margin-bottom:8px;">' + a.emoji + '</div><div style="font-size:20px;font-weight:700;color:var(--text-dark);margin-bottom:10px;">' + a.name + '</div><div style="font-size:13px;color:var(--text-dark);line-height:1.7;background:var(--accent-light);border-radius:4px;padding:12px;">🌿 ' + a.fact + '</div>';
  }, 500);
}
fetchAnimal();

// ── Word of Day ──
var words = [
  { word: "Ephemeral", type: "adjective", def: "Lasting for a very short time; transitory.", example: "The ephemeral beauty of cherry blossoms makes them all the more precious." },
  { word: "Sonder", type: "noun", def: "The realization that each passerby has a life as vivid and complex as your own.", example: "Walking through the city, she felt a deep sense of sonder." },
  { word: "Luminous", type: "adjective", def: "Full of or shedding light; bright or shining.", example: "The luminous stars guided them through the night." },
  { word: "Labyrinthine", type: "adjective", def: "Like a labyrinth; intricate and confusing.", example: "The labyrinthine streets of the old city were impossible to navigate." },
  { word: "Halcyon", type: "adjective", def: "Denoting a period of time in the past that was idyllically happy and peaceful.", example: "She looked back fondly on those halcyon days of childhood." },
  { word: "Serendipity", type: "noun", def: "The occurrence of events by chance in a happy or beneficial way.", example: "Finding that book was pure serendipity." },
  { word: "Mellifluous", type: "adjective", def: "Sweet or musical; pleasant to hear.", example: "Her mellifluous voice filled the entire room." },
  { word: "Quixotic", type: "adjective", def: "Exceedingly idealistic; unrealistic and impractical.", example: "His quixotic plan to sail around the world alone surprised everyone." },
  { word: "Ethereal", type: "adjective", def: "Extremely delicate and light in a way that seems not quite of this world.", example: "The fog gave the forest an ethereal quality." },
  { word: "Petrichor", type: "noun", def: "The pleasant earthy smell after rain falls on dry earth.", example: "She stepped outside and breathed in the petrichor after the storm." },
  { word: "Limerence", type: "noun", def: "The state of being infatuated or obsessed with another person.", example: "His limerence for her made it impossible to focus on anything else." },
  { word: "Ineffable", type: "adjective", def: "Too great or extreme to be expressed or described in words.", example: "The view from the summit was ineffable — no words could do it justice." },
  { word: "Solipsistic", type: "adjective", def: "Relating to the theory that only one's own mind is sure to exist.", example: "His solipsistic worldview made it hard for him to empathize with others." },
  { word: "Numinous", type: "adjective", def: "Having a strong religious or spiritual quality.", example: "The ancient temple had a numinous atmosphere that filled visitors with awe." },
  { word: "Hiraeth", type: "noun", def: "A homesickness for a home you can't return to, or that never was.", example: "She felt a deep hiraeth whenever she heard that old song." }
];
(function loadWordOfDay() {
  var today = new Date();
  var w = words[today.getDate() % words.length];
  document.getElementById("wordDate").textContent = today.toDateString();
  document.getElementById("wordTitle").textContent = w.word;
  document.getElementById("wordType").textContent = w.type;
  document.getElementById("wordDef").textContent = w.def;
  document.getElementById("wordExample").textContent = '"' + w.example + '"';
})();

// ── Surprise Me ──
var allScreens = [
  calculatorScreen, weatherScreen, stopwatchScreen,
  emojiScreen, guessScreen, pixelScreen,
  lucidNotesScreen, lucidTunesScreen, jokeScreen, factScreen, animalScreen, wordScreen
];
function surpriseMe() {
  var random = allScreens[Math.floor(Math.random() * allScreens.length)];
  openWindow(random);
}

// ── Activity Widget (C) ──
var appOpenCount = 0;
var appOpenLog = [];
function trackApp(name) {
  appOpenCount++;
  appOpenLog.push(name);
  if (appOpenLog.length > 7) appOpenLog.shift();
  document.getElementById("widgetCount").textContent = appOpenCount;
  document.getElementById("widgetLast").textContent = "last: " + name;
  // draw bars
  var barsEl = document.getElementById("widgetBars");
  barsEl.innerHTML = "";
  var max = Math.max.apply(null, appOpenLog.map(function(_, i) { return i + 1; }));
  appOpenLog.forEach(function(_, i) {
    var bar = document.createElement("div");
    var h = Math.round(((i + 1) / appOpenLog.length) * 36);
    bar.style.cssText = "width:16px;border-radius:0px;background:var(--accent);opacity:" + (0.4 + (i / appOpenLog.length) * 0.6) + ";height:" + h + "px;transition:height 0.3s;";
    barsEl.appendChild(bar);
  });
}

// ── Lumi Pet (D) ──
var lumiOpen = false;
var lumiKnowledge = {
  calculator: "Calculator lets you do math — add, subtract, multiply, divide, even percentages!",
  weather: "Weather shows live conditions for any city. Type a city name and hit Go ☁️",
  stopwatch: "Stopwatch times things down to the hundredth of a second. Start, stop, reset!",
  emoji: "Emoji Picker has hundreds of emojis. Click one to copy it to your clipboard 📋",
  guess: "Guess! is a number guessing game — pick 1–100. I'll tell you if you're hot or cold 🔥",
  pixel: "Pixel Art lets you draw on a 20×20 grid with a color palette. Make something cool 🎨",
  notes: "LucidNotes is a scratchpad for your thoughts. Just start typing 📝",
  lucidnotes: "LucidNotes is a scratchpad for your thoughts. Just start typing 📝",
  tunes: "LucidTunes plays Never Gonna Give You Up 🎵 You got rickrolled by an OS 😂",
  lucidtunes: "LucidTunes plays Never Gonna Give You Up 🎵 You got rickrolled by an OS 😂",
  joke: "Joke Generator fetches a random joke. It's hit or miss but mostly funny 😂",
  fact: "Facts gives you a random interesting fact every time. Very addictive 🧠",
  animal: "Random Animal shows you a fun animal with a fact about it 🐾",
  word: "Word of the Day shows you a beautiful or unusual word each day 📖",
  surprise: "Surprise Me opens a random app — you never know what you'll get 🎲",
  settings: "Settings lets you switch between Purple, Blue and Black themes ⚙️"
};
function toggleLumi() {
  lumiOpen = !lumiOpen;
  document.getElementById("lumiBubble").style.display = lumiOpen ? "block" : "none";
  if (lumiOpen) document.getElementById("lumiInput").focus();
}
function lumiReply() {
  var input = document.getElementById("lumiInput").value.trim().toLowerCase();
  var reply = "Hmm I don't know that one! Try asking about an app like 'calculator' or 'weather' 🤔";
  Object.keys(lumiKnowledge).forEach(function(key) {
    if (input.includes(key)) reply = lumiKnowledge[key];
  });
  if (input.includes("hi") || input.includes("hello") || input.includes("hey")) {
    reply = "Hey there! 👋 Ask me what any app does!";
  }
  if (input.includes("best") || input.includes("favourite") || input.includes("favorite")) {
    reply = "My favourite? Pixel Art, obviously. I'm basically a pixel 🟣";
  }
  if (input.includes("theme") || input.includes("color") || input.includes("colour")) {
    reply = "Go to Settings ⚙️ to switch between Purple, Blue and Black themes!";
  }
  document.getElementById("lumiBubbleText").textContent = reply;
  document.getElementById("lumiInput").value = "";
}

// ── Icon maps ──
var purpleIcons = {
  calculator: "./calculator.png",
  weather:    "./weather.png",
  stopwatch:  "./stopwatch.png",
  emoji:      "./Emoji.png",
  guess:      "./NumberGam.png",
  pixel:      "./PixelArt.png",
  notes:      "./Notes.png",
  tunes:      "./Tunes.png"
};
var blueIcons = {
  calculator: "./BlueCalc.png",
  weather:    "./weatherblue.png",
  stopwatch:  "./BlueStopwatch.png",
  emoji:      "./BlueEmoji.png",
  guess:      "./BlueGame.png",
  pixel:      "./BlueArt.png",
  notes:      "./BlueNotes.png",
  tunes:      "./BlueTunes.png"
};
var blackIcons = {
  calculator: "./BlackCalc.png",
  weather:    "./blackweather.png",
  stopwatch:  "./blackwatch.png",
  emoji:      "./Blackemoji.png",
  guess:      "./BlackGuess.png",
  pixel:      "./BlackArt.png",
  notes:      "./BlackNotes.png",
  tunes:      "./BlackTunes.png"
};
var blackDockIcons = {
  joke:     "./BlackAppJoke.png",
  facts:    "./BlackFacts.png",
  animals:  "./BlackAnimal.png",
  word:     "./WordBlack.png",
  surprise: "./BlackSuprise.png"
};
var purpleDockIcons = {
  joke: "./Joke.png", facts: "./facts.png", animals: "./animals.png",
  word: "./word.png", surprise: "./suprise.png"
};
var blueDockIcons = {
  joke: "./BlueJokes.png", facts: "./BlueFacts.png", animals: "./BlueAnimals.png",
  word: "./BlueWord.png", surprise: "./BlueSuprise.png"
};

// ── Cursor trail ──
var trailCanvas = document.getElementById("trailCanvas");
var trailCtx = trailCanvas.getContext("2d");
var trailPoints = [];
var currentTheme = "purple";
var trailActive = true;

function resizeTrailCanvas() {
  trailCanvas.width = window.innerWidth;
  trailCanvas.height = window.innerHeight;
}
resizeTrailCanvas();
window.addEventListener("resize", resizeTrailCanvas);

document.addEventListener("mousemove", function(e) {
  if (!trailActive) return;
  trailPoints.push({ x: e.clientX, y: e.clientY, age: 0, size: 6 + Math.random() * 6 });
  if (trailPoints.length > 60) trailPoints.shift();
});

function getTrailColor() {
  if (currentTheme === "blue") return "100, 160, 255";
  if (currentTheme === "black") return "255, 255, 255";
  return "168, 139, 250";
}

// Black theme: dots pattern on canvas, trail reveals/fades
function drawBlackBackground() {
  trailCtx.fillStyle = "#000";
  trailCtx.fillRect(0, 0, trailCanvas.width, trailCanvas.height);
  // draw subtle dot grid
  var spacing = 28;
  var color = getTrailColor();
  for (var x = 0; x < trailCanvas.width; x += spacing) {
    for (var y = 0; y < trailCanvas.height; y += spacing) {
      // check proximity to any trail point
      var maxGlow = 0;
      for (var i = 0; i < trailPoints.length; i++) {
        var tp = trailPoints[i];
        var dist = Math.sqrt((x - tp.x) * (x - tp.x) + (y - tp.y) * (y - tp.y));
        var radius = 90 - tp.age * 1.2;
        if (dist < radius) {
          var glow = (1 - dist / radius) * (1 - tp.age / 60);
          if (glow > maxGlow) maxGlow = glow;
        }
      }
      var alpha = 0.06 + maxGlow * 0.7;
      trailCtx.beginPath();
      trailCtx.arc(x, y, 1.5, 0, Math.PI * 2);
      trailCtx.fillStyle = "rgba(" + color + "," + alpha + ")";
      trailCtx.fill();
    }
  }
}

// Purple/Blue trail: glowing dots following cursor
function drawColorTrail() {
  trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  var color = getTrailColor();
  for (var i = 0; i < trailPoints.length; i++) {
    var p = trailPoints[i];
    var alpha = (1 - p.age / 60) * 0.7;
    var size = p.size * (1 - p.age / 80);
    if (size <= 0 || alpha <= 0) continue;
    var grad = trailCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
    grad.addColorStop(0, "rgba(" + color + "," + alpha + ")");
    grad.addColorStop(1, "rgba(" + color + ",0)");
    trailCtx.beginPath();
    trailCtx.arc(p.x, p.y, size, 0, Math.PI * 2);
    trailCtx.fillStyle = grad;
    trailCtx.fill();
  }
}

function animateTrail() {
  for (var i = 0; i < trailPoints.length; i++) {
    trailPoints[i].age++;
  }
  trailPoints = trailPoints.filter(function(p) { return p.age < 60; });

  if (currentTheme === "black") {
    drawBlackBackground();
  } else if (trailActive) {
    drawColorTrail();
  } else {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
  }
  requestAnimationFrame(animateTrail);
}
animateTrail();

// ── setTheme ──
function setTheme(theme) {
  var body = document.getElementById("osBody");
  var bgVideo = document.getElementById("bgVideo");
  var bgVideoSrc = document.getElementById("bgVideoSrc");
  var purpleCard = document.getElementById("purpleThemeCard");
  var blueCard   = document.getElementById("blueThemeCard");
  var blackCard  = document.getElementById("blackThemeCard");
  var label      = document.getElementById("currentThemeLabel");
  var canvas     = document.getElementById("trailCanvas");

  // reset all cards
  purpleCard.style.borderColor = "transparent";
  blueCard.style.borderColor   = "transparent";
  blackCard.style.borderColor  = "transparent";
  purpleCard.style.transform   = "scale(1)";
  blueCard.style.transform     = "scale(1)";
  blackCard.style.transform    = "scale(1)";

  body.classList.remove("blue-theme", "black-theme");
  currentTheme = theme;
  trailPoints = [];

  var desktopIcons, dockIcons;

  if (theme === "blue") {
    body.classList.add("blue-theme");
    bgVideoSrc.src = "./blueback.mp4";
    bgVideo.load(); bgVideo.play();
    bgVideo.style.display = "block";
    canvas.style.display = "none";
    canvas.style.background = "transparent";
    trailActive = true;
    label.textContent = "🔵 Blue";
    blueCard.style.borderColor = "rgba(255,255,255,0.8)";
    blueCard.style.transform = "scale(1.04)";
    desktopIcons = blueIcons;
    dockIcons = blueDockIcons;

  } else if (theme === "black") {
    body.classList.add("black-theme");
    bgVideo.style.display = "none";
    canvas.style.display = "block";
    canvas.style.background = "#000";
    trailActive = true;
    label.textContent = "🖤 Black";
    blackCard.style.borderColor = "rgba(255,255,255,0.8)";
    blackCard.style.transform = "scale(1.04)";
    desktopIcons = blackIcons;
    dockIcons = blackDockIcons;

  } else {
    // purple
    bgVideoSrc.src = "./lucid.mp4";
    bgVideo.load(); bgVideo.play();
    bgVideo.style.display = "block";
    canvas.style.display = "none";
    canvas.style.background = "transparent";
    trailActive = true;
    label.textContent = "🌙 Purple";
    purpleCard.style.borderColor = "rgba(255,255,255,0.8)";
    purpleCard.style.transform = "scale(1.04)";
    desktopIcons = purpleIcons;
    dockIcons = purpleDockIcons;
  }

  // update desktop icons
  Object.keys(desktopIcons).forEach(function(key) {
    var el = document.getElementById("icon-" + key);
    if (el) el.src = desktopIcons[key];
  });

  // update dock icons
  var dockMap = { joke: "dock-joke", facts: "dock-facts", animals: "dock-animals", word: "dock-word", surprise: "dock-surprise" };
  Object.keys(dockIcons).forEach(function(key) {
    var el = document.getElementById(dockMap[key]);
    if (el) el.src = dockIcons[key];
  });
}