
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

	function Flow(){
		var flow = {};
		flow.numQuestions = 2;
		flow.currQuestionNum = 0;
		flow.questions = [];

		flow.init = function(){
			flow.numberLine = NumberLine();
			flow.numberLine.init();
			// create and init questions
			for (var i = 0; i < flow.numQuestions; i++){
				flow.questions.push(Question(i));
				flow.questions[i].init();
			}
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

	function NumberLine(){
        var numberLine = {};
        numberLine.x = undefined;
        numberLine.y = undefined;
        numberLine.curPoint = undefined;
        numberLine.showTargetRange = false;

        numberLine.init = function(){

        };

        numberLine.draw = function(){
            var l = {x1 : 200, y1 : 300, x2 : ex.width() - 200, y2 : 300};

            function drawLine() { 
                ex.graphics.ctx.moveTo(l.x1, l.y1);
                ex.graphics.ctx.lineTo(l.x2, l.y2);
                ex.graphics.ctx.stroke();
            }

            function drawPoints() {
                
            }

            function drawArrows() {
                var size = 20;
                var a = {x1 : l.x1, y1 : l.y1, x2 : l.x1 + size, y2 : l.y1 - size};

                for (var i = 0; i < 4; i++) {                
                    ex.graphics.ctx.moveTo(a.x1, a.y1);
                    ex.graphics.ctx.lineTo(a.x2, a.y2);
                    ex.graphics.ctx.stroke();
                    if (i % 2 == 1) a.y1 -= size * 2;
                    else a.y1 += size * 2;
                    if (i == 1) {
                        a.x1 = l.x2;
                        a.x2 = a.x1 - size;
                    }
                }
            }
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
            //todo
        };

        numberLine.setTargetRange = function(on){
            numberLine.showTargetRange = on;
        };

        return numberLine;
    }

	function Question(questionNum){
		var question = {};
		question.questionNum = questionNum;

		question.init = function(){

		};

		question.draw = function(){
			console.log(question.questionNum);
		};

		return question;
	}

	function SubQuestion(){
		var subQuestion = {};
		return subQuestion;
	}

	flow = Flow();
	flow.init();

};
