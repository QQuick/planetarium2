var canvas = document.getElementById ("canvas");
var context = canvas.getContext ("2d");

export class Square {
    x;
    y;
    width;
    color;

    constructor (x, y, width, color = "black") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.color = color;
    }

    draw () {
        context.fillStyle = this.color;
        context.fillRect (canvas.width / 2 + this.x - this.width / 2, canvas.height / 2 - this.y - this.width / 2, this.width, this.width);
    }
}

export class Rectangle extends Square {
    height;

    constructor (x, y, width, height, color = "black") {
        super (x, y, width, color);
        this.height = height;
    }

    draw () {
        context.fillStyle = this.color;
        context.fillRect (canvas.width / 2 + this.x - this.width / 2, canvas.height / 2 - this.y - this.height / 2, this.width, this.height);
    }
}


