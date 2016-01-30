document.getElementById("clear").onclick = function(){
    clearC()
    dots = []
    history = []
}

document.getElementById("undo").onclick = function(){
    clearC()

    var lastAction = pastActions.pop()
    if(lastAction.type == "create"){
        console.log(dots)
        dots.pop()
        console.log(dots)
    }
    else if(lastAction.type == "move"){
        moveSpecific(lastAction.dotIndices, -lastAction.dx, -lastAction.dy)
    }

    drawCanvas()
}

document.getElementById("replay").onclick = function(){
    clearC()
    dots = []
    redoMove(0)
}

document.getElementById("sequence").onclick = function(){
    if(sequenceMode){
        sequenceMode = false;

	stateOfDots = [];
	stateOfEdges = [];
    }
    else{
    	console.log("In sequence mode now");
    	sequenceMode = true;
	edgeMode = false;

	//unselects all dots, then stores initial state
	resetDots();

	stateOfDots = dots;
	stateOfEdges = edges;

	clearC();
	drawCanvas();
    }
}

document.getElementById("spoke").onclick = function(){
    if(edgeMode){
    	edgeMode = false;

	stateOfDots = [];
	stateOfEdges = [];
    }
    else{
    	console.log("In edge mode now");
    	edgeMode = true;
	sequenceMode = false;

	stateOfDots = dots;
	stateOfEdges = edges;
    }
}

document.getElementById("addProperty").onclick = function(){
	console.log("adding option to select...");
	var target = document.getElementById("newProperty");
	var newProp = target.value;
	target.value = '';

	var option = document.createElement("option");
	option.text = newProp;
	(document.getElementById("chooseProperty")).add(option);
}

document.getElementById("setProperty").onclick = function(){
	console.log("setting property...");

	var propertyToAdd = document.getElementById("chooseProperty").value;
	var addToDotOrEdge = document.getElementById("dotOrEdge").value;
	var propertyValueAdded = document.getElementById("propertyValue").value;

	document.getElementById("chooseProperty").value = '';
	document.getElementById("dotOrEdge").value = '';
	document.getElementById("propertyValue").value = '';
	
	//uncapitalizing first letter in propertyToAdd
	propertyToAdd = propertyToAdd.charAt(0).toLowerCase() + propertyToAdd.slice(1);
	
	//add property to dots or edges that are selected
	
	if(addToDotOrEdge == "dot"){
		for(var i = 0; i < dots.length; i++){
			if(dots[i].c == "red"){
				dots[i][propertyToAdd] = propertyValueAdded;
				//console.log(dots[i]);
			}
		}
	}
	else{
		for(var i = 0; i < edges.length; i++){
			if(edges[i].c == "red"){
				edges[i][propertyToAdd] = propertyValueAdded;
				console.log(edges[i]);
			}
		}
	}

	clearC();
	drawCanvas();
}
