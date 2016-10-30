const PIXI = require('pixi.js');
const _ = require('lodash');

// Bark bands for each instrument
const INSTRUMENT_BANDS = {
    BASS_DRUM: {from: 0, to: 1, treshold: 1.2},
    SNARE: {from: 1, to: 2, treshold: 1.1}
};

class Rumours {
    constructor(analyzer) {
        this.count = 0;
        this.analyzer = analyzer;

        this.bassElem = document.querySelector('.bass');
        this.snareElem = document.querySelector('.snare');


        this.renderer = PIXI.autoDetectRenderer(800, 600, {antialias: true});
        document.body.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();
        this.stage.interactive = true;

        this.circle = new PIXI.Graphics();
        this.circle.beginFill(0xFFFFFF);
        this.circle.drawCircle(390, 300, 60);

        this.boom = PIXI.Sprite.fromImage('images/neons.jpg');
        this.boom.width = this.renderer.width;
        this.boom.height = this.renderer.height;

        const blurFilter1 = new PIXI.filters.BlurFilter();
        this.colorFilter = new PIXI.filters.ColorMatrixFilter();
        this.boom.filters = [blurFilter1, this.colorFilter];
        this.circle.filters = [blurFilter1];
    }

    render() {
        this.count += 0.1;
        this.colorFilter.matrix = colorMatrixMod(this.count);
        const features = this.analyzer.get(['loudness']);

        if (features) {
            const bassDrum = filterInstru(INSTRUMENT_BANDS.BASS_DRUM, features.loudness);
            this.bassElem.innerText = bassDrum;

            const snare = filterInstru(INSTRUMENT_BANDS.SNARE, features.loudness);
            this.snareElem.innerText = snare;
            if (snare) {
                this.stage.addChild(this.circle);
            } else {
                this.stage.removeChild(this.circle);
            }

            if (bassDrum) {
                this.stage.addChild(this.boom);
                this.stage.removeChild(this.circle);
            } else {
                this.stage.removeChild(this.boom);
            }
        }

        this.renderer.render(this.stage);
    }
}

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

module.exports = Rumours;