
var main = function(ex) {

	function Flow(){
		var flow = {};

		var flow.init(){
			flow.numberLine = NumberLine();
			flow.questions = [];
			// initialize all the questions and draw them
		};

		var flow.draw(){

		};

		return flow;
	}

	function NumberLine(){
		var numberLine = {};
		numberLine.x = undefined;
		numberLine.y = undefined;
		numberLine.curPoint = undefined;
		numberLine.showTargetRange = false;

		var numberLine.init(){

		};

		var numberLine.draw(){
			// draw base line

			// draw points

			// draw arrows
		};

		var numberLine.setX(x){
			numberLine.x = x;
		};

		var numberLine.setY(y){
			numberLine.y = y;
		};

		var numberLine.setCurPoint(newCurPoint){
			numberLine.curPoint = newCurPoint;
		};

		var numberLine.drawArrow(from, to){
			//todo
		};

		var numberLine.setTargetRange(on){
			numberLine.showTargetRange = on;
		};

		return numberLine;
	}

	function Question(){
		var question = {};


		var question.init(){

		};

		var question.draw(){

		};

		return question;
	}

	function SubQuestion(){
		var subQuestion = {};
		return subQuestion'
	}

	flow = Flow();
	flow.init();
	flow.draw();

};
