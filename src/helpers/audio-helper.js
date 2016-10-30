module.exports.filterInstru = (instrumentBands, loudness) => {
    if (!loudness.specific)
        return 0;

    const mean = _.mean(loudness.specific.slice(instrumentBands.from, instrumentBands.to + instrumentBands.from));
    if (mean < instrumentBands.treshold) {
        return 0;
    }
    return mean;
};