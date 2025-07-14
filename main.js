var canvasEl = document.querySelector(".fireworks");
var ctx = canvasEl.getContext("2d");
var numberOfParticules = 0;
var amount = 0;
var urlMusic = [
  "http://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/burst1.mp3",
  "http://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/burst2.mp3",
  "http://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/burst-sm-1.mp3",
];
var music;
var soundVolume = 0;
var fireworksLimit = 0;
var colorCreate;

var boom = 5;
var speed = 500;
var variationsSize;
var variations2Checkbox;
var variations3Checkbox;
var variations4Checkbox;
var variations1DropdownAmount;
var variations2DropdownAmount;
var variations3DropdownAmount;
var variations4DropdownAmount;
var variations1Amount = 0;
var variations2Amount = 0;
var variations3Amount = 0;
var variations4Amount = 0;

var size = 0;
var variations;

window.addEventListener("onWidgetLoad", function (obj) {
  let data = obj.detail.session.data;
  let fieldData = obj.detail.fieldData;
  fields = fieldData;
  soundVolume = fieldData.soundVolume;
  fireworksLimit = fieldData.variations1Limit;
  numberOfParticules = fieldData.variations1Particules;
  variations2Checkbox = fieldData.variations2Checkbox;
  variations3Checkbox = fieldData.variations3Checkbox;
  variations4Checkbox = fieldData.variations4Checkbox;
  variations1Amount = fieldData.variations1;
  variations2Amount = fieldData.variations2;
  variations3Amount = fieldData.variations3;
  variations4Amount = fieldData.variations4;
});

function variationsFierwork() {
  switch (variations) {
    case fields.variations2Emulate:
      numberOfParticules = fields.variations2Particules;
      fireworksLimit = fields.variations2Limit;
      variationsSize = fields.variations2DropdownSize;
      variationsFierworkSize();
      break;
    case fields.variations3Emulate:
      numberOfParticules = fields.variations3Particules;
      fireworksLimit = fields.variations3Limit;
      variationsSize = fields.variations3DropdownSize;
      variationsFierworkSize();
      break;
    case fields.variations4Emulate:
      numberOfParticules = fields.variations4Particules;
      fireworksLimit = fields.variations4Limit;
      variationsSize = fields.variations4DropdownSize;
      variationsFierworkSize();
      break;
    case fields.variations1Emulate:
    default:
      numberOfParticules = fields.variations1Particules;
      fireworksLimit = fields.variations1Limit;
      variationsSize = fields.variations1DropdownSize;
      variations1Amount = fields.variations1;
      variationsFierworkSize();
      break;
  }
}

function variationsFierworkSize() {
  switch (variationsSize) {
    case "medium":
      size = fields.mediumSize;
      break;
    case "large":
      size = fields.largeSize;
      break;
    case "huge":
      size = fields.hugeSize;
      break;
    case "small":
    default:
      size = fields.smallSize;
      break;
  }
}
window.addEventListener("onEventReceived", function (obj) {
  let listener = obj.detail.listener;
  let event = obj.detail.event;
  amount = obj.detail.event.amount;

  if (event.listener == "widget-button") {
    boom = fireworksLimit;
    variations = event.value;
    variationsFierwork();
    autoClick();
  }

  if (listener == "tip-latest") {
    if (amount >= variations1Amount) {
      variations = `1`;
      variationsFierwork();
      boom = Math.round(amount);
      if (boom >= fireworksLimit) boom = fireworksLimit;
      if (variations2Checkbox == true) {
        if (amount >= variations2Amount) {
          variations = `2`;
          variationsFierwork();
          boom = Math.round(amount);
          if (boom >= fireworksLimit) boom = fireworksLimit;
        }
      }
      if (variations3Checkbox == true) {
        if (amount >= variations3Amount) {
          variations = `3`;
          variationsFierwork();
          boom = Math.round(amount);
          if (boom >= fireworksLimit) boom = fireworksLimit;
        }
      }
      if (variations4Checkbox == true) {
        if (amount >= variations4Amount) {
          variations = `4`;
          variationsFierwork();
          boom = Math.round(amount);
          if (boom >= fireworksLimit) boom = fireworksLimit;
        }
      }
      autoClick();
    }
  }
});
function setCanvasSize() {
  canvasEl.width = window.innerWidth * 2;
  canvasEl.height = window.innerHeight * 2;
  canvasEl.style.width = window.innerWidth + "px";
  canvasEl.style.height = window.innerHeight + "px";
  canvasEl.getContext("2d").scale(2, 2);
}

function setParticuleDirection(p) {
  var angle = (anime.random(0, 360) * Math.PI) / 180;
  var value = anime.random(10, size);
  var radius = [-1, 1][anime.random(0, 1)] * value;
  return {
    x: p.x + radius * Math.cos(angle),
    y: p.y + radius * Math.sin(angle),
  };
}
function createColors() {
  var colorList = [
    "#005dff",
    "#ff8700",
    "#ff0000",
    "#fffb00",
    "#7cff00",
    "#00ff80",
    "#00cdff",
    "#3a00ff",
    "#ff00cd",
  ];

  colorCreate = colorList[anime.random(0, colorList.length - 1)];
}
function createParticule(x, y) {
  var p = {};
  p.x = x;
  p.y = y;
  p.color =
    "HSL(" + anime.random(0, 360) + ", 100%, " + anime.random(50, 60) + "%)";
  //p.color = colorCreate;
  p.radius = anime.random(12, 20);
  p.endPos = setParticuleDirection(p);
  p.draw = function () {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.8;
  };

  return p;
}

function createCircle(x, y) {
  var p = {};
  p.x = x;
  p.y = y;
  p.color = "#FFF";
  p.radius = 0.1;
  p.alpha = 0.5;
  p.lineWidth = 6;
  p.draw = function () {
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
    ctx.lineWidth = p.lineWidth;
    ctx.strokeStyle = p.color;
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  return p;
}

function renderParticule(anim) {
  for (var i = 0; i < anim.animatables.length; i++) {
    anim.animatables[i].target.draw();
  }
}

function animateParticules(x, y) {
  var circle = createCircle(x, y);

  var particules = [];
  for (var i = 0; i < numberOfParticules; i++) {
    particules.push(createParticule(x, y));
  }
  anime.timeline().add({
    targets: particules,
    //rotate: '1turn',
    x: function (p) {
      return p.endPos.x;
    },
    y: function (p) {
      return p.endPos.y;
    },
    radius: 0.1,
    duration: anime.random(1500, 3000),
    easing: "easeOutCirc",
    update: renderParticule,
  });
}
var render = anime({
  duration: Infinity,
  update: function () {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  },
});

var centerX = window.innerWidth / 2;
var centerY = window.innerHeight / 2;

function autoClick() {
  var randomItem = urlMusic[Math.floor(Math.random() * urlMusic.length)];
  music = new Audio(randomItem);
  if (music) {
    music.volume = soundVolume / 100;
    music.play();
  }
  createColors();
  animateParticules(
    anime.random(
      centerX - window.innerWidth / 2.5,
      centerX + window.innerWidth / 2.5
    ),
    anime.random(
      centerY - window.innerHeight / 2.5,
      centerY + window.innerHeight / 2.5
    )
  );
  if (boom >> 1) {
    boom--;
    anime({ duration: speed }).finished.then(autoClick);
  } else {
    anime({ duration: 1000 }).finished;
  }
}

setCanvasSize();
window.addEventListener("resize", setCanvasSize, false);

/*
# Initial code from (https://codepen.io/juliangarnier/pen/gmOwJX) edited by Tomtom7156
# Twitch: tomtom7156
# Discord: tomtom7156
*/
