var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

var RADIUS = 10;
var EDGEWIDTH = 5;
var BLUE = "#567";
var RED = "#c20030";

var dots = []
dots.push({x:-50, y:-50, r:RADIUS, c:"black"}) //fix mystery bug when dragging without drawing dot

var KEY_MAP = {37:"left", 38:"up", 39:"right", 40:"down"}

// var pastActions = [{type:"create", x: 10, y: 10}, {type:"move", dotIndices:[], dx: 10, dy: 10}]
var pastActions = []

//keep track of edge objects edges = [(di1: 1, di2: 2, c: "red", size: EDGEWIDTH)]. di = dot index corresponding to dot array
var edges = [];

//clears the canvas
function clearC(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//calls drawDots and drawEdges
function drawCanvas(){
	drawDots();
	drawEdges();
}

//draws new dot
function drawDots(){
    for(var i = 0; i<dots.length; i++){
        if(dots[i].c == "blue"){
            ctx.fillStyle = BLUE;
        }
        else{
            ctx.fillStyle = RED;
        }
        // ctx.fillStyle = dots[i].c
        ctx.beginPath();
        ctx.arc(dots[i].x, dots[i].y, dots[i].r, 0,2*Math.PI, true);
        ctx.fill()
    }
}

//draws new edges
function drawEdges(){
	for(var i = 0; i < edges.length; i++){
		ctx.beginPath();
		if(edges[i].curve == "y"){
			ctx.bezierCurveTo(dots[edges[i].di1].x, dots[edges[i].di1].y, edges[i].curvex, edges[i].curvey, dots[edges[i].di2].x, dots[edges[i].di2].y);
		}
		else{
			ctx.moveTo(dots[edges[i].di1].x, dots[edges[i].di1].y);
			ctx.lineTo(dots[edges[i].di2].x, dots[edges[i].di2].y);
		}
		if(edges[i].c == "blue"){
			ctx.strokeStyle = BLUE;
		}
		else{
			ctx.strokeStyle = RED;
		}
		ctx.lineWidth = edges[i].size;
		ctx.setLineDash([0]);
		ctx.stroke();
		ctx.closePath();
	}
}

//draw rectangle while dragging
function drawTwoPointRect(l1, l2){
    var dx = l2.x - l1.x
    var dy = l2.y - l1.y
    clearC();
    drawCanvas();
    ctx.beginPath();
    ctx.strokeStyle = BLUE;
    ctx.setLineDash([5]);
    ctx.rect(l1.x, l1.y, dx, dy);
    ctx.stroke();
    ctx.closePath();
}

//make selected in rect red
function convertDots(startLoc, finalLoc){
    var xi = startLoc.x
    var xf = finalLoc.x
    var yi = startLoc.y
    var yf = finalLoc.y

    for(var i = 0; i<dots.length; i++){
        var xt = dots[i].x
        var yt = dots[i].y

        if((xt > xi && xt < xf) || (xt < xi && xt > xf)){ //xs pass
            if((yt > yi && yt < yf) || (yt < yi && yt > yf)){ //ys pass
                dots[i].c = "red"
            }
        }
    }
}

function resetDots(){
    for(var i = 0; i<dots.length; i++){
        dots[i].c = "blue"
    }
}

function resetEdges(){
	for(var i = 0; i < edges.length; i++){
		edges[i].c = "blue";
	}
}

//deletes the edges that are selected
function deleteSelectedEdges(){
	for(var i = 0; i < edges.length; i++){
		if(edges[i].c == "red"){
			edges.splice(i, 1);
			i--;
		}
	}
	console.log(edges);
	clearC();
	drawCanvas();
}

function moveDots(direction){
    var m = 1;
    for(var i = 0; i<dots.length; i++){
        if(dots[i].c == "red"){
            if(direction == "left")
                dots[i].x -= m
            else if(direction == "right")
                dots[i].x += m
            else if(direction == "up")
                dots[i].y -= m
            else if(direction == "down")
                dots[i].y += m
        }
    }
}

function moveSelected(dx, dy){
    for(var i = 0; i<dots.length; i++){
        if(dots[i].c == "red"){
            dots[i].x += dx
            dots[i].y += dy
        }
    }
}

function moveSpecific(arr, dx, dy, type){
    // console.log(arr)
    if(type == "replay"){
        for(var i = 0; i<arr.length; i++){
            dots[arr[i]-1].x += dx
            dots[arr[i]-1].y += dy
        }
    }
    else{
        for(var i = 0; i<arr.length; i++){
            dots[arr[i]].x += dx
            dots[arr[i]].y += dy
        } 
    }
}

function findSelectedDot(loc){
    for(var i = 0; i<dots.length; i++){
    //SHOULD PROBABLY MODIFY LATER SO IT IS COMPATIBLE WITH CHANGING RADII
        if(loc.x > dots[i].x - RADIUS && loc.x < dots[i].x + RADIUS){ //within x threshold
            if(loc.y > dots[i].y - RADIUS && loc.y < dots[i].y + RADIUS){ //within y threshold
                // if(ctrlPressed){
                //     resetDots()
                // }
                // console.log(ctrlPressed)


                if(!ctrlPressed && dots[i].c == "blue"){
                    resetDots()
		    resetEdges();
                } //these two if statements don't work together


                if(dots[i].c == "blue"){
                    originallyBlue = true
                }
                else{
                    originallyBlue = false
                }

                dots[i].c = "red"
                return dots[i]
            }
        }
    }
    return false
}

//Basically same function as above, but does not change the dot colors. Fixes bug
function mouseOverDot(loc){
    for(var i = 0; i<dots.length; i++){
    //SHOULD PROBABLY MODIFY LATER SO IT IS COMPATIBLE WITH CHANGING RADII
        if(loc.x > dots[i].x - RADIUS && loc.x < dots[i].x + RADIUS){ //within x threshold
            if(loc.y > dots[i].y - RADIUS && loc.y < dots[i].y + RADIUS){ //within y threshold
                return dots[i];
            }
        }
    }
    return false;
}

//STILL DOES NOT QUITE WORK FOR WHEN THE LINE IS CLOSE TO VERTICAL OR HORIZONTAL
function findSelectedLine(loc){
	//[(di1: 1, di2: 2, c: "red")]
	
	for(var i = 0; i < edges.length; i++){
		if(locationIsWithinEdgeBounds(loc, edges[i])){
			var slopetop = dots[edges[i].di1].y - dots[edges[i].di2].y;
			var slopebot = dots[edges[i].di1].x - dots[edges[i].di2].x;
			var leftHandSide = (loc.y - dots[edges[i].di1].y) * slopebot;
			var rightHandSide = (loc.x - dots[edges[i].di1].x) * slopetop;
			console.log("edge index: " + i);
			console.log("leftHandSide: " + leftHandSide);
			console.log("rightHandSide: " + rightHandSide);
			//console.log("slope: " + slope);
			//
			
			//if both are negative make them positive
			if(leftHandSide < 0 && rightHandSide < 0){
				leftHandSide = Math.abs(leftHandSide);
				rightHandSide = Math.abs(rightHandSide);
			}
			if((leftHandSide > rightHandSide * 0.90 && leftHandSide < rightHandSide * 1.10) || (rightHandSide > leftHandSide * 0.90 && rightHandSide < leftHandSide * 1.10)){
				console.log("leftHandSide: " + leftHandSide);
				console.log("rightHandSide: " + rightHandSide);
	
				edges[i].c = "red";
				return edges[i];
			}
		}
	}
	return false;
}

//Basically same function as above, but does not change dot color
function mouseOverEdge(loc){
	for(var i = 0; i < edges.length; i++){
		if(locationIsWithinEdgeBounds(loc, edges[i])){
			var slopetop = dots[edges[i].di1].y - dots[edges[i].di2].y;
			var slopebot = dots[edges[i].di1].x - dots[edges[i].di2].x;
			var leftHandSide = (loc.y - dots[edges[i].di1].y) * slopebot;
			var rightHandSide = (loc.x - dots[edges[i].di1].x) * slopetop;

			if(leftHandSide < 0 && rightHandSide < 0){
				leftHandSide = Math.abs(leftHandSide);
				rightHandSide = Math.abs(rightHandSide);
			}
			if((leftHandSide > rightHandSide * 0.90 && leftHandSide < rightHandSide * 1.10) || (rightHandSide > leftHandSide * 0.90 && rightHandSide < leftHandSide * 1.10)){
	
				return edges[i];
			}
		}
	}
	return false;

}

function locationIsWithinEdgeBounds(loc, edgeElement){
	//di1 to the upper right
	if(dots[edgeElement.di1].x >= dots[edgeElement.di2].x && dots[edgeElement.di1].y >= dots[edgeElement.di2].y){
		if(loc.x >= dots[edgeElement.di2].x && loc.x <= dots[edgeElement.di1].x && loc.y >= dots[edgeElement.di2].y && loc.y <= dots[edgeElement.di1].y){
			return true;
		}
	}
	//di1 to the upper left
	else if(dots[edgeElement.di1].x <= dots[edgeElement.di2].x && dots[edgeElement.di1].y >= dots[edgeElement.di2].y){
		if(loc.x <= dots[edgeElement.di2].x && loc.x >= dots[edgeElement.di1].x && loc.y >= dots[edgeElement.di2].y && loc.y <= dots[edgeElement.di1].y){
			return true;
		}
		
	}
	//di1 to the lower left
	else if(dots[edgeElement.di1].x <= dots[edgeElement.di2].x && dots[edgeElement.di1].y <= dots[edgeElement.di2].y){
		if(loc.x <= dots[edgeElement.di2].x && loc.x >= dots[edgeElement.di1].x && loc.y <= dots[edgeElement.di2].y && loc.y >= dots[edgeElement.di1].y){
			return true;
		}

	}
	//di1 to the lower right
	else if(dots[edgeElement.di1].x >= dots[edgeElement.di2].x && dots[edgeElement.di1].y <= dots[edgeElement.di2].y){
		if(loc.x >= dots[edgeElement.di2].x && loc.x <= dots[edgeElement.di1].x && loc.y <= dots[edgeElement.di2].y && loc.y >= dots[edgeElement.di1].y){
			return true;
		}

	}
	return false;
}

function displayDotProperties(coordinates, displayingDot){
	ctx.font = "10px serif";
	ctx.fillStyle = "#FF0000";
	ctx.fillText("x: " + displayingDot.x, coordinates.x + 10, coordinates.y);
	ctx.fillText("y: " + displayingDot.y, coordinates.x + 10, coordinates.y + 10);
	ctx.fillText("r: " + displayingDot.r, coordinates.x + 10, coordinates.y + 20);
	ctx.fillText("c: " + displayingDot.c, coordinates.x + 10, coordinates.y + 30);
}

function displayEdgeProperties(coordinates, displayingEdge){
	ctx.font = "10px serif";
	ctx.fillStyle = "#FF0000";
	ctx.fillText("d1: " + displayingEdge.di1, coordinates.x + 10, coordinates.y);
	ctx.fillText("d2: " + displayingEdge.di2, coordinates.x + 10, coordinates.y + 10);
	ctx.fillText("c: " + displayingEdge.c, coordinates.x + 10, coordinates.y + 20);
	ctx.fillText("size: " + displayingEdge.size, coordinates.x + 10, coordinates.y + 30);

}

function redoMove(mI){
    clearC()
    if(pastActions[mI].type == "create"){
        resetDots()
        dots.push({x:pastActions[mI].x, y:pastActions[mI].y, r:RADIUS, c:"red"})
    }
    else if(pastActions[mI].type == "move"){
        
        moveSpecific(pastActions[mI].dotIndices, pastActions[mI].dx, pastActions[mI].dy, "replay")
    }
    drawCanvas();

    if(mI+1 < pastActions.length){
        window.setTimeout(function(){
            redoMove(mI+1)
            console.log("recursing", mI)
        }, 1000)
    }
}

var startLoc = {}
var currLoc = {}
var finalLoc = {}
var selectedDot = false
var selectedLine = false;

var drawing = false;

var ctrlPressed = false;

var maxDist = 0

var originallyBlue = true

//True if you are in the mode, false otherwise
var sequenceMode = false;
var edgeMode = false;

//toggle ability with control click

c.onmousedown = function(e){
    var coords = canvas.relMouseCoords(e);
    startLoc = {x:coords.x, y:coords.y}

    
    drawing = true;

    if(e.metaKey || e.ctrlKey){
        ctrlPressed = true;
    }

    selectedDot = findSelectedDot(startLoc);
    if(!selectedDot){
    	selectedLine = findSelectedLine(startLoc);
    }
    

}
c.onmousemove = function(e){
    clearC();
    var coords = canvas.relMouseCoords(e);

    var dist = Math.pow(startLoc.x - currLoc.x, 2) + Math.pow(startLoc.y - currLoc.y, 2)
    maxDist = (dist>maxDist) ? dist : maxDist

    //check to see if mouse is over a dot or edge, then display text box with properties
    
    if(mouseOverDot(coords)){
    	displayDotProperties(coords, mouseOverDot(coords));
    }
    else if(mouseOverEdge(coords)){
    	displayEdgeProperties(coords, mouseOverEdge(coords));
    }

    if(selectedDot){ //dragging a dot
        if(currLoc.x && currLoc.y){
            var dx = coords.x - currLoc.x
            var dy = coords.y - currLoc.y
            moveSelected(dx, dy)
        }
        currLoc = {x:coords.x, y:coords.y}
    }
    else if(selectedLine){ //dragging a line to produce a curve
        currLoc = {x:coords.x, y:coords.y}
    	if(currLoc.x && currLoc.y){
    		var indexOfLine = edges.indexOf(selectedLine);
		//console.log(indexOfLine);
		edges[indexOfLine].curve = "y";
		edges[indexOfLine].curvex = currLoc.x;
		edges[indexOfLine].curvey = currLoc.y;
		console.log(edges[indexOfLine]);
    	}
    }
    else if(drawing){ //selecting dots\
        currLoc = {x:coords.x, y:coords.y}
        drawTwoPointRect(startLoc, currLoc)
    }
    drawCanvas();
}
c.onmouseup = function(e){
    var coords = canvas.relMouseCoords(e);
    finalLoc = {x:coords.x, y:coords.y}
    
    if(selectedDot){
        clearC()

        if(maxDist < 75){
            if(ctrlPressed){
                selectedDot.c = (originallyBlue) ? "red" : "blue"
            }
        }

        var selected = []
        for(var i = 0; i<dots.length; i++){
            if(dots[i].c == "red"){ selected.push(i) }
        }
        var dx = finalLoc.x - startLoc.x
        var dy = finalLoc.y - startLoc.y
        pastActions.push({"type":"move", "dotIndices":selected, "dx": dx, "dy": dy})
        console.log(pastActions)

        drawCanvas()
    }
    else if(selectedLine){
    	console.log("selected line");
    	clearC();
	drawCanvas();
    }
    else{
        if(maxDist < 75){ //just clicked
            clearC()

            if(!ctrlPressed){
                resetDots()
		resetEdges();
            }

            dots.push({x:coords.x, y:coords.y, r:RADIUS, c:"red"}) 

            pastActions.push({type:"create", x: coords.x, y: coords.y})
            console.log(pastActions)

            drawCanvas()
        }
        else{ //dragged over
            clearC()

            //control key part of lab
            if(!ctrlPressed){
                resetDots()
		resetEdges();
            }

            convertDots(startLoc, finalLoc)
            drawCanvas()
        }
    }
    //reset everything
    ctrlPressed = false;
    drawing = false;
    startLoc = {}
    currLoc = {}
    finalLoc = {}
    selectedDot = false
    selectedLine = false;
    maxDist = 0
    originallyBlue = true;
}
