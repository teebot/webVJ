const PIXI = require('pixi.js');
const colorMatrixMod = require('./filters').colorMatrixMod;
const getInstrumentBeat = require('./../../helpers/audio-helper').getInstrumentBeat;
const BaseScene = require('./../../base-scene');

// Bark bands for each instrument
const INSTRUMENT_BANDS = {
    BASS_DRUM: {from: 0, to: 1, treshold: 1.2},
    SNARE: {from: 1, to: 2, treshold: 1.1}
};

class Rumours extends BaseScene {

    setup() {
        this.count = 0;
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

        const beat = getInstrumentBeat(INSTRUMENT_BANDS, features);
        if (beat.SNARE) {
            this.stage.addChild(this.circle);
        } else {
            this.stage.removeChild(this.circle);
        }

        if (beat.BASS_DRUM) {
            this.stage.addChild(this.boom);
            this.stage.removeChild(this.circle);
        } else {
            this.stage.removeChild(this.boom);
        }

        this.renderer.render(this.stage);
    }
}

module.exports = Rumours;