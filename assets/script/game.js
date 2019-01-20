$(document).ready(function () {


    $("#infoscreen").text("Game is switched off");
    $("#levelscreen").text("level: ...");


    var sound1 = document.getElementById("sound1");
    var sound2 = document.getElementById("sound2");
    var sound3 = document.getElementById("sound3");
    var sound4 = document.getElementById("sound4");

    var cpuPattern = [];
    var currentLevel = 1;
    var usedPattern = [];
    var sound = true;
    var strictMode = false;
    var timersIds = [];         //store IDs of setTimeout's methods that wiil be used to cancel the execution of setTimeout's
    var numOfLevels = 4;

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
        $("#levelscreen").text("level:" + currentLevel);
        $("#infoscreen").text("cpu turn");
        
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
                            $('.block').unbind();
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
    
                    }
                    else if(strictMode==false){
                        $("#infoscreen").text("Wrong button!");
                        delay = 0;
                        $('.block').unbind();
                        timersIds.push(setTimeout(function () { cpuTurn(); }, 1200));
                    }
                }
                    
                });    
            };

    $("#start").click(function(){
        addNumToCpuPattern(1, 4);
        cpuTurn();
    });


    $("#playerTurn").click(function () {
        playerTurn();
    });

    $("#stop").click(function () {
        stopSetTimeouts();
    });

    $(function () {
        var details = $('#helpDetails');

        $('#opener').click(function (e) {
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
        var details = $('#rulesDetails');

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
            $("#topNav").toggleClass("navbar-dark")
        });
    });

    $("#sound").click(function () {
            if (sound==true){
                sound = false;
            }
            else if(sound==false){
                sound=true;
            }
          });

    $("#strict").click(function () {
        if (strictMode == false) {
            strictMode = true;
        }
        else if (strictMode == true) {
            strictMode = false;
        }
    });


});