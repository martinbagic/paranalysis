const newPoints = [[4.9, 3.2, 1.2, 0.4], [5.4, 3.3, 1.4, 0.9]];
const { PCA } = require('ml-pca');
const pca = new PCA(newPoints);
let predictions = pca.predict(newPoints);

const d3 = require("d3");

console.log(d3);

console.log(predictions);
