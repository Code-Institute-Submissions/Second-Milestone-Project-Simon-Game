$(document).ready(function () {                     //will wait until page is fully loaded


    $('#infoscreen').text('Game is switched off');          //display text on infoscreen on game's console
    $('#levelscreen').text('Level: ...');                   //display text on levelscreen on game's console

    //---------------sounds variables---------------------------
    var padOneSound = document.getElementById('sound1');
    var padTwoSound = document.getElementById('sound2');
    var padThreeSound = document.getElementById('sound3');
    var padFourSound = document.getElementById('sound4');
    var optionsSound = document.getElementById('optionsSound');
    var onoffSound = document.getElementById('onoffSound');
    var errorSound = document.getElementById('errorSound');
    var winSound = document.getElementById('winSound');
    var loseSound = document.getElementById('loseSound');

    //-----------------variables used in script-------------------
    var cpuPattern = [];        //pattern followed by cpu to animate pads
    var currentLevel = 1;       //current level of gameplay
    var usedPattern = [];       //pattern used by playerTurn() function; shallow copy of cpuPattern
    var soundIsOn = true;       //var created to mute/unmute the game
    var strictMode = false;     //var created to apply strict mode
    var timersIds = [];         //store IDs of setTimeout's methods that wiil be used to cancel the execution of setTimeout's
    var numOfLevels = 10;       //number of levels player has to beat
    var gameplayStarted = false;    //var created to check if gameplay started
    var gameSwitchedOn = false;     //var created to check if game is switched on


    //----------------------cpu turn function--------------------------------------
    function cpuTurn() {
        $('#levelscreen').text('Level: ' + currentLevel + ' of '  + numOfLevels);       //display current level
        $('#infoscreen').text('cpu turn');  	                                        //inform player about cpu turn
        gameplayStarted = true;                                    
        var delay = 1200;                   //time between animations of pads
        if (currentLevel < 5) {             
            delay = 1200;
        }
        else if (currentLevel >= 5 && currentLevel < 10) {  //game speeds up at levels 5 and 10
            delay = 1000;
        }
        else if (currentLevel >= 10) {
            delay = 800;
        }

        for (let i = 0; i < cpuPattern.length; i++) {                   //goes through the array
            let ii = i; timersIds.push(setTimeout(function () {         //add setTimeouts' id's to timersIds array
                if (cpuPattern[ii] == 1) { animatePadOne(); }           //calls pads animation for elements in the array
                else if (cpuPattern[ii] == 2) { animatePadTwo(); }
                else if (cpuPattern[ii] == 3) { animatePadThree(); }
                else { animatePadFour(); }
            }, ii * delay));
        };
        timersIds.push(setTimeout(function () { playerTurn(); }, delay * (currentLevel)))       //calls Playerturn() function after all pads from cpuPattern were animated
    };

    //----------------------------player turn function --------------------------------
    function playerTurn() {
        $('#infoscreen').text('Player turn');
        usedPattern = cpuPattern.slice(0);                  //makes copy of cpuPattern
        if (gameplayStarted != false) {                     //check if gameplay started
            $('.pad').click(function () {                   //if user clicks on pad
                let padId = this.id;                        //assigns variable padId to Id of pad clicked by user
                let item = usedPattern.shift();             //takes first element from usedPattern array; assigns it to variable item
                if (padId == item) {                            //compares padId with item
                    if (padId == 1) { animatePadOne(); }        //if they are the same calls animation for clicked pad
                    else if (padId == 2) { animatePadTwo(); }
                    else if (padId == 3) { animatePadThree(); }
                    else if (padId == 4) { animatePadFour(); }
                    if (usedPattern.length <= 0) {              //checks if click are correct until array is empty
                        if (currentLevel == numOfLevels){       //then checks if player has reach chosen level
                            $('#infoscreen').text('You Win!');  //if yes, display text
                            stopGame();                                         //stops game
                            setTimeout(function () { openWinModal(); }, 200);   //shows 'win' modal
                            setTimeout(function () { winSound.play(); }, 200);  //plays 'win' sound
                            $('.pad').unbind();                                 //clicking on pads has no effect
                            $('#startStopLed').removeClass('led-green');        
                            $('#startStopLed').addClass('led-red');             //led light next to 'Start/Stop' buton becomes red
                        }
                        else {                                  //if player hasn't reach chosen level
                            currentLevel++;                     //current level goes up
                            $('.pad').unbind();                 //clicking on pads has no effect
                            addNumToCpuPattern(1, 4);           //increased numbers in cpuPattern by one
                            timersIds.push(setTimeout(function () { cpuTurn(); }, 2000));       //it's time for cpu turn
                        }
                     }
                  }
                else {                                          //if player cilcked wrong pad
                    if(strictMode==true){                           //checks if strict mode is on
                        $('#infoscreen').text('Game Over');         //if yes, display 'game over' info
                        $('#levelscreen').text('Level: ...');
                        $('.pad').unbind();                         //clicking on pads has no effect
                        currentLevel = 1;                           //set current level to 1
                        gameplayStarted = false;                    //set gameplay status to false
                        loseSound.play();                           //plays 'lose' sound
                        $('#startStopLed').removeClass('led-green');
                        $('#startStopLed').addClass('led-red');     //led light next to 'Start/Stop' buton becomes red
                    }
                    else if(strictMode==false){                     //if strict mode is off
                        $('#infoscreen').text('Wrong pad!');        //displays info 'wrong pad'
                        errorSound.play();                          //plays 'error' sound  
                        $('.pad').unbind();                         ////clicking on pads has no effect
                        timersIds.push(setTimeout(function () { cpuTurn(); }, 1200));   //it's time for cpu turn
                    }
                }
                    
                });    
            }};

    //function that adds random integer to pattern, in range from 1 to 4 inclusive
    function addNumToCpuPattern(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        cpuPattern.push(Math.floor(Math.random() * (max - min + 1)) + min);
    };

    //function that stops execution of setTimeout's 
    function stopSetTimeouts() {
        timersIds.forEach(function (timerId) {          //for each elemnt in array
            clearTimeout(timerId);                      //uses clearTimeout method to stop execution of setTimeouts
        });
    };

    //switch on/off the game
    $('.switch-toggle').click(function () {                 //when player clicks switch toggle
        gameplayStarted = false;                            //sets gameplay status to false
        if (gameSwitchedOn == false) {                      //checks if game is switched on  
            $('#startStopLed').removeClass('led-gray');     
            $('#startStopLed').addClass('led-red');         //if no, led light next to the 'Start/Stop' buton becomes red
            $('#strictLed').removeClass('led-gray');
            $('#strictLed').addClass('led-red');            //led light next to the 'Strict' buton becomes red
            switchOn();                                     //switching on the game
            onoffSound.play();                              //plays on-off sound
            intro();                                        //plays game's intro
        }
        else if (gameSwitchedOn == true) {                  //if game is switched on
            $('.pad').unbind();                             //clicking on pads has no effect
            switchOff();                                    //switching off the game
            onoffSound.play();                              //plays on-off sound
            if ($('#startStopLed').hasClass('led-red')) {       
                $('#startStopLed').removeClass('led-red');
                $('#startStopLed').addClass('led-gray');    //set color of led light to gray
            }
            if ($('#startStopLed').hasClass('led-green')) {
                $('#startStopLed').removeClass('led-green');
                $('#startStopLed').addClass('led-gray');    //set color of led light to gray
            }
            if ($('#strictLed').hasClass('led-green')) {
                $('#strictLed').removeClass('led-green');
                $('#strictLed').addClass('led-gray');   //set color of led light to gray
            }
            else if ($('#strictLed').hasClass('led-red')) {
                $('#strictLed').removeClass('led-red');
                $('#strictLed').addClass('led-gray');   //set color of led light to gray
            }
        }
    });

    //actions for Start/Stop button
    $('#startStop').click(function () {			                        //when user clicks 'Start/Stop' button
        if (gameplayStarted == false && gameSwitchedOn == true) {       //checks if game is switched on and gameplay hasn't started yet
            startGame();                                                //then starts the play
            $('#startStopLed').removeClass('led-red');
            $('#startStopLed').addClass('led-green');                   //change led light's color to green
        }
        else if (gameplayStarted == true && gameSwitchedOn == true) {   //if game is switched on and gameplay started already
            stopGame();                                                 //stops the gameplay
            $('#infoscreen').text('Press start to play');
            optionsSound.play();                                         //play sound
            $('#startStopLed').removeClass('led-green');
            $('#startStopLed').addClass('led-red');                     //change led light's color to green
        }
    });

    //turning on the game
    function switchOn() {
        $('#levelscreen').text('Level: ...');
        $('#infoscreen').text('Press start to play')
        cpuPattern = [];                                            //cpuPattern array is empty
        numOfLevels = 10;                                           //default number of levels is set to 10
        gameSwitchedOn = true;                                      //sets var gameSwitchedOn status to true
        $('#level10button').css('background-color', '#0088cc');     //'level 10' button gets darker color that other level buttons
    };

    //turning off the game
    function switchOff() {                          
        stopSetTimeouts();                                              //stop executions of all setTimeouts ID's
        cpuPattern = [];                                                //cpuPattern array is empty
        $('#infoscreen').text('Game is switched off');                  
        usedPattern = [];                                               //usedPattern array is empty
        currentLevel = 1;                                               //current level is set to 1
        gameSwitchedOn = false;                                         //sets var gameSwitchedOn status to false
        gameplayStarted = false;                                        //sets var gameplayStarted status to false
        strictMode = false;                                             //strict mode is off
        sound = true;                                                   //sound in game is turned on
        $('#levelscreen').text('Level: ...');
        $('#level10button').css('background-color', 'lightskyblue');    //all level buttons get the same color
        $('#level5button').css('background-color', 'lightskyblue');
        $('#level15button').css('background-color', 'lightskyblue');
    };

    //start gameplay
    function startGame() {
        optionsSound.play();                             //plays sound
        currentLevel = 1;                               //sets current level to 1
        cpuPattern = [];                                //cpuPattern is empty
        addNumToCpuPattern(1, 4);                       //adds number to cpuPattern
        setTimeout(function () { cpuTurn(); }, 300);    //calls cpu turn
    };

    //stop gameplay
    function stopGame() {
        $('.pad').unbind();                             //clicking on pads has no effect
        stopSetTimeouts();                              //stops executions of setTimeouts
        cpuPattern = [];                                //clears cpuPattern
        currentLevel = 1;                               //sets current level to 1
        gameplayStarted = false;
        $('#levelscreen').text('Level: ...');
    };

    //open help details on click
    $(function () {
        var details = $('#helpDetails');
        $('#infoIcon').click(function (e) {     //when user clicks 'info' icon
            e.stopPropagation();                //this will prevent details from sliding up automatically 
            optionsSound.play();                //plays sound
            if (details.is(':hidden')) {        //if  info is hidden
                details.slideDown('slow');      //slide it down
            } else {
                details.slideUp('slow');        //if is visible, slide it up
            }
        });
        $(document.body).click(function () {    //when user clicks anywhere on the website
            if (details.not(':hidden')) {       //if info is visible
                details.slideUp('slow');        //hide it by sliding up
            }
        });
    });

    //open 'About' details on click
    $(function () {
        var details = $('#aboutDetails');
        $('#aboutLink').click(function (e) {    //when user clicks 'About' link
            e.stopPropagation();                //this will prevent details from sliding up automatically 
            if (details.is(':hidden')) {        //if 'About' info is hidden
                details.slideDown('slow');      //slide it down
            } else {
                details.slideUp('slow');        //if is visible, slide it up
            }
        });
        $(document.body).click(function () {    //when user clicks anywhere on the website
            if (details.not(':hidden')) {       //if info is visible
                details.slideUp('slow');        //hide it by sliding up
            }
        });
    });

    //switch between light and dark mode
    $('#bulbIcon').click(function () {                  //when user clicks 'bulb' icon
            $('body').toggleClass('dark');              //body toggle class 'dark'
            $('#topNav').toggleClass('navbar-dark');    //navbar toggle class 'navbar-dark'
            optionsSound.play();                        //plays sound
            $('#bulbIcon').toggleClass('fa-moon');      //'bulb' icon changes to 'moon' icon
            $('footer').toggleClass('footerLightFont');     //footer's font gets lighter color
            $('footer').toggleClass('footerBorderLight');   //fotters's border gets lighter color
        });


    //mute/unmute game sounds
    $('#soundIcon').click(function () {                     //when user clicks 'sound' icon
        $('#soundIcon').toggleClass('fa-volume-mute');      //icon changes to 'mute' icon
        if (soundIsOn==true){                               //if sound is turned on
            soundIsOn = false;                              //mute
            optionsSound.play();                            //plays sound
            }
        else if (soundIsOn==false){                         //if sound is turned off
            soundIsOn=true;                                 //unmute
            optionsSound.play();                            //plays sound
            }
          });

    //turn on/off strict mode
    $('#strictButton').click(function () {
        if (gameSwitchedOn == true && strictMode == false) {        //if game is turned on and strict mode is off
            strictMode = true;                                      //strict mode is on now
            optionsSound.play();
            $('#strictLed').removeClass('led-red');
            $('#strictLed').addClass('led-green');                  //change led light next to the 'Strict' button to green
        }
        else if (gameSwitchedOn == true && strictMode == true) {    //if game is turned on and strict mode is on
            strictMode = false;                                     //strict mode is off now
            optionsSound.play();
            $('#strictLed').removeClass('led-green');
            $('#strictLed').addClass('led-red');                    //change led light next to the 'Strict' button to red
        }
    });

    //choose number of levels
    $('#level5button').click(function () {                                  //when user clicks 'level 5 button'
        if (gameSwitchedOn == true && gameplayStarted == true) {            //if game is turned on ond gameplay started
            stopGame();                                                     //stops the game
            $('#infoscreen').text('Press start to play');
            numOfLevels = 5;                                                //sets number of levels to 5
            $('#level5button').css('background-color', '#0088cc');          //'level 5 button' gets darker color than other level buttons
            $('#level10button').css('background-color', 'lightskyblue');
            $('#level15button').css('background-color', 'lightskyblue');
            optionsSound.play();
            $('#startStopLed').removeClass('led-green');
            $('#startStopLed').addClass('led-red');                         //'Start/Stop' led light gets color red
        }
        else if (gameSwitchedOn == true && gameplayStarted == false) {      //if game is turned on but gameplay hasn't started yet
            numOfLevels = 5;                                                //sets number of levels to 5
            $('#level5button').css('background-color', '#0088cc');          //'level 5 button' gets darker color than other level buttons
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

    //------------------four functions that animate pads and play sounds-------
    function animatePadOne() {
        if (soundIsOn == true) {        //check if sound is turned on; if yes animate pad and play sound
            $('.padOne').animate({ backgroundColor: 'rgb(236, 229, 170)' }, 200).animate({ backgroundColor: 'rgb(221, 204, 76)' }, 400).css('box-shadow', ' 0px 0px 1px 2px rgb(122, 122, 9)'); padOneSound.currentTime = 0; padOneSound.play();
            setTimeout(function () { $('.padOne').css('box-shadow', '0 0 0 0  ') }, 400);
        }
        else {                          //else animate pad only
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
        if (soundIsOn == true) {
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
        $('.hamburger-icon').toggleClass('open');
    });
});