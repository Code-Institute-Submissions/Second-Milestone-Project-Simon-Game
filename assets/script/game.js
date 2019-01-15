$(document).ready(function () {

    var sound1 = document.getElementById("sound1");
    var sound2 = document.getElementById("sound2");
    var sound3 = document.getElementById("sound3");
    var sound4 = document.getElementById("sound4");

    var cpuPattern = [1,2,3,4];

    //Getting a random integer between two values, inclusive
    function addNumToCpuPattern(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        cpuPattern.push(Math.floor(Math.random() * (max - min + 1)) + min);
    };



    function b1() {
        $(".b1").animate({ backgroundColor: 'yellow' }, 500).animate({ backgroundColor: "rgb(122, 122, 9)" }, 1000).css("box-shadow", " 0px 0px 1px 2px rgb(122, 122, 9)"); $("#sound1")[0].play();
        setTimeout(function () { $(".b1").css("box-shadow", "0 0 0 0  ") }, 1000);
    };

    function b2() {
        $(".b2").animate({ backgroundColor: 'rgb(138, 34, 235)' }, 500).animate({ backgroundColor: "rgb(81, 20, 138)" }, 1000).css("box-shadow", "0px 0px 1px 2px rgb(81, 20, 138) "); $("#sound2")[0].play();
        setTimeout(function () { $(".b2").css("box-shadow", " 0 0 0 0 ") }, 1000);
    };

    function b3() {
        $(".b3").animate({ backgroundColor: 'red' }, 500).animate({ backgroundColor: "rgb(123, 12, 12)" }, 1000).css("box-shadow", " 0px 0px 1px 2px rgb(123, 12, 12)"); $("#sound3")[0].play();
        setTimeout(function () { $(".b3").css("box-shadow", " 0 0 0 0 ") }, 1000);
    };

    function b4() {
        $(".b4").animate({ backgroundColor: 'green' }, 500).animate({ backgroundColor: "rgb(74, 117, 10)" }, 1000).css("box-shadow", " 0px 0px 1px 2px rgb(74, 117, 10) "); $("#sound4")[0].play();
        setTimeout(function () { $(".b4").css("box-shadow", " 0 0 0 0 ") }, 1000);
    };


    $("#start").click(function(){
        for (i=0; i < cpuPattern.length;i++){
            if (cpuPattern[i]==1){b1()}
            else if (cpuPattern[i]==2){b2()}
            else if (cpuPattern[i]==3){b3()}
            else if (cpuPattern[i]==4){b4()}
        }
    })


});