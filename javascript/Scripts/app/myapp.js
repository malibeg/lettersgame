

//               ||           ||  o | |
//       _o_,_\ ,;:   .'_o_\ ,;:  (_|_;:  _o_,_,_,_;
//      (  ..  /     (_)    /            (        .


if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str) {
        return this.indexOf(str) === 0;
    };
}

var LetterGame = LetterGame || {};

function init() {
    var w = window.innerWidth || 0;
    var h = window.innerHeight || 0;

    LetterGame.game = function (CanvasManager, canvas) {

        var priv = {};
        priv.canvas = canvas
        priv.ctx = canvas.getContext("2d");
        priv.rectNum = 10;
        priv.rectSize = 60;

        priv.shapes = [];


        var pub = {};

        pub.start = function (width, hight) {
            if (width !== 0 && hight !== 0) {
                if (width > hight) {
                    priv.rectSize = Math.floor(hight / (priv.rectNum + 2));
                } else {
                    priv.rectSize = Math.floor(width / (priv.rectNum + 2));
                }
            }

            priv.canvas.width = priv.rectNum * priv.rectSize;
            priv.canvas.height = priv.rectNum * priv.rectSize;
            priv.canvasmgr = new CanvasManager(priv.canvas,
                priv.ctx,
                100,
                priv.rectNum,
                priv.rectSize,
                JSON.parse(LetterGame.letters.A));

            document.getElementById('audioctrl').play();
        };

        pub.reset = function (clear) {
            priv.canvasmgr.reset(clear);
        };

        pub.letterChanged = function (letter, lettergrid) {
            // add setter for current letter TODO
            priv.canvasmgr.currLetter = lettergrid;
            priv.canvasmgr.background.init({
                letter: lettergrid
            });
            priv.canvasmgr.playthetune('audioctrl', 'audioslovo', letter + '1.mp3');
            pub.reset();
        };

        pub.exportDrawing = function () {
            // store grid colors to json
            console.log(JSON.stringify(priv.canvasmgr.shapes, ['fill']));
        };

        return pub;

    }(LetterGame.CanvasManager, document.getElementById("canvas"));

    LetterGame.game.start(w, h);
};

function reset(clear) {
    LetterGame.game.reset(clear);
};

function exportDrawing() {
    LetterGame.game.exportDrawing();
};

function letterChanged(value) {
    var letter = JSON.parse(LetterGame.letters[value]);
    LetterGame.game.letterChanged(value, letter);
};


























