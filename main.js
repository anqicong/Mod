var main = function(ex) {

    ex.data.meta = {
        "author": "Team 6",
        "email": "acong@andrew.cmu.edu",
        "title": "Mod",
        "description": "Mod",
        "id": "acong",
        "language": "",
        "difficulty": "medium",
        "mainFile": "main.js",
        "instrFile": "instr.html",
        "constructorName": "main",
        "menuDisplayName": "Mod",
        "mode": "practice",
        "requires": {
        }
    };

    /*****************************************************************
     * Utility functions
     ****************************************************************/

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRange(min, max){
        var a = [];
        for (var i = min; i < max; i++){
            a.push(i);
        }
        return a;
    }

    function listToString2D(list) {
        var result = "[";
        for (var i = 0; i < list.length; i++) {
            result += "[";
            for (var j = 0; j < list[i].length; j++) {
                if (j == list.length - 1) {
                    result += list[i][j].toString();
                }else {
                    result += list[i][j].toString() + ", ";
                }
            }
            result += "]";
            if (i != list.length - 1) {
                result += ", ";
            }
        }
        result += "]";
        return result;
    }

    function listToString1D(list){
        return "[" + list.join(", ") + "]";
    }

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    /*****************************************************************
     * Flow
     ****************************************************************/

    function Flow(){
        var flow = {};
        flow.numQuestions = 2;
        flow.currQuestionNum = 0;
        flow.questions = [];

        flow.init = function(){
            // create questions
            for (var i = 0; i < flow.numQuestions; i++){
                flow.questions.push(Question(i));
            }
            // init current
            flow.getCurrentQuestion().init();
            // draw!
            flow.draw();
        };

        flow.draw = function(){
            // draw current question
            flow.getCurrentQuestion().draw();
        };

        flow.getCurrentQuestion = function(){
            return flow.questions[flow.currQuestionNum];
        }

        return flow;
    }

    /*****************************************************************
     * NumberLine
     ****************************************************************/

    function check(i){ 
        return function(){
            if (i == numberLine.curPoint - numberLine.y) {
                numberLine.curPoint = numberLine.curPoint - numberLine.y;
                return true;
            }
            else return false;
        } 
    };

    function NumberLine(){
        var numberLine = {};
        numberLine.x = undefined;
        numberLine.y = undefined;
        numberLine.curPoint = undefined;
        numberLine.showTargetRange = false;
        numberLine.minNum = -10;
        numberLine.maxNum = 10;
        numberLine.numButtonList = [];

        // l is number line, p is points on line, a is arrows at either end
        var l = {x1 : 6, y1 : 90, x2 : ex.width() - 6, y2 : 90};
        var offset = (l.x2 - l.x1) / 22;
        var p = {r : 5, x : l.x1 + offset, y : l.y1};
        p.offset = offset;
        var size = 10;
        var a = {x1 : l.x1, y1 : l.y1, x2 : l.x1 + size, y2 : l.y1 - size};
        a.size = size;

        numberLine.draw = function(){
            function drawLine() { 
                ex.graphics.ctx.moveTo(l.x1, l.y1);
                ex.graphics.ctx.lineTo(l.x2, l.y2);
                ex.graphics.ctx.stroke();
            }

            function drawPoints() {
                for (var i = 0; i < 21; i++) {
                    ex.graphics.ctx.fillStyle = "#000000";
                    ex.graphics.ctx.beginPath();
                    ex.graphics.ctx.arc(p.x + i * p.offset, p.y, p.r, 0, 2 * Math.PI);                    
                    ex.graphics.ctx.closePath();
                    ex.graphics.ctx.fill();
                    ex.graphics.ctx.stroke();
                }
            }

            function drawArrows() {              
                for (var i = 0; i < 4; i++) {                
                    ex.graphics.ctx.moveTo(a.x1, a.y1);
                    ex.graphics.ctx.lineTo(a.x2, a.y2);
                    ex.graphics.ctx.stroke();
                    if (i % 2 == 1) a.y2 -= a.size * 2;
                    else a.y2 += a.size * 2;
                    if (i == 1) {
                        a.x1 = l.x2;
                        a.x2 = a.x1 - a.size;
                    }
                }
            }

            function drawNumbers() {
                for (var i = numberLine.minNum; i < numberLine.maxNum + 1; i++) {
                    numberLine.numButtonList.push(ex.createButton(
                    p.x + p.offset * (i + numberLine.maxNum) - 14, p.y + 10, i.toString(), {
                    color: "blue", size: "small" }).on("click", check(i)))
                }
            }

            drawLine();
            drawPoints();
            drawArrows();
            drawNumbers();

        };

        numberLine.setX = function(x){
            numberLine.x = x;
        };

        numberLine.setY = function(y){
            numberLine.y = y;
        };

        numberLine.setCurPoint = function(newCurPoint){
            numberLine.curPoint = newCurPoint;
        };

        numberLine.drawArrow = function(from, to){
            height = 20
            ctx.beginPath();
            ctx.moveTo(from);
            ctx.quadraticCurveTo((from.x + to.x)/2, from.y + 20, to.x, to.y);
            ctx.stroke();
            //todo
        };

        numberLine.setTargetRange = function(on){
            numberLine.showTargetRange = on;
        };

        return numberLine;
    }

    var a = NumberLine();
    a.draw();

    /*****************************************************************
     * Question
     ****************************************************************/

    function Question(questionNum){
        var question = {};
        question.questionNum = questionNum;
        question.x = undefined;
        question.y = undefined;
        question.numberLine = undefined;
        question.subquestions = [];
        question.currSubquestion = 0;

        question.init = function(){
            // generate x and y
            switch (question.questionNum){
                case 0: // both numbers are positive
                    question.y = getRandomInt(1, 8);
                    question.x = getRandomInt(question.y + 1, 10);
                    break;
                case 1: // one number is positive and one is negative
                    // randomly pick either x or y to be negative
                    var xIsNegative = Math.random();
                    if (xIsNegative < .5){
                        question.x = 0 - getRandomInt(1, 10);
                        question.y = getRandomInt(1, 10);
                    }
                    else{
                        question.x = getRandomInt(1, 10);
                        question.y = 0 - getRandomInt(1, 10);
                    }
                    break;
                default:
                    break;
            }
            // create numberline
            question.numberLine = NumberLine();
            question.numberLine.setX(question.x);
            question.numberLine.setY(question.y);
            question.numberLine.setCurPoint(question.x);

            // create subquestions
            // initial question
            var initialQuestion = SubQuestion("initial");
            initialQuestion.y = question.y;
            question.subquestions.push(initialQuestion);
            // jump question
            var jumpQuestion = SubQuestion("jump");
            jumpQuestion.x = question.x;
            jumpQuestion.y = question.y;
            jumpQuestion.answer = question.x - question.y;
            question.subquestions.push(jumpQuestion);
            // reached question
            var reachedQuestion = SubQuestion("reached");
            reachedQuestion.x = question.x;
            reachedQuestion.y = question.y;
            reachedQuestion.answer = true;
            question.subquestions.push(reachedQuestion);

            // init current question
            question.getCurrentSubquestion().init();

            console.log(question.x);
            console.log(question.y);
            console.log(question.subquestions);
        };

        question.draw = function(){
            question.getCurrentSubquestion().draw();
        };

        question.getCurrentSubquestion = function(){
            return question.subquestions[question.currSubquestion];
        };

        return question;
    }

    /*****************************************************************
     * Subquestion
     ****************************************************************/

    function SubQuestion(type){ // types can be: inital, jump, reached
        var subquestion = {};
        subquestion.type = type;
        subquestion.x = undefined;
        subquestion.y = undefined;
        subquestion.answer = undefined;
        subquestion.textLines = [];
        subquestion.possibleAnswersDropDown = undefined;

        subquestion.init = function(){
            //subquestion.nextButton = ex.createButton(ex.width(), ex.height(), "next", function(){alert("stuff")});
            switch (subquestion.type){
                case ("initial"):
                    subquestion.textLines.push("Let's calculate x % " + subquestion.y.toString());
                    subquestion.textLines.push("What are the possible answers?");
                    var dropdownX = 440;
                    var dropdownY = 285;
                    // create options for the dropdown as strings
                    var options = [];
                    if (subquestion.y > 0){
                        options.push(listToString1D(getRange(0, subquestion.y))); // correct answer
                        options.push(listToString1D(getRange(0, subquestion.y + 1)));
                        options.push(listToString1D(getRange(-subquestion.y, 1)));
                        options.push(listToString1D(getRange(-subquestion.y + 1, 1)));
                    }
                    else{
                        options.push(listToString1D(getRange(subquestion.y + 1, 1))); // correct answer
                        options.push(listToString1D(getRange(subquestion.y, 1)));
                        options.push(listToString1D(getRange(0, -subquestion.y)));
                        options.push(listToString1D(getRange(0, -subquestion.y + 1)));
                    }
                    var answer = options[0];
                    var shuffledOptions = shuffle(options); // shuffle the options
                    // because javascript is dumb
                    var foo = function(){ alert("foo")};
                    var bar = function(){ alert("bar")};
                    var elements = {};
                    elements[shuffledOptions[0]] = foo;
                    elements[shuffledOptions[1]] = bar;
                    elements[shuffledOptions[2]] = bar;
                    elements[shuffledOptions[3]] = bar;
                    subquestion.possibleAnswersDropDown = ex.createDropdown(dropdownX, dropdownY,"Choose one",{
                                                                color: "white",
                                                                elements: elements
                                                            });
                    break;
                case ("jump"):
                    break;
                case ("reached"):
                    break;
                default:
                    break;
            }
        };

        subquestion.draw = function(){
            var textStartX = 30;
            var textStartY = 250;
            var spacing = 35;
            for (var i = 0; i < subquestion.textLines.length; i++){
                ex.createParagraph(textStartX, textStartY + i*spacing, subquestion.textLines[i],
                                        {size: "xlarge"});
            }
        };

        return subquestion;
    }


    flow = Flow();
    flow.init();

};
