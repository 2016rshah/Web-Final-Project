function connectEdges(){
	//find the dots that are selected
	var selectedDots = [];
	for(var i = 0; i < dots.length; i++){
		if(dots[i].c == "red"){ selectedDots.push(dots[i]) }
	}
	
	//draws lines between selected dots
	for(var i = 0; i < selectedDots.length; i++){
		for(var j = i; j < selectedDots.length; j++){
			ctx.beginPath();
			ctx.moveTo(selectedDots[i].x, selectedDots[i].y);
			ctx.lineTo(selectedDots[j].x, selectedDots[j].y);
			ctx.stroke();

			//adds to edge object array
			edges.push({di1:i, di2:j, c:"red"});
		}
	}
}

function clearEdges(){
}

function toggleEdges(){
}
