$(document).ready(function () {


    $("#infoscreen").text("Game is switched off");
    $("#levelscreen").text("88888888888");


    var sound1 = document.getElementById("sound1");
    var sound2 = document.getElementById("sound2");
    var sound3 = document.getElementById("sound3");
    var sound4 = document.getElementById("sound4");
    var optionsSound = document.getElementById("optionsSound");
    var switchSound = document.getElementById("switchSound");
    var onoffSound = document.getElementById("onoffSound");
    var errorSound = document.getElementById("errorSound");
    var winSound = document.getElementById("winSound");
    var loseSound = document.getElementById("loseSound");

    var cpuPattern = [];
    var currentLevel = 1;
    var usedPattern = [];
    var sound = true;
    var strictMode = false;
    var timersIds = [];         //store IDs of setTimeout's methods that wiil be used to cancel the execution of setTimeout's
    var numOfLevels = 3;
    var gameStarted = false;
    var switchedOn = false;

    //Getting a random integer between two values, inclusive
    function addNumToCpuPattern(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        cpuPattern.push(Math.floor(Math.random() * (max - min + 1)) + min);
    };


    function b1() {
        if (sound == true) {
            $(".b1").animate({ backgroundColor: 'yellow' }, 500).animate({ backgroundColor: "rgb(122, 122, 9)" }, 1000).css("box-shadow", " 0px 0px 1px 2px rgb(122, 122, 9)"); $("#sound1")[0].play();
            setTimeout(function () { $(".b1").css("box-shadow", "0 0 0 0  ") }, 1000);
        }
        else {
            $(".b1").animate({ backgroundColor: 'yellow' }, 500).animate({ backgroundColor: "rgb(122, 122, 9)" }, 1000).css("box-shadow", " 0px 0px 1px 2px rgb(122, 122, 9)");
            setTimeout(function () { $(".b1").css("box-shadow", "0 0 0 0  ") }, 1000);
        }
    };

    function b2() {
        if (sound == true) {
            $(".b2").animate({ backgroundColor: 'rgb(138, 34, 235)' }, 500).animate({ backgroundColor: "rgb(81, 20, 138)" }, 1000).css("box-shadow", "0px 0px 1px 2px rgb(81, 20, 138) "); $("#sound2")[0].play();
            setTimeout(function () { $(".b2").css("box-shadow", " 0 0 0 0 ") }, 1000);
        }
        else {
            $(".b2").animate({ backgroundColor: 'rgb(138, 34, 235)' }, 500).animate({ backgroundColor: "rgb(81, 20, 138)" }, 1000).css("box-shadow", "0px 0px 1px 2px rgb(81, 20, 138) ");
            setTimeout(function () { $(".b2").css("box-shadow", " 0 0 0 0 ") }, 1000);
        }
    };

    function b3() {
        if (sound == true) {
            $(".b3").animate({ backgroundColor: 'red' }, 500).animate({ backgroundColor: "rgb(123, 12, 12)" }, 1000).css("box-shadow", " 0px 0px 1px 2px rgb(123, 12, 12)"); $("#sound3")[0].play();
            setTimeout(function () { $(".b3").css("box-shadow", " 0 0 0 0 ") }, 1000);
        }
        else {
            $(".b3").animate({ backgroundColor: 'red' }, 500).animate({ backgroundColor: "rgb(123, 12, 12)" }, 1000).css("box-shadow", " 0px 0px 1px 2px rgb(123, 12, 12)");
            setTimeout(function () { $(".b3").css("box-shadow", " 0 0 0 0 ") }, 1000);
        }
    };

    function b4() {
        if (sound == true) {
            $(".b4").animate({ backgroundColor: 'green' }, 500).animate({ backgroundColor: "rgb(74, 117, 10)" }, 1000).css("box-shadow", " 0px 0px 1px 2px rgb(74, 117, 10) "); $("#sound4")[0].play();
            setTimeout(function () { $(".b4").css("box-shadow", " 0 0 0 0 ") }, 1000);
        }
        else {
            $(".b4").animate({ backgroundColor: 'green' }, 500).animate({ backgroundColor: "rgb(74, 117, 10)" }, 1000).css("box-shadow", " 0px 0px 1px 2px rgb(74, 117, 10) ");
            setTimeout(function () { $(".b4").css("box-shadow", " 0 0 0 0 ") }, 1000);
        }
    };


    function cpuTurn() {
        $("#levelscreen").text("level: " + currentLevel + " of " + numOfLevels);
        $("#infoscreen").text("cpu turn");
        gameStarted = true;
        var delay = 1200;

        for (let i = 0; i < cpuPattern.length; i++) {
            let ii = i; timersIds.push(setTimeout(function () {
                if (cpuPattern[ii] == 1) { b1(); }
                else if (cpuPattern[ii] == 2) { b2(); }
                else if (cpuPattern[ii] == 3) { b3(); }
                else { b4(); }
            }, ii * delay));
        };
        timersIds.push(setTimeout(function () { playerTurn(); }, delay * (currentLevel)))
    };

    function stopSetTimeouts() {                         //stops execution of setTimeout's 
        timersIds.forEach(function (timerId) {
            clearTimeout(timerId);
        });
    };

    function playerTurn() {
        $("#infoscreen").text("player turn");
        usedPattern = cpuPattern.slice(0);
        if (gameStarted != false) {
            $(".block").click(function () {
                let blockId = this.id;
                let item = usedPattern.shift();
                if (blockId == item) {
                    if (blockId == 1) { b1() }
                    else if (blockId == 2) { b2() }
                    else if (blockId == 3) { b3() }
                    else if (blockId == 4) { b4() }
                    if (usedPattern.length <= 0) {
                        if (currentLevel == numOfLevels){
                            $("#infoscreen").text("you win!");
                            stopGame();
                            setTimeout(function () { openWinModal(); }, 200);
                            setTimeout(function () { $("#winSound")[0].play(); }, 200);
                            $('.block').unbind();
                            $("#startStopLed").removeClass("led-green");
                            $("#startStopLed").addClass("led-red");
                        }
                        else {
                            currentLevel++;
                            $('.block').unbind();
                            delay = 0;
                            addNumToCpuPattern(1, 4);
                            timersIds.push(setTimeout(function () { cpuTurn(); }, 2000));
                        }
                     }
                  }
                else {
                    if(strictMode==true){
                        $("#infoscreen").text("game over");
                        pattern = [];
                        $("#levelscreen").text("level: ...");
                        $('.block').unbind();
                        currentLevel = 1;
                        gameStarted = false;
                        $("#loseSound")[0].play();
                        $("#startStopLed").removeClass("led-green");
                        $("#startStopLed").addClass("led-red");
                    }
                    else if(strictMode==false){
                        $("#infoscreen").text("Wrong button!");
                        $("#errorSound")[0].play();
                        delay = 0;
                        $('.block').unbind();
                        timersIds.push(setTimeout(function () { cpuTurn(); }, 1200));
                    }
                }
                    
                });    
            }};

    $(".switch-input").click(function () {
        gameStarted = false;
        if (switchedOn == false) {
            $("#startStopLed").removeClass("led-gray");
            $("#startStopLed").addClass("led-red");
            $("#strictLed").removeClass("led-gray");
            $("#strictLed").addClass("led-red");
            switchOn();
            $("#onoffSound")[0].play();
            intro();
        }
        else if (switchedOn == true) {
            $('.block').unbind();
            switchOff();
            $("#onoffSound")[0].play();
            if ($("#startStopLed").hasClass("led-red")) {
                $("#startStopLed").removeClass("led-red");
                $("#startStopLed").addClass("led-gray");
            }
            if ($("#startStopLed").hasClass("led-green")) {
                $("#startStopLed").removeClass("led-green");
                $("#startStopLed").addClass("led-gray");
            }
            if ($("#strictLed").hasClass("led-green")) {
                $("#strictLed").removeClass("led-green");
                $("#strictLed").addClass("led-gray");
            }
            else if ($("#strictLed").hasClass("led-red")) {
                $("#strictLed").removeClass("led-red");
                $("#strictLed").addClass("led-gray");
            }
        }
    });

    $("#startStop").click(function () {			//generate new array of random integers
        if (gameStarted == false && switchedOn == true) {
            startGame();
            $("#startStopLed").removeClass("led-red");
            $("#startStopLed").addClass("led-green");
        }
        else if (gameStarted == true && switchedOn == true) {
            stopGame();
            $("#infoscreen").text("Game stopped. Press start to play");
            $("#switchSound")[0].play();
            $("#startStopLed").removeClass("led-green");
            $("#startStopLed").addClass("led-red");
        }
    });

    function switchOn() {
        $("#levelscreen").text("level: ...");
        $("#infoscreen").text("Press start button to play")
        cpuPattern = [];
        numOfLevels = 10;
        switchedOn = true;
        $("#chk10").css('background-color', 'blue');
    };

    function switchOff() {
        stopSetTimeouts();
        cpuPattern = [];
        $("#infoscreen").text("Game is switched off");
        numOfLevels = 10;
        usedPattern = [];
        currentLevel = 1;
        switchedOn = false;
        gameStarted = false;
        strictMode = false;
        sound = true;
        $("#levelscreen").text("8888888888");
        $("#chk10").css('background-color', 'lightskyblue');
        $("#chk5").css('background-color', 'lightskyblue');
        $("#chk15").css('background-color', 'lightskyblue');
    };

    function startGame() {
        $("#switchSound")[0].play();
        cpuPattern = [];
        currentLevel = 1;
        addNumToCpuPattern(1, 4);
        setTimeout(function () { cpuTurn(); }, 300);
    };

    function stopGame() {
        $('.block').unbind();
        stopSetTimeouts();
        cpuPattern = [];
        currentLevel = 1;
        gameStarted = false;
        $("#levelscreen").text("level: ...");
    };


    $(function () {
        var details = $('#helpDetails');

        $('#opener').click(function (e) {
            e.stopPropagation();
            $("#optionsSound")[0].play();
            if (details.is(":hidden")) {
                details.slideDown("slow");
            } else {
                details.slideUp("slow");
            }
        });
        $(document.body).click(function () {
            if (details.not(":hidden")) {
                details.slideUp("slow");
            }
        });
    });

    $(function () {
        var details = $('#aboutDetails');

        $('#opener2').click(function (e) {
            e.stopPropagation();
            if (details.is(":hidden")) {
                details.slideDown("slow");
            } else {
                details.slideUp("slow");
            }
        });
        $(document.body).click(function () {
            if (details.not(":hidden")) {
                details.slideUp("slow");
            }
        });
    });

    $(function () {
        $("#opener1").click(function () {
            $("body").toggleClass("black");
            $("#topNav").toggleClass("navbar-dark");
            $("#optionsSound")[0].play();
            $("#opener1").toggleClass("fa-moon");
        });
    });

    $("#sound").click(function () {
        $("#sound").toggleClass("fa-volume-mute");
            if (sound==true){
                sound = false;
                $("#optionsSound")[0].play();
            }
            else if(sound==false){
                sound=true;
                $("#optionsSound")[0].play();
            }
          });

    $("#strict").click(function () {
        if (switchedOn == true && strictMode == false) {
            strictMode = true;
            $("#switchSound")[0].play();
            $("#strictLed").removeClass("led-red");
            $("#strictLed").addClass("led-green");
        }
        else if (switchedOn == true && strictMode == true) {
            strictMode = false;
            $("#switchSound")[0].play();
            $("#strictLed").removeClass("led-green");
            $("#strictLed").addClass("led-red");
        }
    });


    $("#chk5").click(function () {
        if (switchedOn == true && gameStarted == true) {
            stopGame();
            $("#infoscreen").text("Game stopped. Press start to play");
            numOfLevels = 5;
            $("#chk5").css('background-color', 'blue');
            $("#chk10").css('background-color', 'lightskyblue');
            $("#chk15").css('background-color', 'lightskyblue');
            $("#optionsSound")[0].play();
            $("#startStopLed").removeClass("led-green");
            $("#startStopLed").addClass("led-red");
        }
        else if (switchedOn == true && gameStarted == false) {
            numOfLevels = 5;
            $("#chk5").css('background-color', 'blue');
            $("#chk10").css('background-color', 'lightskyblue');
            $("#chk15").css('background-color', 'lightskyblue');
            $("#optionsSound")[0].play();
        }
    });
    $("#chk10").click(function () {
        if (switchedOn == true && gameStarted == true) {
            stopGame();
            $("#infoscreen").text("Game stopped. Press start to play");
            numOfLevels = 10;
            $("#chk10").css('background-color', 'blue');
            $("#chk5").css('background-color', 'lightskyblue');
            $("#chk15").css('background-color', 'lightskyblue');
            $("#optionsSound")[0].play();
            $("#startStopLed").removeClass("led-green");
            $("#startStopLed").addClass("led-red");
        }
        else if (switchedOn == true && gameStarted == false) {
            numOfLevels = 10;
            $("#chk10").css('background-color', 'blue');
            $("#chk5").css('background-color', 'lightskyblue');
            $("#chk15").css('background-color', 'lightskyblue');
            $("#optionsSound")[0].play();
        }
    });
    $("#chk15").click(function () {
        if (switchedOn == true && gameStarted == true) {
            stopGame();
            $("#infoscreen").text("Game stopped. Press start to play");
            numOfLevels = 15;
            $("#chk15").css('background-color', 'blue');
            $("#chk5").css('background-color', 'lightskyblue');
            $("#chk10").css('background-color', 'lightskyblue');
            $("#optionsSound")[0].play();
            $("#startStopLed").removeClass("led-green");
            $("#startStopLed").addClass("led-red");
        }
        else if (switchedOn == true && gameStarted == false) {
            numOfLevels = 15;
            $("#chk15").css('background-color', 'blue');
            $("#chk5").css('background-color', 'lightskyblue');
            $("#chk10").css('background-color', 'lightskyblue');
            $("#optionsSound")[0].play();
        }
    });


    // Get the modal
    var modal = document.getElementById('myModal');

  

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

   
    openWinModal = function () {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    function intro() {
        $(".b1").animate({ backgroundColor: 'yellow' }, 400).animate({ backgroundColor: "rgb(122, 122, 9)" }, 800).css("box-shadow", " 0px 0px 1px 2px rgb(122, 122, 9)");
        setTimeout(function () { $(".b1").css("box-shadow", "0 0 0 0  ") }, 800);
        setTimeout(function () {
            $(".b2").animate({ backgroundColor: 'rgb(138, 34, 235)' }, 400).animate({ backgroundColor: "rgb(81, 20, 138)" }, 800).css("box-shadow", "0px 0px 1px 2px rgb(81, 20, 138) ");
            setTimeout(function () { $(".b2").css("box-shadow", " 0 0 0 0 ") }, 800);
        }, 400);
        setTimeout(function () {
            $(".b4").animate({ backgroundColor: 'green' }, 400).animate({ backgroundColor: "rgb(74, 117, 10)" }, 1000).css("box-shadow", " 0px 0px 1px 2px rgb(74, 117, 10) ");
            setTimeout(function () { $(".b4").css("box-shadow", " 0 0 0 0 ") }, 800);
        }, 800);
        setTimeout(function () {
            $(".b3").animate({ backgroundColor: 'red' }, 400).animate({ backgroundColor: "rgb(123, 12, 12)" }, 1000).css("box-shadow", " 0px 0px 1px 2px rgb(123, 12, 12)");
            setTimeout(function () { $(".b3").css("box-shadow", " 0 0 0 0 ") }, 800);
        }, 1200); 
    };

    $('.toggle-button').on('click', function () {
        $('.animated-icon').toggleClass('open');
    });
});