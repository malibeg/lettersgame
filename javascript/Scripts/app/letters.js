﻿
var LetterGame = LetterGame || {};

LetterGame.letters = {
    A: '[{ "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#00CC22" }, { "fill": "#00CC22" }, { "fill": "#00CC22" }, { "fill": "#00CC22" }, { "fill": "#00CC22" }, { "fill": "#669966" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#00CC22" }, { "fill": "#00CC22" }, { "fill": "#BBFFBB" }, { "fill": "#00CC22" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#00CC22" }, { "fill": "#00CC22" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#00CC22" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#00CC22" }, { "fill": "#00CC22" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#00CC22" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#00CC22" }, { "fill": "#00CC22" }, { "fill": "#669966" }, { "fill": "#00CC22" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#00CC22" }, { "fill": "#00CC22" }, { "fill": "#00CC22" }, { "fill": "#00CC22" }, { "fill": "#00CC22" }, { "fill": "#BBFFBB" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }, { "fill": "#669966" }, { "fill": "#BBFFBB" }]',
    B: '[{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#00CC22"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#00CC22"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#00CC22"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#00CC22"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#00CC22"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"}]',
    C: '[{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#00CC22"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#00CC22"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#00CC22"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#00CC22"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"}]',
    Č: '[{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#00CC22"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#00CC22"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#00CC22"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#00CC22"},{"fill":"#00CC22"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"},{"fill":"#669966"},{"fill":"#BBFFBB"}]'
};