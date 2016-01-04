document.onkeydown = function(e){
    if(e.keyCode == 27){ //escape
        clearC()
        resetDots()
        drawDots()
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

        drawDots()
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
            drawDots()
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
            drawDots()
        }
    }
}