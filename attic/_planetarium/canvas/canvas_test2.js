import * as cv from "./canvas.js";

/*
draw.context.moveTo (0, 0);
draw.context.lineTo (200, 200);
draw.context.stroke ();
*/

var square = new cv.Square (100, 200, 10)
square.draw ()

var square2 = new cv.Square (100, 200, 5, "red")
square2.draw ()

var rectangle = new cv.Rectangle (201, 201, 10, 20)
rectangle.draw ()
