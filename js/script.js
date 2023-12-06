$(document).ready(function () {
  var game = $("#game");
  var imageObj = new Image();
  var numberOfPices = 4;
  var root = Math.sqrt(numberOfPices);
  var slice = [];
  var blankBlock;

  $('.buttons button').click(function () {
    const selectedLevel = parseInt($(this).data('level'));
    $('#levleSelect').hide();
    startGame(selectedLevel);
});

  var mkw = selectedLevel;
  //var mkw = parseInt(getUrlParameter('mkw'));
  // FUNCTAION TO GET PARAMETERS FROM ADDRESS
  function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split("&"),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split("=");

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  }

  function startGame(level) {
  // CHECK FOR VALID MKW
  if (typeof level !== "undefined" && level > 1 && level < 11) {
    numberOfPices = level * level;
    root = Math.sqrt(numberOfPices);

    imageObj.src = "images/demo.jpg";
    imageObj.onload = function () {
      drawBoard();
      shuffleBoard();
      redraw();

      function block(x, y) {
        this.blank = false;
        this.xOrginal = x;
        this.yOrginal = y;
        this.inPlace = true;
        this.xPos = x;
        this.yPos = y;
        this.x = (this.xPos * game.width()) / root;
        this.y = (this.yPos * game.width()) / root;
        this.theCanvas = addNewCanvas(this);
        function addNewCanvas() {
          var elementID = "canvas" + $(".gameCanvas").length;
          this.x = (x * game.width()) / root;
          this.y = (y * game.width()) / root;
          $("<canvas>")
            .attr({
              id: elementID,
              class: "gameCanvas"
            })
            .css({
              left: this.x,
              top: this.y
            })
            .appendTo(game);
          var canvas = document.getElementById(elementID);
          canvas.width = game.width() / root;
          canvas.height = game.width() / root;
          return canvas;
        }
        this.theContext = this.theCanvas.getContext("2d");

        this.pushBlock = function () {
          if (
            ((this.xPos + 1 == blankBlock.xPos || this.xPos - 1 == blankBlock.xPos) && this.yPos == blankBlock.yPos) ||
            ((this.yPos + 1 == blankBlock.yPos || this.yPos - 1 == blankBlock.yPos) && this.xPos == blankBlock.xPos)
          ) {
            // Check if nighbores
            var tempX = this.x;
            var tempY = this.y;
            this.x = blankBlock.x;
            this.y = blankBlock.y;
            blankBlock.x = tempX;
            blankBlock.y = tempY;

            var tempX = this.xPos;
            var tempY = this.yPos;
            this.xPos = blankBlock.xPos;
            this.yPos = blankBlock.yPos;
            blankBlock.xPos = tempX;
            blankBlock.yPos = tempY;

            this.getCanvas().animate({ left: this.x, top: this.y }, 400);
            blankBlock.getCanvas().animate({ left: blankBlock.x, top: blankBlock.y }, 400);

            checkIfInPlace(this);
          }
        };

        this.moveBlockTo = function (x, y) {
          this.x = (x * game.width()) / root;
          this.y = (y * game.width()) / root;
          this.xPos = x;
          this.yPos = y;
          this.getCanvas().css({ left: this.x, top: this.y });
        };

        this.getCanvas = function () {
          return $(this.theCanvas);
        };

        this.setBlank = function () {
          this.blank = true;
        };

        this.getContext = function () {
          return this.theContext;
        };

        this.recalculatePos = function () {
          this.x = (this.xPos * game.width()) / root;
          this.y = (this.yPos * game.width()) / root;
        };

        this.isInPlace = function () {
          checkIfInPlace(this);
        };

        function checkIfInPlace(block) {
          if (block.xPos == block.xOrginal && block.yPos == block.yOrginal) {
            block.inPlace = true;
          } else {
            block.inPlace = false;
          }
          //console.log(block.inPlace);
        }
      }

      /*function printMissing() {
				var string = '';
				for ( var x = 0 ; x < root ; x++ ) {
					for ( var y = 0 ; y < root ; y++ ) {
						if(angles[x*root + y] != 360) {
						string += x*root + y;
						string += ': ';
						string += angles[x*root + y];
						string += '| ';
						}
					}
				}
				console.log(string);
			}*/

      /*function printAngles() {
				var string = '';
				for ( var x = 0 ; x < root ; x++ ) {
					for ( var y = 0 ; y < root ; y++ ) {
						string += angles[x*root + y];
						string += ' ';
					}
				}
				console.log(string);
			}*/

      /*function randomRotate(block) {
				var directions = ['top','right','bottom','left'];
				var rand = Math.floor((Math.random() * 4) + 1);
				return block.rotateBlock(directions[rand]);
			}*/

      function checkForWin() {
        var i = 0;
        var win = true;
        while (win == true && i < slice.length) {
          if (slice[i].inPlace == false) {
            win = false;
          }
          i++;
        }
        if (win) {
          console.log("WIN WIN WIN");
          game.off("click", ".gameCanvas");
          setTimeout(function () {
            InitializeConfetti();
            setTimeout(function () {
              DeactivateConfetti();
            }, 1500);
          }, 800);
        }
      }

      function shuffleBoard() {
        if (root == 2) {
          rotateFourBlocks(0);
        } else {
          var optionalPos = [];
          for (var i = 0; i < numberOfPices - root; i++) {
            if ((i % root) - (root - 2) != 1) {
              optionalPos.push(i);
            }
          }
          //console.log(optionalPos);
          optionalPos = shuffle(optionalPos);
          for (var i = 0; i < root; i++) {
            rotateFourBlocks(optionalPos[i]);
          }
        }
      }

      function rotateFourBlocks(pos) {
        switchBlocks(slice[pos], slice[pos + root + 1]);
        switchBlocks(slice[pos + 1], slice[pos + root]);
      }

      function switchBlocks(n, m) {
        var tempX = n.xPos;
        var tempY = n.yPos;
        n.xPos = m.xPos;
        n.yPos = m.yPos;
        m.xPos = tempX;
        m.yPos = tempY;

        n.moveBlockTo(n.xPos, n.yPos);
        m.moveBlockTo(m.xPos, m.yPos);
      }

      function shuffle(array) {
        var currentIndex = array.length,
          temporaryValue,
          randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      }

      function resizeCanvas() {
        var allCanvases = $(".gameCanvas");
        allCanvases.attr("width", game.width() / root);
        allCanvases.attr("height", game.width() / root);
        redraw();
      }

      function redraw() {
        var sourceX = 0;
        var sourceY = 0;
        var sourceWidth = imageObj.width / root;
        var destWidth = game.width() / root;
        var ctx;

        for (var x = 0; x < numberOfPices; x++) {
          if (x > 0 && x % root == 0) {
            sourceX = 0;
            sourceY += imageObj.height / root;
          }
          slice[x].recalculatePos();
          slice[x].getCanvas().css({ left: slice[x].x, top: slice[x].y });
          ctx = slice[x].getContext();
          if (slice[x].blank == true) {
            ctx.fillRect(sourceX, sourceY, destWidth, destWidth);
          } else {
            ctx.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceWidth, 0, 0, destWidth, destWidth);
            ctx.lineWidth = "2";
            ctx.strokeStyle = "#e0e0e033";
            ctx.strokeRect(0, 0, destWidth, destWidth);
          }
          sourceX += imageObj.width / root;
        }
      }

      function drawBoard() {
        for (var x = 0; x < numberOfPices; x++) {
          slice[x] = new block(x % root, parseInt(x / root));
        }
        slice[numberOfPices - 1].setBlank();
        blankBlock = slice[numberOfPices - 1];
      }

      $(window).on("resize", resizeCanvas);

      game.on("click", ".gameCanvas", function () {
        var clickedElementNumber = $(this).attr("id").replace(/^\D+/g, "");
        slice[clickedElementNumber].pushBlock();
        //printAngles();
        //printMissing();
        checkForWin();
      });
    };

    /*  This is the Confetti code  */

    // globals
    var canvas;
    var ctx;
    var W;
    var H;
    var mp = 150; //max particles
    var particles = [];
    var angle = 0;
    var tiltAngle = 0;
    var confettiActive = true;
    var animationComplete = true;
    var deactivationTimerHandler;
    var reactivationTimerHandler;
    var animationHandler;

    // objects

    var particleColors = {
      colorOptions: [
        "DodgerBlue",
        "OliveDrab",
        "Gold",
        "pink",
        "SlateBlue",
        "lightblue",
        "Violet",
        "PaleGreen",
        "SteelBlue",
        "SandyBrown",
        "Chocolate",
        "Crimson"
      ],
      colorIndex: 0,
      colorIncrementer: 0,
      colorThreshold: 10,
      getColor: function () {
        if (this.colorIncrementer >= 10) {
          this.colorIncrementer = 0;
          this.colorIndex++;
          if (this.colorIndex >= this.colorOptions.length) {
            this.colorIndex = 0;
          }
        }
        this.colorIncrementer++;
        return this.colorOptions[this.colorIndex];
      }
    };

    function confettiParticle(color) {
      this.x = Math.random() * W; // x-coordinate
      this.y = Math.random() * H - H; //y-coordinate
      this.r = RandomFromTo(10, 30); //radius;
      this.d = Math.random() * mp + 10; //density;
      this.color = color;
      this.tilt = Math.floor(Math.random() * 10) - 10;
      this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
      this.tiltAngle = 0;

      this.draw = function () {
        ctx.beginPath();
        ctx.lineWidth = this.r / 2;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x + this.tilt + this.r / 4, this.y);
        ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 4);
        return ctx.stroke();
      };
    }

    $(document).ready(function () {
      SetGlobals();
      //InitializeButton();
      //InitializeConfetti();

      $(window).resize(function () {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
      });
    });

    /*function InitializeButton() {
			$('#stopButton').click(DeactivateConfetti);
			$('#startButton').click(RestartConfetti);
		}*/

    function SetGlobals() {
      canvas = document.getElementById("canvas");
      ctx = canvas.getContext("2d");
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    }

    function InitializeConfetti() {
      particles = [];
      animationComplete = false;
      for (var i = 0; i < mp; i++) {
        var particleColor = particleColors.getColor();
        particles.push(new confettiParticle(particleColor));
      }
      StartConfetti();
    }

    function Draw() {
      ctx.clearRect(0, 0, W, H);
      var results = [];
      for (var i = 0; i < mp; i++) {
        (function (j) {
          results.push(particles[j].draw());
        })(i);
      }
      Update();

      return results;
    }

    function RandomFromTo(from, to) {
      return Math.floor(Math.random() * (to - from + 1) + from);
    }

    function Update() {
      var remainingFlakes = 0;
      var particle;
      angle += 0.01;
      tiltAngle += 0.1;

      for (var i = 0; i < mp; i++) {
        particle = particles[i];
        if (animationComplete) return;

        if (!confettiActive && particle.y < -15) {
          particle.y = H + 100;
          continue;
        }

        stepParticle(particle, i);

        if (particle.y <= H) {
          remainingFlakes++;
        }
        CheckForReposition(particle, i);
      }

      if (remainingFlakes === 0) {
        StopConfetti();
      }
    }

    function CheckForReposition(particle, index) {
      if ((particle.x > W + 20 || particle.x < -20 || particle.y > H) && confettiActive) {
        if (index % 5 > 0 || index % 2 == 0) {
          //66.67% of the flakes
          repositionParticle(particle, Math.random() * W, -10, Math.floor(Math.random() * 10) - 20);
        } else {
          if (Math.sin(angle) > 0) {
            //Enter from the left
            repositionParticle(particle, -20, Math.random() * H, Math.floor(Math.random() * 10) - 20);
          } else {
            //Enter from the right
            repositionParticle(particle, W + 20, Math.random() * H, Math.floor(Math.random() * 10) - 20);
          }
        }
      }
    }
    function stepParticle(particle, particleIndex) {
      particle.tiltAngle += particle.tiltAngleIncremental;
      particle.y += (Math.cos(angle + particle.d) + 3 + particle.r / 2) / 2;
      particle.x += Math.sin(angle);
      particle.tilt = Math.sin(particle.tiltAngle - particleIndex / 3) * 15;
    }

    function repositionParticle(particle, xCoordinate, yCoordinate, tilt) {
      particle.x = xCoordinate;
      particle.y = yCoordinate;
      particle.tilt = tilt;
    }

    function StartConfetti() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      (function animloop() {
        if (animationComplete) return null;
        animationHandler = requestAnimFrame(animloop);
        return Draw();
      })();
    }

    function ClearTimers() {
      clearTimeout(reactivationTimerHandler);
      clearTimeout(animationHandler);
    }

    function DeactivateConfetti() {
      confettiActive = false;
      ClearTimers();
    }

    function StopConfetti() {
      animationComplete = true;
      if (ctx == undefined) return;
      ctx.clearRect(0, 0, W, H);
    }

    function RestartConfetti() {
      ClearTimers();
      StopConfetti();
      reactivationTimerHandler = setTimeout(function () {
        confettiActive = true;
        animationComplete = false;
        InitializeConfetti();
      }, 100);
    }

    window.requestAnimFrame = (function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          return window.setTimeout(callback, 1000 / 60);
        }
      );
    })();
  }
  // WHAT TO SHOW INSTEAD OF GAME IF NO level
  else {
    $("body").html("NO level selected!");
  }
}
});
