module.exports = function (nombre) {
    var nombreString = nombre.toString();
    if (nombreString.indexOf('.') === -1) {
        return Number(nombre + "00");
    } else {
        let chiffresApresVirgule = nombreString.split('.')[1];
        if (chiffresApresVirgule.length === 1) return Number((nombre * 10) + "0")
        else return Number(nombre).toFixed(2)
    }
}