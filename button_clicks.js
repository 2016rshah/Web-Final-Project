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
