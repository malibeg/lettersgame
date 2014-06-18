
var LetterGame = LetterGame || {};

LetterGame.rectangle = function (spec) {
    var priv = {};
    priv.x = 0;
    priv.y = 0;
    priv.w = 1;
    priv.h = 1;
    priv.fill = '#AAAAAA';
    // IF AN OBJECT WAS PASSED THEN INITIALISE PROPERTIES FROM THAT OBJECT
    for (var prop in spec) priv[prop] = spec[prop];

    var pub = {};
    pub.fill = priv.fill;
    // Draws this Rectangle to a given context
    pub.draw = function (ctx) {
        ctx.fillStyle = pub.fill;
        ctx.fillRect(priv.x, priv.y, priv.w, priv.h);
    };

    return pub;
};