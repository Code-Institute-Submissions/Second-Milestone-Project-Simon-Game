$(document).ready(function () {


    $("#infoscreen").text("Game is switched off");
    $("#levelscreen").text("level: ...");


    var sound1 = document.getElementById("sound1");
    var sound2 = document.getElementById("sound2");
    var sound3 = document.getElementById("sound3");
    var sound4 = document.getElementById("sound4");

    var cpuPattern = [1,2,3,4];
    var currentLevel = 1;
    var usedPattern = [];
    var sound = true;

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
            (setTimeout(function () {
                if (cpuPattern[i] == 1) { b1(); }
                else if (cpuPattern[i] == 2) { b2(); }
                else if (cpuPattern[i] == 3) { b3(); }
                else { b4(); }
            }, i * delay));
        };

        
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
                       
                            $("#infoscreen").text("you win!");
                            
                        }
                }
                else {
                    
                        $("#infoscreen").text("game over");
                       
                    }
                });    
            }

    $("#start").click(function(){
        cpuTurn();
    });


    $("#playerTurn").click(function () {
        playerTurn();
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



});