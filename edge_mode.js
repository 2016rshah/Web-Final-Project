function connectEdges(){
	edges = [];

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
			ctx.beginPath();
			ctx.moveTo(selectedDots[i].x, selectedDots[i].y);
			ctx.lineTo(selectedDots[j].x, selectedDots[j].y);
			ctx.stroke();

			//adds to edge object array
			edges.push({di1:selectedDotsIndices[i], di2:selectedDotsIndices[j], c:"red"});
		}
	}
	console.log(edges);
}

function clearEdges(){
}

function toggleEdges(){
}
