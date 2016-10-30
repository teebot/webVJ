const Meyda = require('meyda');
const constraints = {video: false, audio: true};
const USE_MIC = false;

class Audio {
    constructor(bufferSize) {
        this.context = new AudioContext();
        this.synthesizer = {
            out: this.context.createGain()
        };

        this.meyda = Meyda.createMeydaAnalyzer({
            audioContext: this.context,
            source: this.synthesizer.out,
            bufferSize: bufferSize,
            windowingFunction: 'blackman',
        });

        const successCallback = (mediaStream) => {
            console.log('User allowed microphone access.');
            const source = this.context.createMediaStreamSource(mediaStream);
            console.log('Setting Meyda Source to Microphone');
            this.meyda.setSource(source);
        };

        const errorCallback = (error) => {
            console.error(error);
        };

        if (USE_MIC) {
            navigator.getUserMedia(
                constraints,
                successCallback,
                errorCallback
            );
        } else {
            let elvis = document.getElementById('testSong');
            let stream = this.context.createMediaElementSource(elvis);
            stream.connect(this.context.destination);
            this.meyda.setSource(stream);
        }
    }

    get(features) {
        return this.meyda.get(features);
    }
}


module.exports = Audio;
