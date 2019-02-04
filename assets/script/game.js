$(document).ready(function () {


    $("#infoscreen").text("Game is switched off");
    $("#levelscreen").text("Level: ...");

    //sounds variables
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

    //variables used in script
    var cpuPattern = [];
    var currentLevel = 1;
    var usedPattern = [];
    var sound = true;
    var strictMode = false;
    var timersIds = [];         //store IDs of setTimeout's methods that wiil be used to cancel the execution of setTimeout's
    var numOfLevels = 3;
    var gameStarted = false;
    var switchedOn = false;

    //add random integer to pattern, in range from 1 to 4 inclusive
    function addNumToCpuPattern(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        cpuPattern.push(Math.floor(Math.random() * (max - min + 1)) + min);
    };

    //four functions that animate pads and play sounds
    function b1() {
        if (sound == true) {
            $(".b1").animate({ backgroundColor: 'rgb(236, 229, 170)' }, 200).animate({ backgroundColor: "rgb(221, 204, 76)" }, 400).css("box-shadow", " 0px 0px 1px 2px rgb(122, 122, 9)"); $("#sound1")[0].play();
            setTimeout(function () { $(".b1").css("box-shadow", "0 0 0 0  ") }, 400);
        }
        else {
            $(".b1").animate({ backgroundColor: 'rgb(236, 229, 170)' }, 200).animate({ backgroundColor: "rgb(221, 204, 76)" }, 400).css("box-shadow", " 0px 0px 1px 2px rgb(122, 122, 9)");
            setTimeout(function () { $(".b1").css("box-shadow", "0 0 0 0  ") }, 400);
        }
    };

    function b2() {
        if (sound == true) {
            $(".b2").animate({ backgroundColor: 'rgb(141, 228, 240)' }, 200).animate({ backgroundColor: "#31A9B8" }, 400).css("box-shadow", "0px 0px 1px 2px rgb(81, 20, 138) "); $("#sound2")[0].play();
            setTimeout(function () { $(".b2").css("box-shadow", " 0 0 0 0 ") }, 400);
        }
        else {
            $(".b2").animate({ backgroundColor: 'rgb(141, 228, 240)' }, 200).animate({ backgroundColor: "#31A9B8" }, 400).css("box-shadow", "0px 0px 1px 2px rgb(81, 20, 138) ");
            setTimeout(function () { $(".b2").css("box-shadow", " 0 0 0 0 ") }, 400);
        }
    };

    function b3() {
        if (sound == true) {
            $(".b3").animate({ backgroundColor: 'rgb(224, 130, 115)' }, 200).animate({ backgroundColor: "#CF3721" }, 400).css("box-shadow", " 0px 0px 1px 2px rgb(123, 12, 12)"); $("#sound3")[0].play();
            setTimeout(function () { $(".b3").css("box-shadow", " 0 0 0 0 ") }, 400);
        }
        else {
            $(".b3").animate({ backgroundColor: 'rgb(224, 130, 115)' }, 200).animate({ backgroundColor: "#CF3721" }, 400).css("box-shadow", " 0px 0px 1px 2px rgb(123, 12, 12)");
            setTimeout(function () { $(".b3").css("box-shadow", " 0 0 0 0 ") }, 400);
        }
    };

    function b4() {
        if (sound == true) {
            $(".b4").animate({ backgroundColor: '#74dc8b' }, 200).animate({ backgroundColor: "#258039" }, 400).css("box-shadow", " 0px 0px 1px 2px rgb(74, 117, 10) "); $("#sound4")[0].play();
            setTimeout(function () { $(".b4").css("box-shadow", " 0 0 0 0 ") }, 400);
        }
        else {
            $(".b4").animate({ backgroundColor: '#74dc8b' }, 200).animate({ backgroundColor: "#258039" }, 400).css("box-shadow", " 0px 0px 1px 2px rgb(74, 117, 10) ");
            setTimeout(function () { $(".b4").css("box-shadow", " 0 0 0 0 ") }, 400);
        }
    };

    //cpu turn
    function cpuTurn() {
        $("#levelscreen").text("Level: " + currentLevel + " of " + numOfLevels);
        $("#infoscreen").text("cpu turn");
        gameStarted = true;
        var delay = 1200;
        if (currentLevel < 5) {
            delay = 1200;
        }
        else if (currentLevel >= 5 && currentLevel < 10) {
            delay = 1000;
        }
        else if (currentLevel >= 10) {
            delay = 800;
        }

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

    //function that stops execution of setTimeout's 
    function stopSetTimeouts() {                         
        timersIds.forEach(function (timerId) {
            clearTimeout(timerId);
        });
    };

    //player turn
    function playerTurn() {
        $("#infoscreen").text("Player turn");
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
                            $("#infoscreen").text("You Win!");
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
                        $("#infoscreen").text("Game Over");
                        pattern = [];
                        $("#levelscreen").text("Level: ...");
                        $('.block').unbind();
                        currentLevel = 1;
                        gameStarted = false;
                        $("#loseSound")[0].play();
                        $("#startStopLed").removeClass("led-green");
                        $("#startStopLed").addClass("led-red");
                    }
                    else if(strictMode==false){
                        $("#infoscreen").text("Wrong pad!");
                        $("#errorSound")[0].play();
                        delay = 0;
                        $('.block').unbind();
                        timersIds.push(setTimeout(function () { cpuTurn(); }, 1200));
                    }
                }
                    
                });    
            }};

    //switch on/off the game
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

    //handler for Start/Stop button
    $("#startStop").click(function () {			
        if (gameStarted == false && switchedOn == true) {
            startGame();
            $("#startStopLed").removeClass("led-red");
            $("#startStopLed").addClass("led-green");
        }
        else if (gameStarted == true && switchedOn == true) {
            stopGame();
            $("#infoscreen").text("Press start to play");
            $("#switchSound")[0].play();
            $("#startStopLed").removeClass("led-green");
            $("#startStopLed").addClass("led-red");
        }
    });

    //turn on the game
    function switchOn() {
        $("#levelscreen").text("Level: ...");
        $("#infoscreen").text("Press start to play")
        cpuPattern = [];
        numOfLevels = 10;
        switchedOn = true;
        $("#chk10").css('background-color', '#0088cc');
    };

    //turn off the game
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
        $("#levelscreen").text("Level: ...");
        $("#chk10").css('background-color', 'lightskyblue');
        $("#chk5").css('background-color', 'lightskyblue');
        $("#chk15").css('background-color', 'lightskyblue');
    };

    //start play
    function startGame() {
        $("#switchSound")[0].play();
        cpuPattern = [];
        currentLevel = 1;
        addNumToCpuPattern(1, 4);
        setTimeout(function () { cpuTurn(); }, 300);
    };

    //stop play
    function stopGame() {
        $('.block').unbind();
        stopSetTimeouts();
        cpuPattern = [];
        currentLevel = 1;
        gameStarted = false;
        $("#levelscreen").text("Level: ...");
    };

    //open help details on click
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

    //open 'About' details on click
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

    //switch between light and dark mode
    $(function () {
        $("#opener1").click(function () {
            $("body").toggleClass("dark");
            $("#topNav").toggleClass("navbar-dark");
            $("#optionsSound")[0].play();
            $("#opener1").toggleClass("fa-moon");
            $("footer").toggleClass("footerLightFont");
            $("footer").toggleClass("footerBorderLight");
        });
    });

    //mute/unmute game sounds
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

    //turn on/off strict mode
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

    //choose number of levels
    $("#chk5").click(function () {
        if (switchedOn == true && gameStarted == true) {
            stopGame();
            $("#infoscreen").text("Press start to play");
            numOfLevels = 5;
            $("#chk5").css('background-color', '#0088cc');
            $("#chk10").css('background-color', 'lightskyblue');
            $("#chk15").css('background-color', 'lightskyblue');
            $("#optionsSound")[0].play();
            $("#startStopLed").removeClass("led-green");
            $("#startStopLed").addClass("led-red");
        }
        else if (switchedOn == true && gameStarted == false) {
            numOfLevels = 5;
            $("#chk5").css('background-color', '#0088cc');
            $("#chk10").css('background-color', 'lightskyblue');
            $("#chk15").css('background-color', 'lightskyblue');
            $("#optionsSound")[0].play();
        }
    });

    $("#chk10").click(function () {
        if (switchedOn == true && gameStarted == true) {
            stopGame();
            $("#infoscreen").text("Press start to play");
            numOfLevels = 10;
            $("#chk10").css('background-color', '#0088cc');
            $("#chk5").css('background-color', 'lightskyblue');
            $("#chk15").css('background-color', 'lightskyblue');
            $("#optionsSound")[0].play();
            $("#startStopLed").removeClass("led-green");
            $("#startStopLed").addClass("led-red");
        }
        else if (switchedOn == true && gameStarted == false) {
            numOfLevels = 10;
            $("#chk10").css('background-color', '#0088cc');
            $("#chk5").css('background-color', 'lightskyblue');
            $("#chk15").css('background-color', 'lightskyblue');
            $("#optionsSound")[0].play();
        }
    });

    $("#chk15").click(function () {
        if (switchedOn == true && gameStarted == true) {
            stopGame();
            $("#infoscreen").text("Press start to play");
            numOfLevels = 15;
            $("#chk15").css('background-color', 'b#0088cce');
            $("#chk5").css('background-color', 'lightskyblue');
            $("#chk10").css('background-color', 'lightskyblue');
            $("#optionsSound")[0].play();
            $("#startStopLed").removeClass("led-green");
            $("#startStopLed").addClass("led-red");
        }
        else if (switchedOn == true && gameStarted == false) {
            numOfLevels = 15;
            $("#chk15").css('background-color', '#0088cc');
            $("#chk5").css('background-color', 'lightskyblue');
            $("#chk10").css('background-color', 'lightskyblue');
            $("#optionsSound")[0].play();
        }
    });

    //open 'Win' modal
    var modal = document.getElementById('myModal');     // Get the modal
    openWinModal = function () {
        modal.style.display = "block";
    }
    modal.onclick = function () {               // When the user clicks on modal, close the modal
        modal.style.display = "none";
    }
    window.onclick = function (event) {         // When the user clicks anywhere outside of the modal, close it
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    //animates pads when game is being turned on
    function intro() {
        $(".b1").animate({ backgroundColor: 'rgb(236, 229, 170)' }, 200).animate({ backgroundColor: "rgb(221, 204, 76)" }, 400).css("box-shadow", " 0px 0px 1px 2px rgb(122, 122, 9)");
        setTimeout(function () { $(".b1").css("box-shadow", "0 0 0 0  ") }, 400);
        setTimeout(function () {
            $(".b2").animate({ backgroundColor: 'rgb(141, 228, 240)' }, 200).animate({ backgroundColor: "#31A9B8" }, 400).css("box-shadow", "0px 0px 1px 2px rgb(81, 20, 138) ");
            setTimeout(function () { $(".b2").css("box-shadow", " 0 0 0 0 ") }, 800);
        }, 400);
        setTimeout(function () {
            $(".b4").animate({ backgroundColor: '#74dc8b' }, 200).animate({ backgroundColor: "#258039" }, 400).css("box-shadow", " 0px 0px 1px 2px rgb(74, 117, 10) ");
            setTimeout(function () { $(".b4").css("box-shadow", " 0 0 0 0 ") }, 400);
        }, 800);
        setTimeout(function () {
            $(".b3").animate({ backgroundColor: 'rgb(224, 130, 115)' }, 200).animate({ backgroundColor: "#CF3721" }, 400).css("box-shadow", " 0px 0px 1px 2px rgb(123, 12, 12)");
            setTimeout(function () { $(".b3").css("box-shadow", " 0 0 0 0 ") }, 400);
        }, 1200); 
    };

    //opens 'hamburger' icon animation
    $('.toggle-button').on('click', function () {
        $('.animated-icon').toggleClass('open');
    });
});