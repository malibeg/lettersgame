

//               ||           ||  o | |
//       _o_,_\ ,;:   .'_o_\ ,;:  (_|_;:  _o_,_,_,_;
//      (  ..  /     (_)    /            (        .


if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str) {
        return this.indexOf(str) == 0;
    };
}


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
    this.fill = "#FFFFFF";
    this.showtime = 0;
    this.decrement = 1;
    this.font = "200% Helvetica";
    this.textAlign = "center";
    this.textBaseline = "middle";
    // IF AN OBJECT WAS PASSED THEN INITIALISE PROPERTIES FROM THAT OBJECT
    for (var prop in obj) this[prop] = obj[prop];
}


Message.prototype.draw = function (ctx) {
    if (this.showtime > 0) {
        var message = this.message;
        if (message.startsWith('heart')) {
            ctx.fillStyle = this.fill;
            ctx.beginPath();
            ctx.moveTo(75, 40);
            ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
            ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
            ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
            ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
            ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
            ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
            ctx.fill();
            ctx.fillStyle = this.fill;
            ctx.font = this.font;
            ctx.textAlign = this.textAlign;
            ctx.textBaseline = this.textBaseline;
            var misses = this.message.slice(5);
            if (misses.length > 0) {
                message = 'Broj promašaja: ' + misses;
            } else {
                message = '';
            }
        } else if (message === 'bravo' || message == 'greška') {
            ctx.strokeStyle = this.fill;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle

            if (message === 'bravo') {
                // smile
                ctx.moveTo(110, 75);
                ctx.arc(75, 75, 35, 0, Math.PI, false);   // Mouth (clockwise)
                message = "BRAVO!";
            } else {
                // sad face
                ctx.moveTo(100, 100);
                ctx.lineTo(60, 100);  // Mouth
                message = "Greška!";
            }
            ctx.moveTo(65, 65);
            ctx.arc(60, 65, 5, 0, Math.PI * 2, true);  // Left eye
            ctx.moveTo(95, 65);
            ctx.arc(90, 65, 5, 0, Math.PI * 2, true);  // Right eye
            ctx.stroke();

        }

        ctx.fillStyle = this.fill;
        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.fillText(message, 200, 200);

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
    clickcolor: '#9999FF',
    oddfieldcolor: '#BBFFBB',
    pairfieldcolor: '#333333',
    misscolor: '#EE3333'
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
    this.lastPt = null;
    this.isCompleted = false;

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

    this.infomessage = new Message({
        message: "Nacrtaj ovo slovo: ",
        showtime: 5
    });

    canvas.addEventListener('mousedown', function (event) { self.drawmousedown(event); }, true);
    canvas.addEventListener("touchmove", function (event) { self.drawtouchmove(event); }, false);
    canvas.addEventListener("touchend", function (event) { self.drawtouchend(event); }, false);
    canvas.addEventListener('mouseup', function (event) { self.drawmouseup(event); }, true);
    canvas.addEventListener('mousemove', function (event) { self.drawmousemove(event); }, true);
    setInterval(function () { self.drawShapes(self.ctx); }, self.interval);
    //(self.drawShapes(self.ctx));
}



MyCanvas.prototype.drawtouchmove = function (e) {
    e.preventDefault();
    var canvas = this.canvas;
    // correct position
    var mouse = {
        x: event.touches[0].pageX - canvas.offsetLeft,
        y: event.touches[0].pageY - canvas.offsetTop
    };

    var lastPt = this.lastPt;
    if (lastPt != null) {
        var x = Math.floor(mouse.x / this.rectSize);
        var y = Math.floor(mouse.y / this.rectSize);
        if (x >= 0 && x < this.rectNum && y >= 0 && y < this.rectNum) {
            var index = y + x * this.rectNum;
            var selectedRect = this.shapes[index];
            this.setcellcolor(selectedRect, index);
        }
    }
    this.lastPt = { x: mouse.x, y: mouse.y };
};

MyCanvas.prototype.setcellcolor = function (cell, index) {
    if (this.currLetter[index].fill !== constants.lettercolor && this.currLetter[index].fill !== constants.clickcolor) {
        if (cell.fill != constants.misscolor) { //  do not color or alarm if already red
            cell.fill = constants.misscolor;
            document.getElementById("messages").innerHTML = "Prati zelenu boju!";
            this.infomessage = new Message({
                message: "greška",
                showtime: 10,
                fill: '#FF0000'
            });
        }
    } else {
        cell.fill = constants.clickcolor;
    }
}

MyCanvas.prototype.drawtouchend = function (e) {
    e.preventDefault();
    // Terminate touch path
    this.lastPt = null;
    this.movefinished();
};


MyCanvas.prototype.drawmousedown = function (e) {
    var mouse = this.getMouse(e);
    var x = Math.floor(mouse.x / this.rectSize);
    var y = Math.floor(mouse.y / this.rectSize);
    this.infomessage = new Message({
        message: "",
        showtime: 0
    });
    if (x >= 0 && x < this.rectNum && y >= 0 && y < this.rectNum) {
        var index = y + x * this.rectNum;
        var selectedRect = this.shapes[index];
        // in case of right click delete cell
        if (e.which === 3 || e.button === 2) {
            selectedRect.fill = this.background.getcolor(x, y);
            e.preventDefault();
            e.preventBubble = true;
            return false;
        } else {
            this.setcellcolor(selectedRect, index);
        }
        this.dragging = true;
    }

};

MyCanvas.prototype.drawmouseup = function (e) {
    this.dragging = false;
    this.movefinished();
};

MyCanvas.prototype.movefinished = function () {
    var done = true;
    var miss = 0;
    var bgletter = this.background.letter;
    if (bgletter !== null) {
        for (var i = 0; i < bgletter.length; i++) {
            var cellColor = this.shapes[i].fill;
            if (bgletter[i].fill !== cellColor) {
                if (bgletter[i].fill !== constants.lettercolor) {
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
            this.infomessage = new Message({
                message: "heart" + miss,
                showtime: 15
            });
        } else {
            document.getElementById("messages").innerHTML = "BRAVO!!!!!";
            this.infomessage = new Message({
                message: "bravo",
                showtime: 15,
                font: "200% Helvetica"
            });
        }
        this.reset(false);
    } else if (this.infomessage.message !== 'greška') { // initialize with below code at beggining to get rid from if statement
        this.infomessage = new Message({
            message: "heart",
            showtime: 10
        });
    }
}

MyCanvas.prototype.drawmousemove = function (e) {
    if (this.dragging) {
        var mouse = this.getMouse(e);
        var x = Math.floor(mouse.x / this.rectSize);
        var y = Math.floor(mouse.y / this.rectSize);
        if (x >= 0 && x < this.rectNum && y >= 0 && y < this.rectNum) {
            var index = y + x * this.rectNum;
            var selectedRect = this.shapes[index];
            this.setcellcolor(selectedRect, index);
        }
    }
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
    if (this.infomessage != null && this.infomessage.message) {
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


function MyApp(width, hight) {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.rectNum = 10;
    this.rectSize = 60;
    if (width !== 0 && hight !== 0) {
        if (width > hight) {
            this.rectSize = Math.floor(hight / (this.rectNum + 1));
        } else {
            this.rectSize = Math.floor(width / (this.rectNum + 1));
        }
    }

    this.shapes = [];
    this.canvas.width = this.rectNum * this.rectSize;
    this.canvas.height = this.rectNum * this.rectSize;
    this.mycanvashandler = new MyCanvas(this.canvas,
        this.ctx,
        100,
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
    var shapesJSON = JSON.parse(letters['A']);
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
    var w = window.innerWidth || 0;
    var h = window.innerHeight || 0;
    thegameapp = new MyApp(w, h);
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
    B: '[{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"}]',
    C: '[{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"}]',
    Č: '[{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#00CC99"},{"fill":"#00CC99"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"},{"fill":"#333333"},{"fill":"#BBFFBB"}]'
};
























