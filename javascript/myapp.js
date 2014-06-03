

//               ||           ||  o | |
//       _o_,_\ ,;:   .'_o_\ ,;:  (_|_;:  _o_,_,_,_;
//      (  ..  /     (_)    /            (        .


/// RECTANGLE OBJECT

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


///   MESSAGE OBJECT

function Message(obj) {
    this.message = "";
    this.fill = "blue";
    this.showtime = 0;
    this.decrement = 1;
    this.font = "40pt Helvetica";
    this.textAlign = "center";
    this.textBaseline = "middle";
    // IF AN OBJECT WAS PASSED THEN INITIALISE PROPERTIES FROM THAT OBJECT
    for (var prop in obj) this[prop] = obj[prop];
}


Message.prototype.draw = function (ctx) {
    if (this.showtime > 0) {
        ctx.fillStyle = this.fill;
        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.fillText(this.message, 150, 100);
        this.showtime--;
    }
};

/// BACKGROUND OBJECT

// This class calculates color of background cell
function Background(obj) {
    this.col1 = '#BBFFBB';
    this.col2 = '#333333';
    this.letter = {};
    this.rectNum = 1;
    for (var prop in obj) this[prop] = obj[prop];
};

// Get cell color
Background.prototype.getcolor = function (col, row) {
    var color = constants.pairfieldcolor;
    if (this.letter == null) {
        if (((col + row) % 2) === 0) {
            color = constants.oddfieldcolor;
        }
    } else {
        var index = row + col * this.rectNum;
        color = this.letter[index].fill;
    }

    return color;
};




var constants = {
    lettercolor: '#00CC99',
    clickcolor: '#EE3333',
    oddfieldcolor: '#BBFFBB',
    pairfieldcolor: '#333333',
    misscolor: '#9999FF'
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
    this.infomessage = {};
    this.background = new Background({
        letter: this.currLetter,
        rectNum: rectNum
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
                selectedRect.fill = constants.clickcolor;
            }
            self.dragging = true;
        }


    }, true);
    canvas.addEventListener('mouseup', function (e) {
        self.dragging = false;
        var done = true;
        var miss = 0;
        var bgletter = self.background.letter;
        if (bgletter !== null) {
            for (var i = 0; i < bgletter.length; i++) {
                var cellColor = self.shapes[i].fill;
                if (bgletter[i].fill !== cellColor) {
                    if (bgletter[i].fill !== constants.lettercolor) {
                        self.shapes[i].fill = constants.misscolor;
                        miss++;
                    }
                } else if (bgletter[i].fill === constants.lettercolor) {
                    done = false;
                }
            }
        }

        if (done) {
            if (miss > 0) {
                document.getElementById("messages").innerHTML = "BRAVO! Ali promašio si nekoliko polja: " + miss;
                //alert("BRAVO! Ali promašio si nekoliko polja: " + miss);
            } else {
                document.getElementById("messages").innerHTML = "BRAVO MAJSTORE/ICE !!!!!";
                self.infomessage = new Message({
                    message: "BRAVO!!!!!",
                    showtime: 100});
            }
            //this.reset();
        } else {
            document.getElementById("messages").innerHTML = "Potrudi se još malo i nauči pisati ovo slovo!";
            //alert("Potrudi se još malo i nauči pisati ovo slovo!");
        }
    }, true);

    canvas.addEventListener('mousemove', function (e) {
        if (self.dragging) {
            var mouse = self.getMouse(e);
            var x = Math.floor(mouse.x / self.rectSize);
            var y = Math.floor(mouse.y / self.rectSize);
            if (x >= 0 && x < self.rectNum && y >= 0 && y < self.rectNum) {
                var selectedRect = self.shapes[y + x * self.rectNum];
                selectedRect.fill = constants.clickcolor;
            }
        }
    }, true);
    setInterval(function () { self.drawShapes(self.ctx); }, self.interval);
    //(self.drawShapes(self.ctx));
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
    if (this.infomessage !=  null && this.infomessage.message) {
        this.infomessage.draw(this.ctx);
    }
};

MyCanvas.prototype.reset = function (clear) {
    if (clear === true) {
        this.background.letter = null;
    } else {
        this.background.letter = this.currLetter;
    }
    var shapes = this.shapes;
    var l = shapes.length;
    for (var i = 0; i < l; i++) {
        var shape = shapes[i] || [];
        var row = Math.floor(i / this.rectNum);
        var col = i - row * this.rectNum;
        shape.fill = this.background.getcolor(row, col);;
    }
};


MyCanvas.prototype.generateShapes = function () {
    for (var i = 0; i < this.rectNum; i = i + 1) {
        for (var j = 0; j < this.rectNum; j = j + 1) {
            var color = this.background.getcolor(i, j);
            this.shapes.push(new Rectangle({
                x: i * this.rectSize,
                y: j * this.rectSize,
                w: this.rectSize,
                h: this.rectSize,
                fill: color
            }));
        }
    }
};


function MyApp() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.rectNum = 10;
    this.rectSize = 30;
    this.shapes = [];
    this.canvas.width = this.rectNum * this.rectSize;
    this.canvas.height = this.rectNum * this.rectSize;
    this.mycanvashandler = new MyCanvas(this.canvas,
        this.ctx,
        200,
        this.rectNum,
        this.rectSize,
        JSON.parse(letters.A));
}

MyApp.prototype.reset = function (clear) {
    this.mycanvashandler.reset(clear);
};

MyApp.prototype.letterChanged = function (letter) {
    // add setter for current letter TODO
    this.mycanvashandler.currLetter = letter;
    this.mycanvashandler.background.letter = letter;

    this.reset();
};

MyApp.prototype.exportDrawing = function () {
    // store grid to json and I need only
    console.log(JSON.stringify(this.mycanvashandler.shapes, ['fill']));


    // TEST of loading letters TODO delete this
    var shapesJSON = JSON.parse(letterA);
    var len = shapesJSON.length;
    if (len === this.mycanvashandler.shapes.length) {
        for (var i = 0; i < len; i++) {
            this.mycanvashandler.shapes[i].fill = shapesJSON[i].fill;
        }
    }

    // old shitty code (este'uza), but I learned a lot (how to load json array to objects with behaviour). So in respect of that I still keep it. (elham)
    //var shapes = [];
    //var rectSize = this.mycanvashandler.rectSize;
    //shapesJSON.forEach(function (element) {
    //    element.h = rectSize;
    //    element.w = rectSize;
    //    shapes.push(new Rectangle(element));
    //});
    //this.mycanvashandler.shapes = shapes;
};


var thgameapp = {};

function init() {
    thegameapp = new MyApp();
};

function reset(clear) {
    thegameapp.reset(clear);
};

function exportDrawing() {
    thegameapp.exportDrawing();
};

function letterChanged(value) {
    var letter = JSON.parse(letters[value]);
    thegameapp.letterChanged(letter);
};

var letters = {
    A: '[{ "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#333333" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#BBFFBB" }, { "fill": "#00CC99" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#00CC99" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#00CC99" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#333333" }, { "fill": "#00CC99" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#00CC99" }, { "fill": "#BBFFBB" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }, { "fill": "#333333" }, { "fill": "#BBFFBB" }]',
    B: '[{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"}]'
};
























