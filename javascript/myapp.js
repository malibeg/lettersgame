

// Constructor for Rectangle objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.
function Rectangle(obj) {
    this.x = 0;
    this.y = 0;
    this.w = 1;
    this.h = 1;
    this.fill = '#AAAAAA';
    this.selected = false;

    // IF AN OBJECT WAS PASSED THEN INITIALISE PROPERTIES FROM THAT OBJECT
    for (var prop in obj) this[prop] = obj[prop];
}

// Draws this Rectangle to a given context
Rectangle.prototype.draw = function (ctx) {
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.w, this.h);
};


function Background(obj) {
    this.col1 = '#BBFFBB';
    this.col2 = '#333333';
    this.letter = {};
    this.rectNum = 1;
    for (var prop in obj) this[prop] = obj[prop];
};

// Get cell color
Background.prototype.getcolor = function (col, row) {
    var color = '#333333';
    if (this.letter == null) {
        if (((col + row) % 2) === 0) {
            color = '#BBFFBB';
        }
    } else {
        var index = col + row * this.rectNum;
        color = this.letter[index].fill;
    }

    return color;
};


function MyCanvas(canvas, context, interval, rectNum, rectSize, currLeter) {
    this.canvas = canvas;
    this.ctx = context;
    this.interval = interval;
    this.rectNum = rectNum;
    this.rectSize = rectSize;
    this.dragging = false;
    this.currLetter = currLeter || {};
    this.shapes = [];
    this.background = new Background({
        letter: this.currLetter,
        rectNum : rectNum
    });
    this.generateShapes();

    // This complicates things a little but but fixes mouse co-ordinate problems
    // when there's a border or padding. See getMouse for more detail
    if (document.defaultView && document.defaultView.getComputedStyle) {
        this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10) || 0;
        this.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10) || 0;
        this.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
        this.styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10) || 0;
    }
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;

    var self = this;

    canvas.addEventListener('mousedown', function (e) {
        var mouse = self.getMouse(e);
        var x = Math.floor(mouse.x / self.rectSize);
        var y = Math.floor(mouse.y / self.rectSize);

        if (x >= 0 && x < self.rectNum && y >= 0 && y < self.rectNum) {

            var selectedRect = self.shapes[y + x * self.rectNum];
            // in case of right click delete cell
            if (e.which === 3 || e.button === 2) {
                selectedRect.fill = self.background.getcolor(x, y);
                e.preventDefault();
                e.preventBubble = true;
                return false;
            } else {
                selectedRect.fill = '#ff0000';
            }
            self.dragging = true;
        }


    }, true);
    canvas.addEventListener('mouseup', function (e) {
        self.dragging = false;
    }, true);

    canvas.addEventListener('mousemove', function (e) {
        if (self.dragging) {
            var mouse = self.getMouse(e);
            var x = Math.floor(mouse.x / self.rectSize);
            var y = Math.floor(mouse.y / self.rectSize);
            if (x >= 0 && x < self.rectNum && y >= 0 && y < self.rectNum) {
                var selectedRect = self.shapes[y + x * self.rectNum];
                selectedRect.fill = '#AA0000';
            }
        }
    }, true);
    setInterval(function () { self.drawShapes(self.ctx); }, self.interval);
}

// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
MyCanvas.prototype.getMouse = function (e) {
    var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

    // Compute the total offset
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar
    offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    // We return a simple javascript object (a hash) with x and y defined
    return { x: mx, y: my };
}

MyCanvas.prototype.drawShapes = function () {
    // draw all shapes
    var shapes = this.shapes;
    var l = shapes.length;
    for (var i = 0; i < l; i++) {
        var shape = shapes[i] || [];
        // We can skip the drawing of elements that have moved off the screen:
        //if (shape.x > this.width || shape.y > this.height ||
        //    shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
        shapes[i].draw(this.ctx);
    }
};

MyCanvas.prototype.reset = function () {
    var shapes = this.shapes;
    var l = shapes.length;
    for (var i = 0; i < l; i++) {
        var shape = shapes[i] || [];
        var row = Math.floor(i / this.rectNum);
        var col = i - row * this.rectNum;
        shape.fill = this.background.getcolor(col, row);;
    }
}

function MyApp() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.rectNum = 10;
    this.rectSize = 30;
    this.shapes = [];
    this.canvas.width = this.rectNum * this.rectSize;5
    this.canvas.height = this.rectNum * this.rectSize;
    var letter = JSON.parse(letterA);
    this.mycanvashandler = new MyCanvas(this.canvas, this.ctx, 200, this.rectNum, this.rectSize, letter);
}

MyCanvas.prototype.generateShapes = function () {
    for (var i = 0; i < this.rectNum; i = i + 1) {
        for (var j = 0; j < this.rectNum; j = j + 1) {
            var color = this.background.getcolor(i, j);
            this.shapes.push(new Rectangle({ x:i * this.rectSize,
                y:j * this.rectSize, 
                w:this.rectSize, 
                h:this.rectSize,
                fill:color}));
        }
    }
}

MyApp.prototype.reset = function () {
    this.mycanvashandler.reset();
}

MyApp.prototype.exportDrawing = function() {
    console.log(JSON.stringify(this.mycanvashandler.shapes, ['fill']));
    


    var shapesJSON = JSON.parse(letterA);
    var len = shapesJSON.length;
    if (len === this.mycanvashandler.shapes.length) {
        for (var i = 0; i < len; i++) {
            this.mycanvashandler.shapes[i].fill = shapesJSON[i].fill;
        }
    }
    //var shapes = [];
    //var rectSize = this.mycanvashandler.rectSize;
    //shapesJSON.forEach(function (element) {
    //    element.h = rectSize;
    //    element.w = rectSize;
    //    shapes.push(new Rectangle(element));
    //});
    //this.mycanvashandler.shapes = shapes;
}


function init() {
    app = new MyApp();
}

function reset() {
    app.reset();
}

function exportDrawing() {
    app.exportDrawing();
}

var letterA = '[{ "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#333333" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#BBFFBB" }, { "fill": "#00CC99" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#00CC99" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#00CC99" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#333333" }, { "fill": "#00CC99" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#BBFFBB" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }]';