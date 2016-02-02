document.onkeydown = function(e){
    if(e.keyCode == 27){ //escape
    	if(sequenceMode){
		console.log("escape");
		dots = [];
		edges = [];
		dots = stateOfDots.slice();
		edges = stateOfEdges.slice();
		stateOfDots = [];
		stateOfEdges = [];

		console.log(dots);
		console.log(edges);

		firstDotSet = false;
		previousDotInSequence = undefined;

		resetDots();
		resetEdges();

		clearC();
		drawCanvas();
		sequenceMode = false;
	}
	else if(edgeMode){
		console.log("escape");
		dots = [];
		edges = [];
		dots = stateOfDots.slice();
		edges = stateOfEdges.slice();
		stateOfDots = [];
		stateOfEdges = [];

		indicatedDots = [];
		haveDotsBeenSelected = false;

		resetDots();
		resetEdges();

		clearC();
		drawCanvas();
		edgeMode = false;
	}
	else{
		clearC()
        	resetDots()
		resetEdges();
        	drawCanvas()
	}
    }
    else if(KEY_MAP[e.keyCode]){
        clearC()
        // moveDots(KEY_MAP[e.keyCode])

        var dx = 0
        var dy = 0
        direction = KEY_MAP[e.keyCode]
        if(direction == "left")
            dx = -1
        else if(direction == "right")
            dx = 1
        else if(direction == "up")
            dy = -1
        else if(direction == "down")
            dy = 1

        moveSelected(dx, dy)

        var selected = []
        for(var i = 0; i<dots.length; i++){
            if(dots[i].c == "red"){ selected.push(dots[i]) }
        }
        pastActions.push({"type":"move", "dots":selected, "dx": dx, "dy": dy})
        console.log(pastActions)

        drawCanvas()
    }
    else if(e.keyCode == 189){ //minus pressed
        if(e.altKey){
            RADIUS--;
        }
        else{
            clearC()
            for(var i = 0; i<dots.length; i++){
                if(dots[i].c == "red")
                    dots[i].r--;
            }
            drawCanvas()
        }
    }
    else if(e.keyCode == 187 && e.shiftKey){ //plus pressed
        if(e.altKey){
            RADIUS++;
        }
        else{
            clearC()
            for(var i = 0; i<dots.length; i++){
                if(dots[i].c == "red")
                    dots[i].r++;
            }
            drawCanvas()
        }
    }
    else if(e.keyCode == 69 && e.shiftKey){ //E pressed
    	//if(edgeMode){
    	connectEdges();
	//}
    }
    else if(e.keyCode == 67 && e.shiftKey){ //C pressed
    	//if(edgeMode){
    	clearEdges();
	//}
    }
    else if(e.keyCode == 84 && e.shiftKey){ //T pressed
    	//if(edgeMode){
    	toggleEdges();
	//}
    }
    else if(e.keyCode == 81){ //q pressed
    	if(edgeMode){
		console.log("exited edge mode");
		edgeMode = false;
	}
	if(sequenceMode){
		console.log("exited sequence mode");
		sequenceMode = false;
	}
    }
    else if(e.keyCode == 46){ //delete key pressed
    	deleteSelectedEdges();
    }
}
