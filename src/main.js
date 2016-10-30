const Audio = require('./audio');
const _ = require('lodash');
const PIXI = require('pixi.js');
const bufferSize = 1024;
const analyzer = new Audio(bufferSize);

const bassElem = document.querySelector('.bass');
const snareElem = document.querySelector('.snare');

// Bark bands for each instrument
const INSTRUMENT_BANDS = {
    BASS_DRUM: {from: 0, to: 1, treshold: 1.2},
    SNARE: {from: 1, to: 2, treshold: 1.1}
};

const renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
document.body.appendChild(renderer.view);
const stage = new PIXI.Container();

stage.interactive = true;

const circle = new PIXI.Graphics();
circle.beginFill(0xFFFFFF);
circle.drawCircle(390, 300, 60);

const boom = PIXI.Sprite.fromImage('images/neons.jpg');
boom.width = renderer.width;
boom.height = renderer.height;

const blurFilter1 = new PIXI.filters.BlurFilter();
const colorFilter = new PIXI.filters.ColorMatrixFilter();
boom.filters = [blurFilter1, colorFilter];
circle.filters = [blurFilter1];

let count = 0;

function render() {
    count += 0.1;
    colorFilter.matrix = colorMatrixMod(count, colorFilter.matrix);
    const features = analyzer.get(['loudness']);

    if (features) {
        const bassDrum = filterInstru(INSTRUMENT_BANDS.BASS_DRUM, features.loudness);
        bassElem.innerText = bassDrum;

        const snare = filterInstru(INSTRUMENT_BANDS.SNARE, features.loudness);
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

function colorMatrixMod(count) {
    let matrix = [];
    // red
    matrix = matrix.concat([0, Math.sin(count) * 3, Math.cos(count), Math.cos(count) * 1.5, Math.sin(count / 3) * 2]);
    // green
    matrix = matrix.concat([Math.sin(count / 2), Math.sin(count / 4), 0, 0, 0]);
    // blue
    matrix = matrix.concat([0, 0, 0, 0, 0]);
    // alpha
    matrix = matrix.concat([0, 0, 0, 1, 0]);
    return matrix;
}

function filterInstru(instrumentBands, loudness) {
    if (!loudness.specific)
        return 0;

    const mean = _.mean(loudness.specific.slice(instrumentBands.from, instrumentBands.to + instrumentBands.from));
    if (mean < instrumentBands.treshold) {
        return 0;
    }
    return mean;
}
