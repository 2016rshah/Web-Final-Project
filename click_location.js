//http://stackoverflow.com/a/5932203/3861396
function relMouseCoords(event){
	var rect = canvas.getBoundingClientRect();
	return{
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
															};
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
