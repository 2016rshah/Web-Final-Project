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
    }
    else{
    	sequenceMode = true;
    }
}

document.getElementById("spoke").onclick = function(){
    if(edgeMode){
    	edgeMode = false;
    }
    else{
    	edgeMode = true;
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

	console.log(propertyToAdd + " " + addToDotOrEdge + " " + propertyValueAdded);
	//make sure to always uncapitalize first letter, in case it is capitalized at this point.
}
