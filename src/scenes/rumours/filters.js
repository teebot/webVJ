module.exports.colorMatrixMod = (count) => {
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
};