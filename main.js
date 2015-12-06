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

    function div(x, y){
        return Math.floor(x / y);
    }

    function mod(x, y){
        return x - div(x, y)*y;
    }

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

    // how many times do you have to subtract/add y from/to x?
    // e.g. for 5 % 2, you need to do it twice
    // works for negatives too
    // this is because int division doesn't do the thing I want...
    function getNumTimesToIterateSubquestion(x, y){
        var count = 0;
        if (x > 0 && y > 0){ // both are positive
            count = Math.trunc((x - x%y)/y);
        }
        else{
            x = Math.abs(x);
            y = -Math.abs(y);
            while (x > y){
                count++;
                x += y;
            }
            count--;
        }
        // shouldn't be a case when both are negative
        return count;
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

    // both to get the right number when writing "we get the answer by adding y"
    // and to set nextPoint correctly
    function getYToAdd(x, y){
	    if (x > 0 && y > 0){
    		return y*-1;
    	}
    	else if (x > 0 && y < 0){
    		return y;
    	}
    	else if (x < 0 && y > 0){
    		return y;
    	}
    	else{
    		return y*-1;
    	}
    }

    /*****************************************************************
     * Flow
     ****************************************************************/

    function Flow(){
        var flow = {};
        flow.numQuestions = 3;
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

    function NumberLine(){
        var numberLine = {};
        numberLine.x = undefined;
        numberLine.y = undefined;
        numberLine.curPoint = undefined;
        numberLine.nextPoint = undefined;
        numberLine.selectedAnswer = undefined;
        numberLine.showTargetRange = false;
        numberLine.showX = false;
        numberLine.showY = true;
        numberLine.minNum = -10;
        numberLine.maxNum = 10;
        numberLine.jumps = [];
        numberLine.numButtonList = [];
        numberLine.pointList = [];
        numberLine.targetRangeMin = undefined;
        numberLine.targetRangeMax = undefined;

        // l is number line, p is points on line, a is arrows at either end
        var l = {x1 : 6, y1 : 90, x2 : ex.width() - 6, y2 : 90};
        var offset = (l.x2 - l.x1) / 22;
        var p = {r : 5, x : l.x1 + offset, y : l.y1};
        p.offset = offset;
        var size = 10;
        var a = {x1 : l.x1, y1 : l.y1, x2 : l.x1 + size, y2 : l.y1 - size};
        a.size = size;

        //keep track of the positions of all the points
        for (var i = 0; i <= 20; i++) {
            numberLine.pointList.push({x: p.x + i*p.offset, y: p.y});
        };

        function check(i){ 
            return function(){
                numberLine.selectedAnswer = i;
            } 
        };

        numberLine.checkAnswer = function(){
        	console.log("!");
        	console.log(numberLine.nextPoint);
            if(numberLine.selectedAnswer === numberLine.nextPoint){
                numberLine.jumps.push({from: numberLine.pointList[numberLine.curPoint + 10],
                                         to: numberLine.pointList[numberLine.nextPoint + 10]});
                console.log("CurPoint = " + numberLine.curPoint);
                console.log("NextPoint = " + numberLine.nextPoint);

                numberLine.curPoint = numberLine.nextPoint;
                numberLine.nextPoint = numberLine.curPoint + getYToAdd(numberLine.x, numberLine.y);
                return true;
            }
        };

        numberLine.draw = function(){
            function drawLine() { 
                ex.graphics.ctx.moveTo(l.x1, l.y1);
                ex.graphics.ctx.lineTo(l.x2, l.y2);
                ex.graphics.ctx.stroke();
            }

            function drawPoints() {
                for (var i = 0; i < 21; i++) {
                    ex.graphics.ctx.strokeStyle = "#000000";
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
                	if (numberLine.showX && i == numberLine.x){ // color x
                		var color = "orange";
                	}
                	else if (numberLine.showY && i == numberLine.y){  // color y
                		var color = "lightBlue";
                	}
                	else if (numberLine.showTargetRange && i >= numberLine.targetRangeMin
                				&& i <= numberLine.targetRangeMax){ // target range
                		var color = "green"
                	}
                	else{ // default
                		var color = "blue";
                	}
                    numberLine.numButtonList.push(ex.createButton(
	                    p.x + p.offset * (i + numberLine.maxNum) - 14, p.y + 10, i.toString(), {
	                    color: color, size: "small" }).on("click", check(i)))
                }
            }

            function drawCurves(){
                for (var i = 0; i < numberLine.jumps.length; i++) {
                    numberLine.drawCurve(numberLine.jumps[i].from, numberLine.jumps[i].to);
                };
            }

            drawLine();
            drawPoints();
            drawArrows();
            drawNumbers();
            drawCurves();

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

        numberLine.setNextPoint = function(newNextPoint){
            numberLine.nextPoint = newNextPoint;
        };

        numberLine.drawCurve = function(from, to){
            ex.graphics.ctx.strokeStyle = "#000000";
            ex.graphics.ctx.beginPath();
            ex.graphics.ctx.moveTo(from.x,from.y);
            ex.graphics.ctx.quadraticCurveTo((from.x + to.x)/2, from.y - 50, to.x, to.y);
            ex.graphics.ctx.stroke();
            //todo
        };

        numberLine.setTargetRange = function(on){
            numberLine.showTargetRange = on;
            // set the target range variables
    		if (numberLine.y > 0){
    			numberLine.targetRangeMin = 0;
    			numberLine.targetRangeMax = numberLine.y - 1;
    		}
    		else{
    			numberLine.targetRangeMin = numberLine.y + 1
    			numberLine.targetRangeMax = 0;
    		}
        };

        numberLine.setShowX = function(on){
        	numberLine.showX = on;
        }

        numberLine.setShowY = function(on){
        	numberLine.showY = on;
        }

        return numberLine;
    }

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
                    question.y = getRandomInt(2, 6);
                    question.x = getRandomInt(question.y + 1, 9);
                    break;
                case 1: // x is negative
                    question.x = 0 - getRandomInt(1, 9);
                    question.y = getRandomInt(2, 9);
                    break;
                case 2: // y is negative
                	question.x = getRandomInt(1, 9);
                    question.y = 0 - getRandomInt(2, 9);
                    break;
                default:
                    break;
            }
            // create numberline
            question.numberLine = NumberLine();
            question.numberLine.setX(question.x);
            question.numberLine.setY(question.y);
            question.numberLine.setCurPoint(question.x);
            question.numberLine.setNextPoint(question.x + getYToAdd(question.x, question.y));

            // create subquestions
            // initial question
            var initialQuestion = SubQuestion("initial");
            initialQuestion.y = question.y;
            question.subquestions.push(initialQuestion);
            // create jump and reached questions
            var numJumpReachedQuestions = getNumTimesToIterateSubquestion(question.x, question.y);
            for (var i = 0; i < numJumpReachedQuestions; i++){
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
                if (i === numJumpReachedQuestions-1) {
                    reachedQuestion.answer = true;
                } else {
                    reachedQuestion.answer = false;
                };
                question.subquestions.push(reachedQuestion);
            }

            // init current question
            question.getCurrentSubquestion().init();

            console.log(question.x);
            console.log(question.y);
            console.log(question.subquestions);

        question.nextButton = ex.createButton(ex.width()-75, ex.height()-50, "next", {color:"blue"}).on("click", function(){
                var correct = question.getCurrentSubquestion().checkAnswer();
                if(correct){
                    console.log("correct!");
                    if (question.currSubquestion < question.subquestions.length - 1){ // still have more subquestions to go!
	                    question.currSubquestion += 1;
	                    question.getCurrentSubquestion().init();
	                    for (var i = 0; i < question.numberLine.numButtonList.length; i++) {
	                        question.numberLine.numButtonList[i].remove();
	                    }
	                    flow.draw();
	                }
	                else if (question.currSubquestion == question.subquestions.length - 1){ // no more subquestions, but are there more questions?
	                	if (question.questionNum < flow.numQuestions - 1){
	                		flow.currQuestionNum += 1;
	                		flow.getCurrentQuestion().init();
	                		for (var i = 0; i < question.numberLine.numButtonList.length; i++) {
	                        	question.numberLine.numButtonList[i].remove();
	                    	}
	                    	flow.draw();
	                	}
	                	else{ // no more subquestions or questions
	                		ex.alert("You have completed the exercise. Please click Submit.", {color: "blue", stay: true});
	                	}
	                }
                } else {
                    console.log("incorrect");
                };
            });
        };

        question.draw = function(){
            ex.graphics.ctx.clearRect(0,0,ex.width(),ex.height());
            // draw the question number
            ex.data.questionNumText = ex.createParagraph(10, 10, 
                "Question "+ (question.questionNum+1).toString(), {size:"xlarge"});
            // draw its child things
            question.getCurrentSubquestion().draw();
            question.numberLine.draw();
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
        subquestion.selectedAnswer = "";
        subquestion.shuffledOptions = undefined;
        ex.data.possibleAnswersDropDown = undefined;

        subquestion.makeSelection = function(i){
            return function(){subquestion.selectedAnswer = subquestion.shuffledOptions[i]; };
        };
        subquestion.init = function(){
        	// what number should we add to get to the target range?
        	// it's different depending on whether x/y are positive/negative
        	var yToAdd = getYToAdd(subquestion.x, subquestion.y);
        	// init stuff based on question type
            switch (subquestion.type){
                case ("initial"):
                    subquestion.textLines.push("Let's calculate x%" + subquestion.y.toString());
                    subquestion.textLines.push("What are the possible answers?");
                    var dropdownX = 440;
                    var dropdownY = 220;
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
                    subquestion.answer = options[0];
                    subquestion.shuffledOptions = shuffle(options); // shuffle the options
                    console.log(subquestion.shuffledOptions);
                    var elements = {};
                    for (var i = 0; i < subquestion.shuffledOptions.length; i++){
                        elements[subquestion.shuffledOptions[i]] = subquestion.makeSelection(i);
                    }
                    ex.data.possibleAnswersDropDown = ex.createDropdown(dropdownX, dropdownY,"Choose one",{
                                                                color: "white",
                                                                elements: elements
                                                            });
                    break;
                case ("jump"):
                    subquestion.textLines.push("Let's calculate " + subquestion.x.toString() + "%" + subquestion.y.toString());
                    subquestion.textLines.push("We calculate " + subquestion.x.toString() + "%" 
                                                + subquestion.y.toString() + 
                    " by adding " + yToAdd.toString());
                    subquestion.textLines.push("to " + subquestion.x.toString() + " until we reach the");
                    subquestion.textLines.push("target range.");
                    subquestion.textLines.push("");
                    subquestion.textLines.push("Click where we jump to next.");
                    break;  
                case ("reached"):
                    subquestion.textLines.push("Let's calculate " + subquestion.x.toString() + "%" + subquestion.y.toString());
                    subquestion.textLines.push("We calculate " + subquestion.x.toString() + "%" 
                                                + subquestion.y.toString() + 
                    " by adding " + yToAdd.toString());
                    subquestion.textLines.push("to " + subquestion.x.toString() + " until we reach the");
                    subquestion.textLines.push("target range.");
                    subquestion.textLines.push("");
                    subquestion.textLines.push("Have we reached the answer?");
                    // dropdown for reached
                    var dropdownX = 440;
                    var dropdownY = 360;
                    ex.data.possibleAnswersDropDown = ex.createDropdown(dropdownX, dropdownY,"Choose one",{
                                                                color: "white",
                                                                elements: {Yes: function(){subquestion.selectedAnswer = true;},
                                                                           No: function(){subquestion.selectedAnswer = false;}}
                                                            });
                    break;
                default:
                    break;
            }

        };

        subquestion.draw = function(){
            var textStartX = 30;
            var textStartY = 185;
            var spacing = 35;
            ex.data.par = [];
            for (var i = 0; i < subquestion.textLines.length; i++){
                ex.data.par.push(ex.createParagraph(textStartX, textStartY + i*spacing, subquestion.textLines[i],
                                        {size: "xlarge"}));
            }
            // write the text target range
            if (subquestion.type != "initial"){
            	if (subquestion.y > 0){
            		ex.data.targetRangeText = ex.createParagraph(380,140,"target range",{size:"large"});
            	}
            	else{
            		// TODO: not sure if coords are correct since we can't test it yet
            		ex.data.targetRangeText = ex.createParagraph(280,140,"right aligned",{size:"large"});
            	}
            }
        };

        subquestion.removeAllFromPar = function(){
            for (var i = 0; i < ex.data.par.length; i++){
                ex.data.par[i].remove();
            }           
        };

        subquestion.checkAnswer = function(){
            switch (subquestion.type){
                case "initial": 
                    if (subquestion.answer === subquestion.selectedAnswer){
                        if (ex.data.par != undefined){

                        	// remove previous text
                        	subquestion.removeAllFromPar();
                        	// remove dropdown
                        	ex.data.possibleAnswersDropDown.remove();
                        	// remove question num
                        	ex.data.questionNumText.remove();
                        	// start drawing target range, x, and y
                        	flow.getCurrentQuestion().numberLine.setTargetRange(true);
                        	flow.getCurrentQuestion().numberLine.setShowX(true);
                        	flow.getCurrentQuestion().numberLine.setShowY(true);

                        }
                        return true;
                    } else {
                        ex.alert("That's incorrect.", {color:"red"})
                        return false;
                    }
                    break;
                case "jump":
                    if(flow.getCurrentQuestion().numberLine.checkAnswer() === true){
                        //remove previous text
                        subquestion.removeAllFromPar();
                        // remove question num and target range text
                        ex.data.questionNumText.remove();
                        ex.data.targetRangeText.remove();
                        return true;
                    } else {
                        ex.alert("That's incorrect.", {color:"red"})
                        return false;
                    };
                    break;
                case "reached":
                    if(subquestion.answer === subquestion.selectedAnswer){
                        //remove previous text
                        subquestion.removeAllFromPar();
                        // remove question num and target range text
                        ex.data.questionNumText.remove();
                        ex.data.targetRangeText.remove();
                        //remove dropdown
                        ex.data.possibleAnswersDropDown.remove();
                        return true;
                    } else {
                        ex.alert("That's incorrect.", {color:"red"})
                        return false;
                    }
                    break;
                default:
                    return false;
                    break;
            }
        };

        return subquestion;
    }

    // disable things
    ex.chromeElements.undoButton.disable();
    ex.chromeElements.redoButton.disable();
    ex.chromeElements.displayCAButton.disable();

    // make reset button
    function doReset(){
    	// undraw things
    	flow.getCurrentQuestion().getCurrentSubquestion().removeAllFromPar();
		for (var i = 0; i < flow.getCurrentQuestion().numberLine.numButtonList.length; i++) {
        	flow.getCurrentQuestion().numberLine.numButtonList[i].remove();
    	}
    	ex.data.questionNumText.remove();
        if (ex.data.targetRangeText != undefined) ex.data.targetRangeText.remove();
        if (ex.data.possibleAnswersDropDown != undefined) ex.data.possibleAnswersDropDown.remove();
        // make a new thing
    	flow = Flow();
    	flow.init();
    }

	ex.chromeElements.resetButton.on("click", function () {doReset(true)});

    // start!
    flow = Flow();
    flow.init();

};
