const PIXI = require('pixi.js');
const _ = require('lodash');
const colorMatrixMod = require('./filters').colorMatrixMod;
const filterInstru = require('./../../helpers/audio-helper').filterInstru;

// Bark bands for each instrument
const INSTRUMENT_BANDS = {
    BASS_DRUM: { name: 'bd', from: 0, to: 1, treshold: 1.2},
    SNARE: { name: 'snare', from: 1, to: 2, treshold: 1.1}
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

module.exports = Rumours;