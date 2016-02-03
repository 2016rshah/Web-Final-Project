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
	drawDotLabels();
	drawEdgeLabels();
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
	//console.log("EDGES:");
	//console.log(edges);
	for(var i = 0; i < edges.length; i++){
		ctx.beginPath();
		if(edges[i].curve == "yes"){
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

function drawDotLabels(){
	ctx.font = "10px serif";
	ctx.fillStyle = "#000000";
	for(var i = 0; i < dots.length; i++){
		if(dots[i].caption != undefined){
			ctx.fillText(dots[i].caption, dots[i].x - dots[i].r*1.5, dots[i].y + dots[i].r);
		}
	}
}

function drawEdgeLabels(){
	ctx.font = "10px serif";
	ctx.fillStyle = "#000000";
	var startX, startY, px0, px1, px2, py0, py1, py2;
	for(var i = 0; i < edges.length; i++){
		if(edges[i].caption != undefined){
			px0 = dots[edges[i].di1].x;
			py0 = dots[edges[i].di1].y;
			px1 = edges[i].curvex;
			py1 = edges[i].curvey;
			px2 = dots[edges[i].di2].x;
			py2 = dots[edges[i].di2].y;
			if(edges[i].curve == "yes"){
				var t = 0.5;
				startX = (1 - t) * (1 - t) * px0 + 2 * (1 - t) * t * px1 + t * t * px2;
				startY = (1 - t) * (1 - t) * py0 + 2 * (1 - t) * t * py1 + t * t * py2;
			}
			else{
				startX = (px0 + px2) / 2;
				startY = (py0 + py2) / 2;
			}
			ctx.fillText(edges[i].caption, startX, startY);
		}
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
        if(loc.x > dots[i].x - dots[i].r && loc.x < dots[i].x + dots[i].r){ //within x threshold
            if(loc.y > dots[i].y - dots[i].r && loc.y < dots[i].y + dots[i].r){ //within y threshold
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
        if(loc.x > dots[i].x - dots[i].r && loc.x < dots[i].x + dots[i].r){ //within x threshold
            if(loc.y > dots[i].y - dots[i].r && loc.y < dots[i].y + dots[i].r){ //within y threshold
                return dots[i];
            }
        }
    }
    return false;
}

function findSelectedLine(loc){
	//[(di1: 1, di2: 2, c: "red")]
	if(!ctrlPressed){
		resetDots();
		resetEdges();
	}
	for(var i = 0; i < edges.length; i++){
		//console.log(i);
		if(edges[i].curve != "yes" && locationIsWithinEdgeBounds(loc, edges[i])){
			var slopetop = dots[edges[i].di1].y - dots[edges[i].di2].y;
			var slopebot = dots[edges[i].di1].x - dots[edges[i].di2].x;
			var yint = dots[edges[i].di1].y - ((slopetop/slopebot) * dots[edges[i].di1].x);
			var a = -1 * slopetop;
			var b = slopebot;
			var c = -1 * slopebot * yint;
			//console.log("a = " + a + " b = " + b + " c = " + c);
			var distance = Math.abs(a * loc.x + b * loc.y + c)/Math.sqrt(a * a + b * b);
			//console.log("DISTANCE = " + distance);
			if(distance < EDGEWIDTH){
				edges[i].c = "red";
				return edges[i];
			}
		}
		else if(edges[i].curve == "yes"){
			//console.log("CURVE");
			console.log(edges[i]);
			if(locNearCurve(dots[edges[i].di1].x, dots[edges[i].di1].y, edges[i].curvex, edges[i].curvey, dots[edges[i].di2].x, dots[edges[i].di2].y, loc.x, loc.y)){
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
		if(edges[i].curve != "yes" && locationIsWithinEdgeBounds(loc, edges[i])){
			var slopetop = dots[edges[i].di1].y - dots[edges[i].di2].y;
			var slopebot = dots[edges[i].di1].x - dots[edges[i].di2].x;
			var yint = dots[edges[i].di1].y - ((slopetop/slopebot) * dots[edges[i].di1].x);
			var a = -1 * slopetop;
			var b = slopebot;
			var c = -1 * slopebot * yint;
			//console.log("a = " + a + " b = " + b + " c = " + c);
			var distance = Math.abs(a * loc.x + b * loc.y + c)/Math.sqrt(a * a + b * b);
			//console.log("DISTANCE = " + distance);
			if(distance < EDGEWIDTH){
				return edges[i];
			}
		}
		else if(edges[i].curve == "yes"){
			//console.log("CURVE");
			//console.log(edges[i]);
			if(locNearCurve(dots[edges[i].di1].x, dots[edges[i].di1].y, edges[i].curvex, edges[i].curvey, dots[edges[i].di2].x, dots[edges[i].di2].y, loc.x, loc.y)){
				return edges[i];
			}

		}
	}
	return false;

}

function locNearCurve(px0, py0, px1, py1, px2, py2, n1, n2){
	var t = 0.00;
	//console.log(px0 + " " + py0 + " : " + px1 + " " + py1 + " : " + px2 + " " + py2);

	while(t <= 1.00){
		var tempx = (1 - t) * (1 - t) * px0 + 2 * (1 - t) * t * px1 + t * t * px2;
		var tempy = (1 - t) * (1 - t) * py0 + 2 * (1 - t) * t * py1 + t * t * py2;
		var tempdistance = Math.sqrt((n1 - tempx) * (n1 - tempx) + (n2 - tempy) * (n2 - tempy));
		//console.log("TEMP DISTANCE: " + tempdistance);
		if(tempdistance < EDGEWIDTH){
			return true;
		}
		t = t + 0.005;
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
	var numAttributes = Object.keys(displayingDot).length;

	var xStart = coordinates.x + displayingDot.r;
	var yStart = coordinates.y;
	var yIncrement = 10;

	ctx.font = "10px serif";
	ctx.fillStyle = "#0000FF";
	
	var propValue;
	for(var propName in displayingDot){
      if(propName == "caption" || propName == "c")
         continue;
		propValue = displayingDot[propName];
		ctx.fillText(propName + ": " + propValue, xStart, yStart);
		yStart += yIncrement;
	}
}

function displayEdgeProperties(coordinates, displayingEdge){
	var numNewAttributes = Object.keys(displayingEdge).length;

	var xStart = coordinates.x + displayingEdge.size * 2;
	var yStart = coordinates.y;
	var yIncrement = displayingEdge.size * 2;
	
	ctx.font = "10px serif";
	ctx.fillStyle = "#0000FF";

	var propValue;
	for(var propName in displayingEdge){
      if(propName == "caption" || propName == "c" || propName == "di1" || propName == "di2")
         continue;
		propValue = displayingEdge[propName];
		ctx.fillText(propName + ": " + propValue, xStart, yStart);
		yStart += yIncrement;
	}
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

function toggleEdgesInEdgeMode(dotSet1, dotSet2){
	for(var i = 0; i < dotSet1.length; i++){
		for(var j = 0; j < dotSet2.length; j++){
			var correspondingIndexInEdgeArray = -1;
			for(var k = 0; k < edges.length; k++){
				if(edges[k].di1 == dotSet1[i] && edges[k].di2 == dotSet2[j]){
					correspondingIndexInEdgeArray = k;
				}
				if(edges[k].di1 == dotSet2[j] && edges[k].di2 == dotSet1[i]){
					correspondingIndexInEdgeArray = k;
				}
			}
			if(correspondingIndexInEdgeArray == -1){
				edges.push({di1:dotSet1[i], di2:dotSet2[j], c:"red", size:EDGEWIDTH});
			}
			else{
				edges.splice(correspondingIndexInEdgeArray, 1);
			}
		}
	}
}

function computeDijkstra(dotsSelectedForPath){
	//Set up adjacency matrix
	var _ = Infinity;
	var numberOfVertices = dots.length;
	var e = [];
	for(var i = 0; i < dots.length; i++){
		var adjacentToThis = [];
		for(var j = 0; j < dots.length; j++){
			adjacentToThis.push(_);
		}
		e.push(adjacentToThis);
	}

	for(var i = 0; i < edges.length; i++){
		if(edges[i].weight != undefined){
			e[edges[i].di1][edges[i].di2] = parseInt(edges[i].weight);
			e[edges[i].di2][edges[i].di1] = parseInt(edges[i].weight);
		}
		else{
			e[edges[i].di1][edges[i].di2] = edges[i].size;
			e[edges[i].di2][edges[i].di1] = edges[i].size;
		}
	}

	console.log(e);
	//console.log(e[0][0]);
	var shortestPathInfo = shortestPath(e, numberOfVertices, dotsSelectedForPath[0]);
	console.log(shortestPathInfo);

	var pathStartToEnd = constructPath(shortestPathInfo, dotsSelectedForPath[1]);
	console.log(pathStartToEnd);
	resetEdges();
	
	//set edges on path to red
	var startOfEdge = dotsSelectedForPath[0];
	var endOfEdge = -1;
	for(var i = 0; i < pathStartToEnd.length; i++){
		//console.log(pathStartToEnd[i]);
		if(endOfEdge == -1){
			endOfEdge = pathStartToEnd[i];
		}
		else{
			startOfEdge = endOfEdge;
			endOfEdge = pathStartToEnd[i];
		}
		for(var k = 0; k < edges.length; k++){
			if((edges[k].di1 == startOfEdge && edges[k].di2 == endOfEdge) || (edges[k].di2 == startOfEdge && edges[k].di1 == endOfEdge)){
				//console.log("setting");
				edges[k].c = "red";
			}
		}
	}
	clearC();
	drawCanvas();
}

function constructPath(shortestPathInfo, endVertex){
	var path = [];
	var possiblePath = true;
	if((shortestPathInfo.predecessors).indexOf(shortestPathInfo.startVertex) < 0){
		alert("No possible path");
		possiblePath = false;
	}
	if(possiblePath){
		while(endVertex != shortestPathInfo.startVertex){
			path.unshift(endVertex);
			endVertex = shortestPathInfo.predecessors[endVertex];
		}
	}
	return path;
}

function shortestPath(currentEdges, numVertices, startVertex){
	var done = new Array(numVertices);
	done[startVertex] = true;
	var pathLengths = new Array(numVertices);
	var predecessors = new Array(numVertices);
	for(var i = 0; i < numVertices; i++){
		pathLengths[i] = currentEdges[startVertex][i];
		if(currentEdges[startVertex][i] != Infinity){
			predecessors[i] = startVertex;
		}
	}
	pathLengths[startVertex] = 0;

	for(var i = 0; i < numVertices - 1; i++){
		var closest = -1;
		var closestDistance = Infinity;
		for(var j = 0; j < numVertices; j++){
			if(!done[j] && pathLengths[j] < closestDistance){
				closestDistance = pathLengths[j];
				closest = j;
			}
		}
		done[closest] = true;
		
		for(var j = 0; j < numVertices; j++){
			if(!done[j] && closest != -1){
				//console.log(currentEdges);
				//console.log(closest);
				var possiblyCloserDistance = pathLengths[closest] + currentEdges[closest][j];
				if(possiblyCloserDistance < pathLengths[j]){
					pathLengths[j] = possiblyCloserDistance;
					predecessors[j] = closest;
				}
			}
		}
	}
	return{"startVertex": startVertex, "pathLengths": pathLengths, "predecessors": predecessors};

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

//to hold the original state of the sequence or edge mode
var stateOfDots = [];
var stateOfEdges = [];

//for sequence mode
var firstDotInSequence;
var firstDotSet = false;
var previousDotInSequence;
var currentDotInSequence;
//var indexOfCurrentDotInSequence;
var indexOfSelectedDot;

//for edge mode
var indicatedDots = [];
var haveDotsBeenSelected = false;

//toggle ability with control click

c.onmousedown = function(e){
    if(sequenceMode){
    	var coords = canvas.relMouseCoords(e);
	startLoc = {x: coords.x, y: coords.y};

	selectedDot = findSelectedDot(startLoc);
	indexOfSelectedDot = dots.indexOf(selectedDot);
    }
    else if(edgeMode){
    	var coords = canvas.relMouseCoords(e);
	startLoc = {x: coords.x, y: coords.y};

	drawing = true;

	selectedDot = findSelectedDot(startLoc);
    }
    else{
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
}
c.onmousemove = function(e){
    if(sequenceMode){
	    clearC();
	    var coords = canvas.relMouseCoords(e);

	    var dist = Math.pow(startLoc.x - currLoc.x, 2) + Math.pow(startLoc.y - currLoc.y, 2)
	    maxDist = (dist>maxDist) ? dist : maxDist

	    if(selectedDot){ //dragging a dot
	    	resetDots();
		resetEdges();

		selectedDot.c = "red";
		if(currLoc.x && currLoc.y){
		    var dx = coords.x - currLoc.x
		    var dy = coords.y - currLoc.y
		    moveSelected(dx, dy)
		}
		currLoc = {x:coords.x, y:coords.y}
	    }

	    drawCanvas();
    }
    else if(edgeMode){
	    clearC();
	    var coords = canvas.relMouseCoords(e);

	    var dist = Math.pow(startLoc.x - currLoc.x, 2) + Math.pow(startLoc.y - currLoc.y, 2)
	    maxDist = (dist>maxDist) ? dist : maxDist

	    if(selectedDot){
	    	resetDots();
		resetEdges();
		selectedDot.c = "red";
		if(currLoc.x && currLoc.y){
		    var dx = coords.x - currLoc.x
		    var dy = coords.y - currLoc.y
		    moveSelected(dx, dy)
		}
		currLoc = {x:coords.x, y:coords.y}
	    }
	    else if(drawing){
		currLoc = {x:coords.x, y:coords.y}
		drawTwoPointRect(startLoc, currLoc)
	    }
	    drawCanvas();
    }
    else{
	    clearC();
	    var coords = canvas.relMouseCoords(e);

	    var dist = Math.pow(startLoc.x - currLoc.x, 2) + Math.pow(startLoc.y - currLoc.y, 2)
	    maxDist = (dist>maxDist) ? dist : maxDist

	    //check to see if mouse is over a dot or edge, then display text box with properties
	    var drawDotsLater = false;
	    var drawEdgesLater = false;
	    if(mouseOverDot(coords)){
		drawDotsLater = true;
	    }
	    else if(mouseOverEdge(coords)){
		drawEdgesLater = true;
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
			edges[indexOfLine].curve = "yes";
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

	    //drawing properties if needed
	    if(drawDotsLater){
		displayDotProperties(coords, mouseOverDot(coords));
	    }
	    else if(drawEdgesLater){
		displayEdgeProperties(coords, mouseOverEdge(coords));
	    }    
    }
}
c.onmouseup = function(e){
	if(sequenceMode){
		var coords = canvas.relMouseCoords(e);
		finalLoc = {x:coords.x, y:coords.y};
		if(maxDist < 75 && !selectedDot){ //just clicked
		    clearC()
		    resetDots()
		    resetEdges()
		    dots.push({x:coords.x, y:coords.y, r:RADIUS, c:"red"})
		    if(firstDotSet){
		    	previousDotInSequence = currentDotInSequence;
			currentDotInSequence = dots.length - 1;
			//indexOfCurrentDotInSequence = dots.length - 1;
		    }
		    else{
		    	firstDotInSequence = dots.length - 1;
			currentDotInSequence = dots.length - 1;
			//indexOfCurrentDotInSequence = firstDotInSequence;
			firstDotSet = true;
		    }
		    drawCanvas()
		}
		else if(maxDist < 75 && selectedDot){
			clearC()
			if(firstDotSet){
				previousDotInSequence = currentDotInSequence;
				currentDotInSequence = indexOfSelectedDot;
				//indexOfCurrentDotInSequence = indexOfSelectedDot;
			}
			else{
				firstDotInSequence = indexOfSelectedDot;
				currentDotInSequence = indexOfSelectedDot;
				//indexOfCurrentDotInSequence = firstDotInSequence;
				firstDotSet = true;
			}
			selectedDot.c = "red";
			drawCanvas()
		}
		else{ //dragged over
		    clearC()
		    //convertDots(startLoc, finalLoc)
		    resetDots();
		    resetEdges();
		    
		    if(firstDotSet){
		    	previousDotInSequence = currentDotInSequence;
			currentDotInSequence = indexOfSelectedDot;
			//indexOfCurrentDotInSequence = indexOfSelectedDot;
		    }
		    else{
		    	firstDotInSequence = indexOfSelectedDot;
			currentDotInSequence = selectedDot;
			//indexOfCurrentDotInSequence = firstDotInSequence;
			firstDotSet = true;
		    }
		    selectedDot.c = "red";
		    drawCanvas()
		}

		console.log(dots);

		console.log(previousDotInSequence);
		console.log(currentDotInSequence);

		//Sequence mode
		if(currentDotInSequence == firstDotInSequence && previousDotInSequence){ //initial vertex reached
			edges.push({di1:previousDotInSequence, di2:currentDotInSequence, c:"blue", size:EDGEWIDTH});
			sequenceMode = false;
			firstDotSet = false;
			previousDotInSequence = undefined;
			console.log("exiting sequence mode");
		}
		else if(previousDotInSequence){
			//create edge between currentDot and previousDot
			edges.push({di1:previousDotInSequence, di2:currentDotInSequence, c:"blue", size:EDGEWIDTH});
		}
		clearC();
		drawCanvas();

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
	else if(edgeMode){
		var coords = canvas.relMouseCoords(e);
		finalLoc = {x:coords.x, y:coords.y};

		if(maxDist < 75 && !selectedDot){
			clearC();
			resetDots();
			resetEdges();
			dots.push({x:coords.x, y:coords.y, r:RADIUS, c:"red"});
			if(haveDotsBeenSelected){
				var selectedVertices = [];
				var tempSelectedDotIndex = dots.length - 1;
				selectedVertices.push(tempSelectedDotIndex);
				//toggle edges
				toggleEdgesInEdgeMode(indicatedDots, selectedVertices);
				//reset things
				haveDotsBeenSelected = false;
				indicatedDots = [];
			}
			else{
				var tempDotIndex = dots.length - 1;
				indicatedDots.push(tempDotIndex);
				haveDotsBeenSelected = true;
			}
			drawCanvas();
		}
		else if(maxDist < 75 && selectedDot){
			clearC();
			resetDots();
			resetEdges();
			if(haveDotsBeenSelected){
				var selectedVertices = [];
				var tempSelectedDotIndex = dots.indexOf(selectedDot);
				selectedVertices.push(tempSelectedDotIndex);
				toggleEdgesInEdgeMode(indicatedDots, selectedVertices);

				haveDotsBeenSelected = false;
				indicatedDots = [];
			}
			else{
				var tempDotIndex = dots.indexOf(selectedDot);
				indicatedDots.push(tempDotIndex);
				haveDotsBeenSelected = true;
			}
			selectedDot.c = "red";
			drawCanvas();
		}
		else{
		    clearC()

		    convertDots(startLoc, finalLoc)

		    if(haveDotsBeenSelected){
		    	var selectedVertices = [];
			for(var i = 0; i < dots.length; i++){
				if(dots[i].c == "red"){
					selectedVertices.push(i);
				}
			}
			toggleEdgesInEdgeMode(indicatedDots, selectedVertices);

			haveDotsBeenSelected = false;
			indicatedDots = [];
		    }
		    else{
		    	for(var i = 0; i < dots.length; i++){
				if(dots[i].c == "red"){
					indicatedDots.push(i);
				}
			}
			haveDotsBeenSelected = true;
		    }
		    drawCanvas()
		}

		clearC();
		drawCanvas();

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
	else{
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
}
