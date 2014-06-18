

LetterGame = function (letterGame) {

     var CanvasManager = function(canvas, context, interval, rectNum, rectSize, currLeter) {
        this.canvas = canvas;
        this.ctx = context;
        this.interval = interval;
        this.rectNum = rectNum;
        this.rectSize = rectSize;
        this.dragging = false;
        this.currLetter = currLeter || {};
        this.shapes = [];
        this.infomessage = letterGame.message;
        this.infomessage.setup({
            message: "Nacrtaj ovo slovo: ",
            showtime: 5
        });
        this.background = letterGame.background;
        this.background.init({
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

        canvas.addEventListener('mousedown', function(event) { self.drawmousedown(event); }, true);
        canvas.addEventListener("touchmove", function(event) { self.drawtouchmove(event); }, false);
        canvas.addEventListener("touchend", function(event) { self.drawtouchend(event); }, false);
        canvas.addEventListener('mouseup', function(event) { self.drawmouseup(event); }, true);
        canvas.addEventListener('mousemove', function(event) { self.drawmousemove(event); }, true);
        setInterval(function() { self.drawShapes(self.ctx); }, self.interval);
    };

    // this sohould be seperate class
    CanvasManager.prototype.playthetune = function(control, element, sound) {
        var audioelem = document.getElementById(element);
        var path = 'slova/' + sound;
        audioelem.src = path;
        var audiocontrol = document.getElementById(control);
        audiocontrol.load();
        audiocontrol.play();
    };

    CanvasManager.prototype.drawtouchmove = function (e) {
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

    CanvasManager.prototype.setcellcolor = function(cell, index) {
        if (this.currLetter[index].fill !== letterGame.constants.lettercolor && this.currLetter[index].fill !== letterGame.constants.clickcolor) {
            if (cell.fill != letterGame.constants.misscolor) { //  do not color or alarm if already red
                cell.fill = letterGame.constants.misscolor;
                document.getElementById("messages").innerHTML = "Prati zelenu boju!";
                this.infomessage.setup({
                    message: "greška",
                    showtime: 10
                });
                this.playthetune('audioctrl2', 'mp3src', 'mistake1.mp3');
            }
        } else {
            cell.fill = letterGame.constants.clickcolor;
        }
    };

    CanvasManager.prototype.drawtouchend = function (e) {
        e.preventDefault();
        // Terminate touch path
        this.lastPt = null;
        this.movefinished();
    };


    CanvasManager.prototype.drawmousedown = function (e) {
        var mouse = this.getMouse(e);
        var x = Math.floor(mouse.x / this.rectSize);
        var y = Math.floor(mouse.y / this.rectSize);
        this.infomessage.setup({
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
            } else {
                this.setcellcolor(selectedRect, index);
            }
            this.dragging = true;
        }

    };

    CanvasManager.prototype.drawmouseup = function (e) {
        this.dragging = false;
        this.movefinished();
    };

    CanvasManager.prototype.movefinished = function() {
        var done = true;
        var miss = 0;
        var bgletter = this.background.getletter();
        if (bgletter !== null) {
            for (var i = 0; i < bgletter.length; i++) {
                var cellColor = this.shapes[i].fill;
                if (bgletter[i].fill !== cellColor) {
                    if (bgletter[i].fill !== letterGame.constants.lettercolor) {
                        miss++;
                    }
                } else if (bgletter[i].fill === letterGame.constants.lettercolor) {
                    done = false;
                }
            }
        }

        if (done) {
            if (miss > 0) {
                document.getElementById("messages").innerHTML = "BRAVO! Ali promašio si nekoliko polja: " + miss;
                this.infomessage.setup({
                    message: "heart" + miss,
                    showtime: 15
                });
                this.playthetune('audioctrl2', 'mp3src', 'bravo2.mp3');
            } else {
                document.getElementById("messages").innerHTML = "BRAVO!!!!!";
                this.infomessage.setup({
                    message: "bravo",
                    showtime: 15,
                    font: "200% Helvetica"
                });
                this.playthetune('audioctrl2', 'mp3src', 'bravo1.mp3');
            }
            this.reset(false);
        } else if (this.infomessage.getmessage() !== 'greška') { // initialize with below code at beggining to get rid from if statement
            this.infomessage.setup({
                message: "heart",
                showtime: 10
            });
            this.playthetune('audioctrl2', 'mp3src', 'mistake2.mp3');
        }
    };

    CanvasManager.prototype.drawmousemove = function(e) {
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
    };

    // Creates an object with x and y defined, set to the mouse position relative to the state's canvas
    // If you wanna be super-correct this can be tricky, we have to worry about padding and borders
    CanvasManager.prototype.getMouse = function(e) {
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
    };

    CanvasManager.prototype.drawShapes = function () {
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
        if (this.infomessage != null && this.infomessage.getmessage()) {
            this.infomessage.draw(this.ctx);
        }
    };

    CanvasManager.prototype.reset = function (clear) {
        if (clear === true) {
            this.background.init({
                letter: null
            });
        } else {
            this.background.init({
                letter: this.currLetter
            });
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


    CanvasManager.prototype.generateShapes = function () {
        for (var i = 0; i < this.rectNum; i = i + 1) {
            for (var j = 0; j < this.rectNum; j = j + 1) {
                var color = this.background.getcolor(i, j);
                this.shapes.push(letterGame.rectangle({
                    x: i * this.rectSize,
                    y: j * this.rectSize,
                    w: this.rectSize,
                    h: this.rectSize,
                    fill: color
                }));
            }
        }
    };

    letterGame.CanvasManager = CanvasManager;
    return letterGame;
}(LetterGame)