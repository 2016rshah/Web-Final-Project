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

    drawDots()
}

document.getElementById("replay").onclick = function(){
    clearC()
    dots = []
    redoMove(0)
}