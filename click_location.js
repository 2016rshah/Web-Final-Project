//http://stackoverflow.com/a/5932203/3861396
function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var coords = {x:0, y:0}
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    coords.x = event.pageX - totalOffsetX;
    coords.y = event.pageY - totalOffsetY;

    return {x:coords.x, y:coords.y}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;