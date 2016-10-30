module.exports.getInstrumentBeat = (instruments, features) => {
    let output = {};

    if (!features || !features.loudness)
        return output;

    for (let instrument in instruments) {
        output[instrument] = filterInstrument(instruments[instrument], features.loudness);
        // displayDebugInfo(instrument, output[instrument]);
    }
    return output;
};

function filterInstrument(instrumentBands, loudness) {
    if (!loudness.specific)
        return 0;

    const mean = _.mean(loudness.specific.slice(instrumentBands.from, instrumentBands.to + instrumentBands.from));
    if (mean < instrumentBands.treshold) {
        return 0;
    }
    return mean;
}

function displayDebugInfo(instrument, output) {
    console.info(instrument, output);
}