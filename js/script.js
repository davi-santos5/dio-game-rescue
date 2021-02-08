function restartGame() {
  gameOverSound.pause();
  $("#end").remove();
  start();
}

var divStart = document.querySelector("#start");
var backgroundGame = document.querySelector("#backgroundGame");

var divPlayer = document.createElement("div");
var divEnemy1 = document.createElement("div");
var divEnemy2 = document.createElement("div");
var divAlly = document.createElement("div");
var divScore = document.createElement("div");
var divEnergy = document.createElement("div");
var btnSound = document.createElement("button");

divPlayer.id = "player";
divEnemy1.id = "enemy1";
divEnemy2.id = "enemy2";
divAlly.id = "ally";
divScore.id = "score";
divEnergy.id = "energy";
btnSound.id = "button-sound";

divPlayer.classList.add("anima1");
divEnemy1.classList.add("anima2");
divAlly.classList.add("anima3");

function start() {
  divStart.style.display = "none";

  backgroundGame.appendChild(divPlayer);
  backgroundGame.appendChild(divEnemy1);
  backgroundGame.appendChild(divEnemy2);
  backgroundGame.appendChild(divAlly);
  backgroundGame.appendChild(divScore);
  backgroundGame.appendChild(divEnergy);
  backgroundGame.appendChild(btnSound);

  btnSound.addEventListener("click", toggleSound);

  var shootSound = document.getElementById("shootSound");
  var explosionSound = document.getElementById("explosionSound");
  var music = document.getElementById("music");
  var gameOverSound = document.getElementById("gameOverSound");
  var lostSound = document.getElementById("lostSound");
  var rescueSound = document.getElementById("rescueSound");

  var isMuted = false;

  btnSound.innerHTML = isMuted
    ? '<i class="fas fa-volume-mute"></i>'
    : '<i class="fas fa-volume-up"></i>';

  shootSound.muted = isMuted;
  explosionSound.muted = isMuted;
  music.muted = isMuted;
  gameOverSound.muted = isMuted;
  lostSound.muted = isMuted;
  rescueSound.muted = isMuted;

  //Looping music
  music.addEventListener(
    "ended",
    function () {
      music.currentTime = 0;
      music.play();
    },
    false
  );
  music.play();

  function toggleSound() {
    isMuted = !isMuted;
    shootSound.muted = isMuted;
    explosionSound.muted = isMuted;
    music.muted = isMuted;
    gameOverSound.muted = isMuted;
    lostSound.muted = isMuted;
    rescueSound.muted = isMuted;

    btnSound.innerHTML = isMuted
      ? '<i class="fas fa-volume-mute"></i>'
      : '<i class="fas fa-volume-up"></i>';
  }

  var left = 0;
  var points = 0;
  var saved = 0;
  var lost = 0;
  var currentEnergy = 3;
  var speed = 5;
  var positionY = parseInt(Math.random() * 334);
  var ableToShoot = true;
  var gameIsOver = false;
  var game = {};
  var KEY = {
    W: "w",
    S: "s",
    D: "d",
  };

  game.press = [];

  document.addEventListener("keydown", function (e) {
    game.press[e.key] = true;
  });

  document.addEventListener("keyup", function (e) {
    game.press[e.key] = false;
  });

  game.timer = setInterval(loop, 20);

  function loop() {
    score();
    energy();
    moveBackground();
    movePlayer();
    moveEnemy1();
    moveEnemy2();
    moveAlly();
    collide();
  }

  function score() {
    divScore.innerHTML = `<h2> Points: ${points} \u00A0\u00A0\u00A0\u00A0\u00A0 Saved: ${saved} \u00A0\u00A0\u00A0\u00A0\u00A0 Lost: ${lost}</h2>`;
  }

  function energy() {
    if (currentEnergy == 3) {
      divEnergy.style.backgroundImage = "url(img/energy3.png)";
    }

    if (currentEnergy == 2) {
      divEnergy.style.backgroundImage = "url(img/energy2.png)";
    }

    if (currentEnergy == 1) {
      divEnergy.style.backgroundImage = "url(img/energy1.png)";
    }

    if (currentEnergy == 0) {
      divEnergy.style.backgroundImage = "url(img/energy0.png)";

      gameOver();
    }
  }

  function moveBackground() {
    backgroundGame.style.backgroundPosition = `${left--}px center`;
  }

  function movePlayer() {
    var top = parseInt(
      window.getComputedStyle(divPlayer).getPropertyValue("top")
    );

    if (game.press[KEY.W] && top >= 10) {
      divPlayer.style.top = `${top - 10}px`;
    }

    if (game.press[KEY.S] && top <= 424) {
      divPlayer.style.top = `${top + 10}px`;
    }

    if (game.press[KEY.D]) {
      shoot();
    }
  }

  function shoot() {
    if (ableToShoot == true) {
      ableToShoot = false;

      shootSound.play();

      var top = parseInt(
        window.getComputedStyle(divPlayer).getPropertyValue("top")
      );
      positionX = parseInt(
        window.getComputedStyle(divPlayer).getPropertyValue("left")
      );
      shootX = positionX + 190;
      shootTop = top + 51;
      $("#backgroundGame").append("<div id='shoot'></div>");
      $("#shoot").css("top", shootTop);
      $("#shoot").css("left", shootX);

      var shootTime = window.setInterval(executeShoot, 30);
    }

    function executeShoot() {
      positionX = parseInt($("#shoot").css("left"));
      $("#shoot").css("left", positionX + 15);

      if (positionX > 900) {
        window.clearInterval(shootTime);
        shootTime = null;
        $("#shoot").remove();
        ableToShoot = true;
      }
    }
  }

  function moveEnemy1() {
    positionX = parseInt($("#enemy1").css("left"));
    $("#enemy1").css("left", positionX - speed);
    $("#enemy1").css("top", positionY);

    if (positionX <= -256) {
      positionY = parseInt(Math.random() * 334);
      $("#enemy1").css("left", 945);
      $("#enemy1").css("top", positionY);
    }
  }

  function moveEnemy2() {
    positionX = parseInt($("#enemy2").css("left"));
    $("#enemy2").css("left", positionX - (speed - 2));

    if (positionX <= -165) {
      $("#enemy2").css("left", 940);
    }
  }

  function moveAlly() {
    positionX = parseInt($("#ally").css("left"));
    $("#ally").css("left", positionX + 1);

    if (positionX > 950) {
      $("#ally").css("left", -34);
    }
  }

  function collide() {
    var collide1 = $("#player").collision($("#enemy1"));
    var collide2 = $("#player").collision($("#enemy2"));
    var collide3 = $("#shoot").collision($("#enemy1"));
    var collide4 = $("#shoot").collision($("#enemy2"));
    var collide5 = $("#player").collision($("#ally"));
    var collide6 = $("#enemy2").collision($("#ally"));

    if (collide1.length > 0) {
      currentEnergy--;
      enemy1X = parseInt($("#enemy1").css("left"));
      enemy1Y = parseInt($("#enemy1").css("top"));
      explosion1(enemy1X, enemy1Y);
      explosionSound.play();

      positionY = parseInt(Math.random() * 334);
      $("#enemy1").css("left", 945);
      $("#enemy1").css("top", positionY);
    }

    if (collide2.length > 0) {
      currentEnergy--;
      enemy2X = parseInt($("#enemy2").css("left"));
      enemy2Y = parseInt($("#enemy2").css("top"));
      explosion2(enemy2X, enemy2Y);
      explosionSound.play();

      $("#enemy2").remove();

      resetEnemy2Position();
    }

    if (collide3.length > 0) {
      points = points + 100;
      enemy1X = parseInt($("#enemy1").css("left"));
      enemy1Y = parseInt($("#enemy1").css("top"));
      explosion1(enemy1X, enemy1Y);
      explosionSound.play();

      $("#shoot").css("left", 950);

      positionY = parseInt(Math.random() * 334);
      $("#enemy1").css("left", 945);
      $("#enemy1").css("top", positionY);
      if (speed <= 12) speed += 0.5;
    }

    if (collide4.length > 0) {
      points = points + 50;
      enemy2X = parseInt($("#enemy2").css("left"));
      enemy2Y = parseInt($("#enemy2").css("top"));
      explosion2(enemy2X, enemy2Y);
      explosionSound.play();

      $("#enemy2").remove();

      $("#shoot").css("left", 950);

      resetEnemy2Position();
      if (speed <= 12) speed += 0.5;
    }

    if (collide5.length > 0) {
      saved++;
      rescueSound.play();
      resetAllyPosition();
      $("#ally").remove();
    }

    if (collide6.length > 0) {
      lost++;
      allyX = parseInt($("#ally").css("left"));
      allyY = parseInt($("#ally").css("top"));
      explosion3(allyX, allyY);
      $("#ally").remove();
      lostSound.play();

      resetAllyPosition();
    }
  }

  function explosion1(enemy1X, enemy1Y) {
    $("#backgroundGame").append("<div id='explosion1'></div");
    $("#explosion1").css("background-image", "url(img/explosion.png)");
    var div = $("#explosion1");
    div.css("top", enemy1Y);
    div.css("left", enemy1X);
    div.animate({ width: 200, opacity: 0 }, "slow");

    window.setTimeout(removeExplosion, 1000);

    function removeExplosion() {
      div.remove();
    }
  }

  function explosion2(enemy2X, enemy2Y) {
    $("#backgroundGame").append("<div id='explosion2'></div");
    $("#explosion2").css("background-image", "url(img/explosion.png)");
    var div2 = $("#explosion2");
    div2.css("top", enemy2Y);
    div2.css("left", enemy2X);
    div2.animate({ width: 200, opacity: 0 }, "slow");

    window.setTimeout(removeExplosion, 1000);

    function removeExplosion() {
      div2.remove();
    }
  }

  function explosion3(allyX, allyY) {
    $("#backgroundGame").append("<div id='explosion3' class='anima4'></div");
    $("#explosion3").css("top", allyY);
    $("#explosion3").css("left", allyX);

    window.setTimeout(removeExplosion, 1000);

    function removeExplosion() {
      $("#explosion3").remove();
    }
  }

  function resetEnemy2Position() {
    window.setTimeout(resetPosition, 5000);

    function resetPosition() {
      if (gameIsOver == false) {
        $("#backgroundGame").append("<div id=enemy2></div");
      }
    }
  }

  function resetAllyPosition() {
    window.setTimeout(resetPosition, 6000);

    function resetPosition() {
      if (gameIsOver == false) {
        $("#backgroundGame").append("<div id='ally' class='anima3'></div>");
      }
    }
  }

  function gameOver() {
    gameIsOver = true;
    music.pause();
    gameOverSound.play();

    window.clearInterval(game.timer);
    game.timer = null;

    $("#player").remove();
    $("#enemy1").remove();
    $("#enemy2").remove();
    $("#ally").remove();

    $("#backgroundGame").append("<div id='end'></div>");

    $("#end").html(
      `<h1> Game Over </h1>
      <p>Your score was: <span>${points}</span></p>
      <div id='restart' onClick="restartGame()">
        <button>Play again</button>
      </div>`
    );
  }
}
