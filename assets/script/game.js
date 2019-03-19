$(document).ready(function () {                     //will wait until page is fully loaded

    //---------------sounds variables---------------------------
    const padOneSound = document.getElementById('sound1');
    const padTwoSound = document.getElementById('sound2');
    const padThreeSound = document.getElementById('sound3');
    const padFourSound = document.getElementById('sound4');
    const optionsSound = document.getElementById('optionsSound');
    const onoffSound = document.getElementById('onoffSound');
    const errorSound = document.getElementById('errorSound');
    const winSound = document.getElementById('winSound');
    const loseSound = document.getElementById('loseSound');

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
    const infoscreen = $('#infoscreen');    //place to display info during the game
    const levelscreen = $('#levelscreen');  //place to display current level of the game
    const listOfPadsSounds = [padOneSound, padTwoSound, padThreeSound, padFourSound];   //list of pads' sounds
    
    infoscreen.text('Game is switched off');          //display text on infoscreen on game's console
    levelscreen.text('Level: ...');                   //display text on levelscreen on game's console
    
    //----------------------cpu turn function--------------------------------------
    function cpuTurn() {
        levelscreen.text(`Level: ${currentLevel} of ${numOfLevels}`);           //display current level
        infoscreen.text('cpu turn');  	                                        //inform player about cpu turn
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
                padsAreAnimated(cpuPattern[ii])                         //calls pads animation for elements in the array
            }, ii * delay));                                            //delay is multiplied by position of the element in the array
        };
        timersIds.push(setTimeout(function () { playerTurn(); }, delay * (currentLevel)))  //calls Playerturn() function after all pads from cpuPattern have been animated
    };

    //----------------------------player turn function --------------------------------
    function playerTurn() {
        infoscreen.text('Player turn');
        usedPattern = cpuPattern.slice(0);                  //makes copy of cpuPattern
        $('.pad').click(function () {                       //if user clicks on pad
                let padId = this.id;                        //assigns variable padId to Id of pad clicked by user
                let item = usedPattern.shift();             //takes first element from usedPattern array; assigns it to variable item
                if (padId == item) {                        //compares padId with item
                    padsAreAnimated(item);                  //if they are the same calls animation for clicked pad
                   
                  }
                else {                                          //if player cilcked wrong pad
                    wrongPadClicked();                          //calls function that deals with wrong pad being clicked
                };

            if (!usedPattern.length && currentLevel == numOfLevels) {   //checks if click are correct until array is empty; checks if player has reach chosen level
                infoscreen.text('You Win!');                            //if yes, display text
                stopGame();                                             //stops game
                setTimeout(function () { openWinModal(); winSound.play(); }, 200);   //shows 'win' modal and plays 'win' sound
                $('.pad').unbind();                                     //clicking on pads has no effect
                changeLedColor('#startStopLed', 'ledGreen', 'ledRed');  //led light next to 'Start/Stop' buton becomes red
            }
            else if (!usedPattern.length && currentLevel != numOfLevels) { //if player hasn't reach chosen level yet
                currentLevel++;                                         //current level goes up
                $('.pad').unbind();                                     //clicking on pads has no effect
                addNumToCpuPattern(1, 4);                               //increased numbers in cpuPattern by one
                timersIds.push(setTimeout(function () { cpuTurn(); }, 2000));   //it's time for cpu turn
            } 
                });    
            };
    
    //function that deals with wrong pad being clicked
    function wrongPadClicked(){
        $('.pad').unbind();                                 //clicking on pads has no effect
        if (strictMode) {                                   //checks if strict mode is on
            infoscreen.text('Game Over');                   //if yes, display 'game over' info
            levelscreen.text('Level: ...');
            currentLevel = 1;                               //set current level to 1
            gameplayStarted = false;                        //set gameplay status to false
            loseSound.play();                               //plays 'lose' sound
            changeLedColor('#startStopLed', 'ledGreen', 'ledRed'); //led light next to 'Start/Stop' buton becomes red
        }
        else if (!strictMode) {                             //if strict mode is off
            infoscreen.text('Wrong pad!');                  //displays info 'wrong pad'
            errorSound.play();                              //plays 'error' sound  
            timersIds.push(setTimeout(function () { cpuTurn(); }, 1200));   //it's time for cpu turn
        }
    }

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
    $('#toggleButton').click(function () {                 //when player clicks switch toggle
        gameplayStarted = false;                            //sets gameplay status to false
        if (!gameSwitchedOn) {                              //checks if game is switched on  
            changeLedColor('#startStopLed', 'ledGrey', 'ledRed'); //if no, led light next to the 'Start/Stop' buton becomes red
            changeLedColor('#strictLed', 'ledGrey', 'ledRed'); //led light next to the 'Strict' buton becomes red
            switchOn();                                     //switching on the game
            onoffSound.play();                              //plays on-off sound
            intro();                                        //plays game's intro
        }
        else if (gameSwitchedOn) {                          //if game is switched on
            $('.pad').unbind();                             //clicking on pads has no effect
            switchOff();                                    //switching off the game
            onoffSound.play();                              //plays on-off sound
            if ($('#startStopLed').hasClass('ledRed')) {       
                changeLedColor('#startStopLed', 'ledRed', 'ledGrey'); //set color of led light to gray
            }
            if ($('#startStopLed').hasClass('ledGreen')) {
                changeLedColor('#startStopLed', 'ledGreen', 'ledGrey'); //set color of led light to gray
            }
            if ($('#strictLed').hasClass('ledGreen')) {
                changeLedColor('#strictLed', 'ledGreen', 'ledGrey'); //set color of led light to gray
            }
            if ($('#strictLed').hasClass('ledRed')) {
                changeLedColor('#strictLed', 'ledRed', 'ledGrey'); //set color of led light to gray
            }
        }
    });

    //function that changes color of led
    function changeLedColor(ledID, ledColor1, ledColor2){
        $(ledID).removeClass(ledColor1).addClass(ledColor2)
    }

    //actions for Start/Stop button
    $('#startStop').click(function () {			                        //when user clicks 'Start/Stop' button
        if (!gameplayStarted && gameSwitchedOn) {                       //checks if game is switched on and gameplay hasn't started yet
            startGame();                                                //then starts the play
            changeLedColor('#startStopLed', 'ledRed', 'ledGreen');      //change led light's color to green
        }
        else if (gameplayStarted && gameSwitchedOn) {                   //if game is switched on and gameplay started already
            stopGame();                                                 //stops the gameplay
            infoscreen.text('Press start to play');
            optionsSound.play();                                         //play sound
            changeLedColor('#startStopLed', 'ledGreen', 'ledRed');       //change led light's color to green
        }
    });

    //turning on the game
    function switchOn() {
        levelscreen.text('Level: ...');
        infoscreen.text('Press start to play')
        cpuPattern = [];                                            //cpuPattern array is empty
        numOfLevels = 10;                                           //default number of levels is set to 10
        gameSwitchedOn = true;                                      //sets var gameSwitchedOn status to true
        $('#level10button').css('background-color', '#0088cc');     //'level 10' button gets darker color that other level buttons
    };

    //turning off the game
    function switchOff() {
        stopGame();                          
        infoscreen.text('Game is switched off');                 
        usedPattern = [];                                               //usedPattern array is empty
        gameSwitchedOn = false;                                         //sets var gameSwitchedOn status to false
        strictMode = false;                                             //strict mode is off
        $('.levelButton').css('background-color', 'lightskyblue');    //all level buttons get the same color
    };

    //start gameplay
    function startGame() {
        optionsSound.play();                            //plays sound
        currentLevel = 1;                               //sets current level to 1
        cpuPattern = [];                                //cpuPattern is empty
        addNumToCpuPattern(1, 4);                       //adds number to cpuPattern
        setTimeout(function () { cpuTurn(); }, 300);    //calls cpu turn
        listOfPadsSounds.forEach(function (element) {
            element.muted = false;
        });
    };

    //stop gameplay
    function stopGame() {
        $('.pad').unbind();                             //clicking on pads has no effect
        stopSetTimeouts();                              //stops executions of setTimeouts
        cpuPattern = [];                                //clears cpuPattern
        currentLevel = 1;                               //sets current level to 1
        gameplayStarted = false;
        levelscreen.text('Level: ...');
    };

    //function that show and hide modals
    function showDetails(details){
            optionsSound.play();                     //plays sound
            if (details.is(':hidden')) {             //if  info is hidden
                details.slideDown('slow');           //slide it down
            } else {
                details.slideUp('slow');             //if is visible, slide it up
            }
            $(document.body).click(function () {     //when user clicks anywhere on the website
                if (details.not(':hidden')) {        //if info is visible
                    details.slideUp('slow');         //hide it by sliding up
                }
            });
    };

    //open help details on click
    var helpDetails = $('#helpDetails');
    $('#helpIcon').click(function (e) {             //when user clicks 'info' icon
            e.stopPropagation();                    //this will prevent details from sliding up automatically 
            showDetails(helpDetails);
    });

    //open 'About' details on click
    var aboutDetails = $('#aboutDetails');
    $('#aboutLink').click(function (e) {            //when user clicks 'About' link
            e.stopPropagation();                    //this will prevent details from sliding up automatically 
            showDetails(aboutDetails);
        });
    
    //switch between light and dark mode
    $('#bulbIcon').click(function () {                  //when user clicks 'bulb' icon
            $('body').toggleClass('background-dark');   //body toggle class 'dark'
            $('#topNav').toggleClass('navbar-dark');    //navbar toggle class 'navbar-dark'
            $('#bulbIcon').toggleClass('fa-moon');      //'bulb' icon changes to 'moon' icon
            $('footer').toggleClass('footerLightFont').toggleClass('footerBorderLight');   //footers's border and font get lighter color
            optionsSound.play();                        //plays sound
            });


    //mute/unmute game sounds
    $('#soundIcon').click(function () {                     //when user clicks 'sound' icon
                                                            //icon changes to 'mute' icon
        if (soundIsOn){                                     //if sound is turned on
            soundIsOn = false;                              //mute
            optionsSound.play();                            //plays sound
            $('#soundIcon').removeClass('fa-lightbulb').addClass('fa-volume-mute');
            }
        else {                                              //if sound is turned off
            soundIsOn=true;                                 //unmute
            optionsSound.play();                            //plays sound
            $('#soundIcon').removeClass('fa-volume-mute').addClass('fa-lightbulb');
            }
          });

    //turn on/off strict mode
    $('#strictButton').click(function () {
        if (gameSwitchedOn && !strictMode) {                     //if game is turned on and strict mode is off
            strictMode = true;                                   //strict mode is on now
            optionsSound.play();
            changeLedColor('#strictLed', 'ledRed', 'ledGreen');  //change led light next to the 'Strict' button to green
        }
        else if (gameSwitchedOn && strictMode) {                 //if game is turned on and strict mode is on
            strictMode = false;                                  //strict mode is off now
            optionsSound.play();
            changeLedColor('#strictLed', 'ledGreen', 'ledRed');  //change led light next to the 'Strict' button to red
        }
    });

    //-----------------------choose number of levels------------------------------------------------------------------
    function levelHiglight(chosenLevelNumber, level1ID, level2ID, level3ID) {
        if (gameSwitchedOn && gameplayStarted) {                                    //if game is turned on ond gameplay started
            stopGame();                                                             //stops the game
            infoscreen.text('Press start to play');
            numOfLevels = chosenLevelNumber;                                        //sets number of levels to chosen number
            $(level1ID).css('background-color', 'b#0088cce');                       //chosen 'level button' gets darker color than other level buttons
            $(level2ID).css('background-color', 'lightskyblue');
            $(level3ID).css('background-color', 'lightskyblue');
            optionsSound.play();
            changeLedColor('#startStopLed', 'ledGreen', 'ledRed');                  //'Start/Stop' led light gets color red
        }
        else if (gameSwitchedOn && !gameplayStarted) {                              //if game is turned on but gameplay hasn't started yet
            numOfLevels = chosenLevelNumber;                                        //sets number of levels to chosen number
            $(level1ID).css('background-color', 'b#0088cce');                       //chosen 'level button' gets darker color than other level buttons
            $(level2ID).css('background-color', 'lightskyblue');
            $(level3ID).css('background-color', 'lightskyblue');
            optionsSound.play();
        }
    };

    $('#level5button').click(function () {                                      //when user clicks 'level 5 button'
        levelHiglight(5, '#level5button', '#level10button', '#level15button')
    });

    $('#level10button').click(function () {                                     //when user clicks 'level 10 button'
        levelHiglight(10, '#level10button', '#level5button', '#level15button')
    });

    $('#level15button').click(function () {                                     //when user clicks 'level 15 button'
        levelHiglight(15, '#level15button', '#level5button', '#level10button')
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

    //------------general function that animates pad and play sounds----------
    function animatePad(padNumber, background1, background2, boxShadow, sound){
        if (soundIsOn) {  //check if sound is turned on; if yes animate pad and play sound
            $(padNumber).animate({ backgroundColor: background1 }, 200).animate({ backgroundColor: background2 }, 400).css('box-shadow', `0px 0px 1px 2px ${boxShadow}`); sound.currentTime = 0; sound.play();
            setTimeout(function () { $(padNumber).css('box-shadow', ' 0 0 0 0 ') }, 400);
        }
        else {             //else animate pad only
            $(padNumber).animate({ backgroundColor: background1 }, 200).animate({ backgroundColor: background2 }, 400).css('box-shadow', `0px 0px 1px 2px ${boxShadow}`);
            setTimeout(function () { $(padNumber).css('box-shadow', ' 0 0 0 0 ') }, 400);
        }
    };
    //------------------four functions that animate pads and play sounds-------
    function animatePadOne(){
        animatePad('.padOne', '#ece5aa', '#ddcc4c', '#4a750a', padOneSound);
    }

    function animatePadTwo(){
        animatePad('.padTwo', '#8de4f0', '#31A9B8', '#51148a', padTwoSound)
    }

    function animatePadThree(){
        animatePad('.padThree', '#e08273', '#CF3721', '#7b0c0c', padThreeSound)
    }

    function animatePadFour(){
        animatePad('.padFour', '#74dc8b', '#258039', '#4a750a', padFourSound)
    }

    //function that compares pattern's element with pad's id;
    //if they are the same specific animatePad function is called for specific element
    function padsAreAnimated(patternElement) {
        switch (patternElement.toString()) {                //convert number from array to string
            case '1':
                animatePadOne();                            //calls pads animation for elements in the array
                break;
            case '2':
                animatePadTwo();
                break;
            case '3':
                animatePadThree();
                break;
            default:
                animatePadFour();
        }
    };

    //animates pads when game is being turned on
    function intro() {
        animatePadOne();
        setTimeout(function () {animatePadTwo()}, 400);
        setTimeout(function () {animatePadFour()}, 800);
        setTimeout(function () {animatePadThree()}, 1200); 
        listOfPadsSounds.forEach(function(element){
            element.muted = true;                           //sounds for pads are muted in intro
        })
    };

    //change 'hamburger' icon color on click
    $('.navbar-toggler').on('click', function () {
        $('.navbar-toggler').toggleClass('greenBackgroundColor');
    });
});