function connectEdges(){
	var selectedDots = [];
	for(var i = 0; i < dots.length; i++){
		if(dots[i].c == "red"){ selectedDots.push(dots[i]) }
	}

	for(var i = 0; i < selectedDots.length; i++){
		for(var j = i; j < selectedDots.length; j++){
			ctx.beginPath();
			ctx.moveTo(selectedDots[i].x, selectedDots[i].y);
			ctx.lineTo(selectedDots[j].x, selectedDots[j].y);
			ctx.stroke();
		}
	}
}

function clearEdges(){
}

function toggleEdges(){
}
