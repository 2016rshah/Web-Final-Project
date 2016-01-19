//EDGES NOT COMPATIBLE WITH UNDO/REPLAY

function connectEdges(){
	//find the dots that are selected
	var selectedDots = [];
	var selectedDotsIndices = [];
	for(var i = 0; i < dots.length; i++){
		if(dots[i].c == "red"){
			selectedDots.push(dots[i]);
			selectedDotsIndices.push(i);
		}
	}
	
	//draws lines between selected dots
	for(var i = 0; i < selectedDots.length; i++){
		for(var j = i+1; j < selectedDots.length; j++){
			//need to make sure the edges have not been drawn yet
			if(notInEdgesYet(i, j, selectedDotsIndices) == -1){
				//ctx.beginPath();
				//ctx.moveTo(selectedDots[i].x, selectedDots[i].y);
				//ctx.lineTo(selectedDots[j].x, selectedDots[j].y);
				//ctx.stroke();
	
				//adds to edge object array
				edges.push({di1:selectedDotsIndices[i], di2:selectedDotsIndices[j], c:"red", size:EDGEWIDTH});
			}
		}
	}
	console.log(edges);
	clearC();
	drawCanvas();
}

function notInEdgesYet(i1, i2, selectedDotsIndices){
	for(var i = 0; i < edges.length; i++){
		if(edges[i].di1 == selectedDotsIndices[i1] && edges[i].di2 == selectedDotsIndices[i2]){
			return i;
		}
		if(edges[i].di1 == selectedDotsIndices[i2] && edges[i].di2 == selectedDotsIndices[i1]){
			return i;
		}
	}
	return -1;
}

function clearEdges(){
	//find the dots that are selected
	var selectedDotsIndices = [];
	for(var i = 0; i < dots.length; i++){
		if(dots[i].c == "red"){
			selectedDotsIndices.push(i);
		}
	}
	
	//clear the ones that are in the edge array
	for(var i = 0; i < edges.length; i++){
		//remove if the two dots are selected
		if(selectedDotsIndices.indexOf(edges[i].di1) != -1 && selectedDotsIndices.indexOf(edges[i].di2) != -1){
			edges.splice(i, 1);
			i--;
		}
	}
	console.log(edges);
	clearC();
	drawCanvas();
}

function toggleEdges(){
	//find the dots that are selected
	var selectedDots = [];
	var selectedDotsIndices = [];
	for(var i = 0; i < dots.length; i++){
		if(dots[i].c == "red"){
			selectedDots.push(dots[i]);
			selectedDotsIndices.push(i);
		}
	}

	//draws lines between ones without lines, otherwise clears
	for(var i = 0; i < selectedDots.length; i++){
		for(var j = i+1; j < selectedDots.length; j++){
			//need to make sure the edges have not been drawn yet
			if(notInEdgesYet(i, j, selectedDotsIndices) == -1){
				//adds to edge object array
				edges.push({di1:selectedDotsIndices[i], di2:selectedDotsIndices[j], c:"red"});
			}
			else{
				edges.splice(notInEdgesYet(i, j, selectedDotsIndices), 1);
			}
		}
	}
	console.log(edges);
	clearC();
	drawCanvas();
	
}

