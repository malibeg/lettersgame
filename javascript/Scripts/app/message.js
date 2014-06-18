var LetterGame = LetterGame || {};

LetterGame.message = function () {
    var priv = {};
    priv.message = "";
    priv.fill = "#FFFFFF";
    priv.showtime = 0;
    priv.decrement = 1;
    priv.font = "150% Helvetica";
    priv.textAlign = "center";
    priv.textBaseline = "middle";

    priv.drawheart = function (ctx, fill) {
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
        ctx.fillStyle = fill;
    };

    priv.drawface = function (ctx, message) {
        ctx.strokeStyle = priv.fill;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle

        if (message === 'bravo') {
            // smile
            ctx.moveTo(110, 75);
            ctx.arc(75, 75, 35, 0, Math.PI, false); // Mouth (clockwise)
            message = "BRAVO!";
        } else {
            // sad face
            ctx.moveTo(100, 100);
            ctx.lineTo(60, 100); // Mouth
            message = "Greška!";
        }
        ctx.moveTo(65, 65);
        ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // Left eye
        ctx.moveTo(95, 65);
        ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // Right eye
        ctx.stroke();

        return message;
    };

    var pub = {};

    pub.setup = function(spec) {
        // IF AN OBJECT WAS PASSED THEN INITIALISE PROPERTIES FROM THAT OBJECT
        for (var prop in spec) priv[prop] = spec[prop];
    };

    pub.draw = function (ctx) {
        if (priv.showtime > 0) {
            var message = priv.message;
            if (message.startsWith('heart')) {
                priv.drawheart(ctx, priv.fill);
                var misses = priv.message.slice(5);
                if (misses.length > 0) {
                    message = 'Broj promašaja: ' + misses;
                } else {
                    message = '';
                }
            } else if (message === 'bravo' || message == 'greška') {
                message = priv.drawface(ctx, message);
            }

            ctx.fillStyle = priv.fill;
            ctx.font = priv.font;
            ctx.textAlign = priv.textAlign;
            ctx.textBaseline = priv.textBaseline;
            ctx.fillText(message, 200, 200);

            priv.showtime--;
        }
    };
    pub.getmessage = function () {
        return priv.message;
    };

    return pub;
}();