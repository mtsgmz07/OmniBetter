module.exports = function (firstArray, secondArray) {
    return firstArray.filter(obj1 => {
        return !secondArray.some(obj2 => compareObjects(obj1, obj2));
    });
}

function compareObjects(obj1, obj2) {
    return Object.keys(obj1).every(key => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]);
}