class ColorMatrixMod {
    constructor() {
        this.count = 0;
    }

    next() {
        this.count += 0.1;

        let matrix = [];
        // red
        matrix = matrix.concat([0, Math.sin(this.count) * 3, Math.cos(this.count), Math.cos(this.count) * 1.5, Math.sin(this.count / 3) * 2]);
        // green
        matrix = matrix.concat([Math.sin(this.count / 2), Math.sin(this.count / 4), 0, 0, 0]);
        // blue
        matrix = matrix.concat([0, 0, 0, 0, 0]);
        // alpha
        matrix = matrix.concat([0, 0, 0, 1, 0]);
        return matrix;
    }
}

module.exports.ColorMatrixMod = ColorMatrixMod;
