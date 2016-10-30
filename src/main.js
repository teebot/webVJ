const Audio = require('./audio');
const _ = require('lodash');
const PIXI = require('pixi.js');
const bufferSize = 1024;
const analyzer = new Audio(bufferSize);

const bassElem = document.querySelector('.bass');
const snareElem = document.querySelector('.snare');

// Bark bands for each instrument
const INSTRUMENT_BANDS = {
    BASS_DRUM: {from: 0, to: 1, treshold: 1.1},
    SNARE: {from: 1, to: 2, treshold: 1.1}
};

const filter = (instrumentBands, loudness) => {
    if (!loudness.specific)
        return 0;

    const mean = _.mean(loudness.specific.slice(instrumentBands.from, instrumentBands.to + instrumentBands.from));
    if (mean < instrumentBands.treshold) {
        return 0;
    }
    return mean;
};

var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();

stage.interactive = true;

var circle = new PIXI.Graphics();
circle.beginFill(0xFFFFFF);
circle.drawCircle(390, 300, 60);

var boom = PIXI.Sprite.fromImage('images/neons.jpg');
boom.width = renderer.width;
boom.height = renderer.height;

var blurFilter1 = new PIXI.filters.BlurFilter();
var colorFilter = new PIXI.filters.ColorMatrixFilter();
boom.filters = [blurFilter1, colorFilter];
circle.filters = [blurFilter1];

var count = 0;
function render(time) {
    count += 0.1;
    var matrix = colorFilter.matrix;

    matrix[1] = Math.sin(count) * 3;
    matrix[2] = Math.cos(count);
    matrix[3] = Math.cos(count) * 1.5;
    matrix[4] = Math.sin(count / 3) * 2;
    matrix[5] = Math.sin(count / 2);
    matrix[6] = Math.sin(count / 4);

    let features = analyzer.get(['loudness']);

    if (features) {
        let bassDrum = filter(INSTRUMENT_BANDS.BASS_DRUM, features.loudness);
        bassElem.innerText = bassDrum;

        let snare = filter(INSTRUMENT_BANDS.SNARE, features.loudness);
        snareElem.innerText = snare;
        if (snare) {
            stage.addChild(circle);
        } else {
            stage.removeChild(circle);
        }

        if (bassDrum) {
            stage.addChild(boom);
            stage.removeChild(circle);
        } else {
            stage.removeChild(boom);
        }
    }

    requestAnimationFrame(render);
    renderer.render(stage);
}

render();
