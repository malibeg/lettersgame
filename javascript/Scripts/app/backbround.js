var LetterGame = LetterGame || {};

// This object calculates color of background cell
LetterGame.background = function () {
    var priv = {};
    priv.col1 = '#BBFFBB';
    priv.col2 = '#669966';
    priv.letter = {};
    priv.rectNum = 1;

    var pub = {};
    pub.getcolor = function (col, row) {
        var color = LetterGame.constants.pairfieldcolor;
        if (priv.letter == null) {
            if (((col + row) % 2) === 0) {
                color = LetterGame.constants.oddfieldcolor;
            }
        } else {
            var index = row + col * priv.rectNum;
            color = priv.letter[index].fill;
        }

        return color;
    };

    pub.init = function(spec) {
        for (var prop in spec) priv[prop] = spec[prop];
    };

    pub.getletter = function() {
        return priv.letter;
    };

    return pub;
}();