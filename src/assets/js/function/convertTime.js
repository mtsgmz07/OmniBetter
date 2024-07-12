module.exports = (ms, precision = true) => {
    let date = new Date(ms);
    let mois = date.getMonth() + 1;
    let jour = date.getDate();
    let annee = date.getFullYear();
    let heure = date.getHours();
    let minute = date.getMinutes();

    mois = (mois < 10) ? '0' + mois : mois;
    jour = (jour < 10) ? '0' + jour : jour;
    heure = (heure < 10) ? '0' + heure : heure;
    minute = (minute < 10) ? '0' + minute : minute;

    if (precision) return jour + '/' + mois + '/' + annee + ' ' + heure + ':' + minute;
    else return jour + '/' + mois + '/' + annee;
}
