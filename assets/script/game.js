$(document).ready(function () {


    $('#infoscreen').text('Game is switched off');
    $('#levelscreen').text('Level: ...');

    //sounds variables
    var padOneSound = document.getElementById('sound1');
    var padTwoSound = document.getElementById('sound2');
    var padThreeSound = document.getElementById('sound3');
    var padFourSound = document.getElementById('sound4');
    var optionsSound = document.getElementById('optionsSound');
    var switchSound = document.getElementById('switchSound');
    var onoffSound = document.getElementById('onoffSound');
    var errorSound = document.getElementById('errorSound');
    var winSound = document.getElementById('winSound');
    var loseSound = document.getElementById('loseSound');

    //variables used in script
    var cpuPattern = [];
    var currentLevel = 1;
    var usedPattern = [];
    var soundIsOn = true;
    var strictMode = false;
    var timersIds = [];         //store IDs of setTimeout's methods that wiil be used to cancel the execution of setTimeout's
    var numOfLevels = 3;
    var gameplayStarted = false;
    var gameSwitchedOn = false;

    //add random integer to pattern, in range from 1 to 4 inclusive
    function addNumToCpuPattern(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        cpuPattern.push(Math.floor(Math.random() * (max - min + 1)) + min);
    };

    //four functions that animate pads and play sounds
    function animatePadOne() {
        if (soundIsOn == true) {
            $('.padOne').animate({ backgroundColor: 'rgb(236, 229, 170)' }, 200).animate({ backgroundColor: 'rgb(221, 204, 76)' }, 400).css('box-shadow', ' 0px 0px 1px 2px rgb(122, 122, 9)'); padOneSound.currentTime = 0; padOneSound.play(); 
            setTimeout(function () { $('.padOne').css('box-shadow', '0 0 0 0  ') }, 400);
        }
        else {
            $('.padOne').animate({ backgroundColor: 'rgb(236, 229, 170)' }, 200).animate({ backgroundColor: 'rgb(221, 204, 76)' }, 400).css('box-shadow', ' 0px 0px 1px 2px rgb(122, 122, 9)');
            setTimeout(function () { $('.padOne').css('box-shadow', '0 0 0 0  ') }, 400);
        }
    };

    function animatePadTwo() {
        if (soundIsOn == true) {
            $('.padTwo').animate({ backgroundColor: 'rgb(141, 228, 240)' }, 200).animate({ backgroundColor: '#31A9B8' }, 400).css('box-shadow', '0px 0px 1px 2px rgb(81, 20, 138) '); padTwoSound.currentTime = 0; padTwoSound.play(); 
            setTimeout(function () { $('.padTwo').css('box-shadow', ' 0 0 0 0 ') }, 400);
        }
        else {
            $('.padTwo').animate({ backgroundColor: 'rgb(141, 228, 240)' }, 200).animate({ backgroundColor: '#31A9B8' }, 400).css('box-shadow', '0px 0px 1px 2px rgb(81, 20, 138) ');
            setTimeout(function () { $('.padTwo').css('box-shadow', ' 0 0 0 0 ') }, 400);
        }
    };

    function animatePadThree() {
        if (soundIsOn== true) {
            $('.padThree').animate({ backgroundColor: 'rgb(224, 130, 115)' }, 200).animate({ backgroundColor: '#CF3721' }, 400).css('box-shadow', ' 0px 0px 1px 2px rgb(123, 12, 12)'); padThreeSound.currentTime = 0; padThreeSound.play(); 
            setTimeout(function () { $('.padThree').css('box-shadow', ' 0 0 0 0 ') }, 400);
        }
        else {
            $('.padThree').animate({ backgroundColor: 'rgb(224, 130, 115)' }, 200).animate({ backgroundColor: '#CF3721' }, 400).css('box-shadow', ' 0px 0px 1px 2px rgb(123, 12, 12)'); 
            setTimeout(function () { $('.padThree').css('box-shadow', ' 0 0 0 0 ') }, 400);
        }
    };

    function animatePadFour() {
        if (soundIsOn == true) {
            $('.padFour').animate({ backgroundColor: '#74dc8b' }, 200).animate({ backgroundColor: '#258039' }, 400).css('box-shadow', ' 0px 0px 1px 2px rgb(74, 117, 10) '); padFourSound.currentTime = 0; padFourSound.play(); 
            setTimeout(function () { $('.padFour').css('box-shadow', ' 0 0 0 0 ') }, 400);
        }
        else {
            $('.padFour').animate({ backgroundColor: '#74dc8b' }, 200).animate({ backgroundColor: '#258039' }, 400).css('box-shadow', ' 0px 0px 1px 2px rgb(74, 117, 10) ');
            setTimeout(function () { $('.padFour').css('box-shadow', ' 0 0 0 0 ') }, 400);
        }
    };

    //cpu turn
    function cpuTurn() {
        $('#levelscreen').text('Level: ' + currentLevel + ' of '  + numOfLevels);
        $('#infoscreen').text('cpu turn');
        gameplayStarted = true;
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
                if (cpuPattern[ii] == 1) { animatePadOne(); }
                else if (cpuPattern[ii] == 2) { animatePadTwo(); }
                else if (cpuPattern[ii] == 3) { animatePadThree(); }
                else { animatePadFour(); }
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
        $('#infoscreen').text('Player turn');
        usedPattern = cpuPattern.slice(0);
        if (gameplayStarted != false) {
            $('.pad').click(function () {
                let padId = this.id;
                let item = usedPattern.shift();
                if (padId == item) {
                    if (padId == 1) { animatePadOne(); }
                    else if (padId == 2) { animatePadTwo(); }
                    else if (padId == 3) { animatePadThree(); }
                    else if (padId == 4) { animatePadFour(); }
                    if (usedPattern.length <= 0) {
                        if (currentLevel == numOfLevels){
                            $('#infoscreen').text('You Win!');
                            stopGame();
                            setTimeout(function () { openWinModal(); }, 200);
                            setTimeout(function () { winSound.play(); }, 200);
                            $('.pad').unbind();
                            $('#startStopLed').removeClass('led-green');
                            $('#startStopLed').addClass('led-red');
                        }
                        else {
                            currentLevel++;
                            $('.pad').unbind();
                            delay = 0;
                            addNumToCpuPattern(1, 4);
                            timersIds.push(setTimeout(function () { cpuTurn(); }, 2000));
                        }
                     }
                  }
                else {
                    if(strictMode==true){
                        $('#infoscreen').text('Game Over');
                        $('#levelscreen').text('Level: ...');
                        $('.pad').unbind();
                        currentLevel = 1;
                        gameplayStarted = false;
                        loseSound.play();
                        $('#startStopLed').removeClass('led-green');
                        $('#startStopLed').addClass('led-red');
                    }
                    else if(strictMode==false){
                        $('#infoscreen').text('Wrong pad!');
                        errorSound.play();
                        delay = 0;
                        $('.pad').unbind();
                        timersIds.push(setTimeout(function () { cpuTurn(); }, 1200));
                    }
                }
                    
                });    
            }};

    //switch on/off the game
    $('.switch-input').click(function () {
        gameplayStarted = false;
        if (gameSwitchedOn == false) {
            $('#startStopLed').removeClass('led-gray');
            $('#startStopLed').addClass('led-red');
            $('#strictLed').removeClass('led-gray');
            $('#strictLed').addClass('led-red');
            switchOn();
            onoffSound.play();
            intro();
        }
        else if (gameSwitchedOn == true) {
            $('.pad').unbind();
            switchOff();
            onoffSound.play();
            if ($('#startStopLed').hasClass('led-red')) {
                $('#startStopLed').removeClass('led-red');
                $('#startStopLed').addClass('led-gray');
            }
            if ($('#startStopLed').hasClass('led-green')) {
                $('#startStopLed').removeClass('led-green');
                $('#startStopLed').addClass('led-gray');
            }
            if ($('#strictLed').hasClass('led-green')) {
                $('#strictLed').removeClass('led-green');
                $('#strictLed').addClass('led-gray');
            }
            else if ($('#strictLed').hasClass('led-red')) {
                $('#strictLed').removeClass('led-red');
                $('#strictLed').addClass('led-gray');
            }
        }
    });

    //handler for Start/Stop button
    $('#startStop').click(function () {			
        if (gameplayStarted == false && gameSwitchedOn == true) {
            startGame();
            $('#startStopLed').removeClass('led-red');
            $('#startStopLed').addClass('led-green');
        }
        else if (gameplayStarted == true && gameSwitchedOn == true) {
            stopGame();
            $('#infoscreen').text('Press start to play');
            switchSound.play();
            $('#startStopLed').removeClass('led-green');
            $('#startStopLed').addClass('led-red');
        }
    });

    //turn on the game
    function switchOn() {
        $('#levelscreen').text('Level: ...');
        $('#infoscreen').text('Press start to play')
        cpuPattern = [];
        numOfLevels = 10;
        gameSwitchedOn = true;
        $('#level10button').css('background-color', '#0088cc');
    };

    //turn off the game
    function switchOff() {
        stopSetTimeouts();
        cpuPattern = [];
        $('#infoscreen').text('Game is switched off');
        numOfLevels = 10;
        usedPattern = [];
        currentLevel = 1;
        gameSwitchedOn = false;
        gameplayStarted = false;
        strictMode = false;
        sound = true;
        $('#levelscreen').text('Level: ...');
        $('#level10button').css('background-color', 'lightskyblue');
        $('#level5button').css('background-color', 'lightskyblue');
        $('#level15button').css('background-color', 'lightskyblue');
    };

    //start play
    function startGame() {
        switchSound.play();
        cpuPattern = [];
        currentLevel = 1;
        addNumToCpuPattern(1, 4);
        setTimeout(function () { cpuTurn(); }, 300);
    };

    //stop play
    function stopGame() {
        $('.pad').unbind();
        stopSetTimeouts();
        cpuPattern = [];
        currentLevel = 1;
        gameplayStarted = false;
        $('#levelscreen').text('Level: ...');
    };

    //open help details on click
    $(function () {
        var details = $('#helpDetails');
        $('#opener').click(function (e) {
            e.stopPropagation();
            optionsSound.play();
            if (details.is(':hidden')) {
                details.slideDown('slow');
            } else {
                details.slideUp('slow');
            }
        });
        $(document.body).click(function () {
            if (details.not(':hidden')) {
                details.slideUp('slow');
            }
        });
    });

    //open 'About' details on click
    $(function () {
        var details = $('#aboutDetails');
        $('#opener2').click(function (e) {
            e.stopPropagation();
            if (details.is(':hidden')) {
                details.slideDown('slow');
            } else {
                details.slideUp('slow');
            }
        });
        $(document.body).click(function () {
            if (details.not(':hidden')) {
                details.slideUp('slow');
            }
        });
    });

    //switch between light and dark mode
    $(function () {
        $('#opener1').click(function () {
            $('body').toggleClass('dark');
            $('#topNav').toggleClass('navbar-dark');
            optionsSound.play();
            $('#opener1').toggleClass('fa-moon');
            $('footer').toggleClass('footerLightFont');
            $('footer').toggleClass('footerBorderLight');
        });
    });

    //mute/unmute game sounds
    $('#sound').click(function () {
        $('#sound').toggleClass('fa-volume-mute');
        if (soundIsOn==true){
            soundIsOn = false;
            optionsSound.play();
            }
        else if (soundIsOn==false){
            soundIsOn=true;
            optionsSound.play();
            }
          });

    //turn on/off strict mode
    $('#strict').click(function () {
        if (gameSwitchedOn == true && strictMode == false) {
            strictMode = true;
            switchSound.play();
            $('#strictLed').removeClass('led-red');
            $('#strictLed').addClass('led-green');
        }
        else if (gameSwitchedOn == true && strictMode == true) {
            strictMode = false;
            switchSound.play();
            $('#strictLed').removeClass('led-green');
            $('#strictLed').addClass('led-red');
        }
    });

    //choose number of levels
    $('#level5button').click(function () {
        if (gameSwitchedOn == true && gameplayStarted == true) {
            stopGame();
            $('#infoscreen').text('Press start to play');
            numOfLevels = 5;
            $('#level5button').css('background-color', '#0088cc');
            $('#level10button').css('background-color', 'lightskyblue');
            $('#level15button').css('background-color', 'lightskyblue');
            optionsSound.play();
            $('#startStopLed').removeClass('led-green');
            $('#startStopLed').addClass('led-red');
        }
        else if (gameSwitchedOn == true && gameplayStarted == false) {
            numOfLevels = 5;
            $('#level5button').css('background-color', '#0088cc');
            $('#level10button').css('background-color', 'lightskyblue');
            $('#level15button').css('background-color', 'lightskyblue');
            optionsSound.play();
        }
    });

    $('#level10button').click(function () {
        if (gameSwitchedOn == true && gameplayStarted == true) {
            stopGame();
            $('#infoscreen').text('Press start to play');
            numOfLevels = 10;
            $('#level10button').css('background-color', '#0088cc');
            $('#level5button').css('background-color', 'lightskyblue');
            $('#level15button').css('background-color', 'lightskyblue');
            optionsSound.play();
            $('#startStopLed').removeClass('led-green');
            $('#startStopLed').addClass('led-red');
        }
        else if (gameSwitchedOn == true && gameplayStarted == false) {
            numOfLevels = 10;
            $('#level10button').css('background-color', '#0088cc');
            $('#level5button').css('background-color', 'lightskyblue');
            $('#level15button').css('background-color', 'lightskyblue');
            optionsSound.play();
        }
    });

    $('#level15button').click(function () {
        if (gameSwitchedOn == true && gameplayStarted == true) {
            stopGame();
            $('#infoscreen').text('Press start to play');
            numOfLevels = 15;
            $('#level15button').css('background-color', 'b#0088cce');
            $('#level5button').css('background-color', 'lightskyblue');
            $('#level10button').css('background-color', 'lightskyblue');
            optionsSound.play();
            $('#startStopLed').removeClass('led-green');
            $('#startStopLed').addClass('led-red');
        }
        else if (gameSwitchedOn == true && gameplayStarted == false) {
            numOfLevels = 15;
            $('#level15button').css('background-color', '#0088cc');
            $('#level5button').css('background-color', 'lightskyblue');
            $('#level10button').css('background-color', 'lightskyblue');
            optionsSound.play();
        }
    });

    //open 'Win' modal
    var modal = document.getElementById('myModal');     // Get the modal
    openWinModal = function () {
        modal.style.display = 'block';
    }
    modal.onclick = function () {               // When the user clicks on modal, close the modal
        modal.style.display = 'none';
    }
    window.onclick = function (event) {         // When the user clicks anywhere outside of the modal, close it
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    //animates pads when game is being turned on
    function intro() {
        $('.padOne').animate({ backgroundColor: 'rgb(236, 229, 170)' }, 200).animate({ backgroundColor: 'rgb(221, 204, 76)' }, 400).css('box-shadow', ' 0px 0px 1px 2px rgb(122, 122, 9)');
        setTimeout(function () { $('.padOne').css('box-shadow', '0 0 0 0  ') }, 400);
        setTimeout(function () {
            $('.padTwo').animate({ backgroundColor: 'rgb(141, 228, 240)' }, 200).animate({ backgroundColor: '#31A9B8' }, 400).css('box-shadow', '0px 0px 1px 2px rgb(81, 20, 138) ');
            setTimeout(function () { $('.padTwo').css('box-shadow', ' 0 0 0 0 ') }, 400);
        }, 400);
        setTimeout(function () {
            $('.padFour').animate({ backgroundColor: '#74dc8b' }, 200).animate({ backgroundColor: '#258039' }, 400).css('box-shadow', ' 0px 0px 1px 2px rgb(74, 117, 10) ');
            setTimeout(function () { $('.padFour').css('box-shadow', ' 0 0 0 0 ') }, 400);
        }, 800);
        setTimeout(function () {
            $('.padThree').animate({ backgroundColor: 'rgb(224, 130, 115)' }, 200).animate({ backgroundColor: '#CF3721' }, 400).css('box-shadow', ' 0px 0px 1px 2px rgb(123, 12, 12)');
            setTimeout(function () { $('.padThree').css('box-shadow', ' 0 0 0 0 ') }, 400);
        }, 1200); 
    };

    //opens 'hamburger' icon animation
    $('.toggle-button').on('click', function () {
        $('.animated-icon').toggleClass('open');
    });
});