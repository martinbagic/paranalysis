
const CONF = {
    svgHeight: 300,
    svgWidth: 300,
    maxStd: 50,
    nPoints: 300,
}

const d3 = require("d3");
const { PCA } = require('ml-pca');

let svg = d3.select("svg#pca").attr("height", CONF.svgHeight).attr("width", CONF.svgWidth)
let svgd = d3.select("svg#data").attr("height", CONF.svgHeight).attr("width", CONF.svgWidth)


let myColor = d3.scaleSequential().domain([1, CONF.nPoints])
    .interpolator(d3.interpolateBlues); // interpolateTurbo

function normPDF(x, m, s) {
    return Math.pow(Math.E, -Math.pow((x - m) / s, 2) / 2) / s / Math.sqrt(2 * Math.PI);
}

function normSeq(m, s) {
    let range = [...Array(CONF.nPoints).keys()]
    let seq = range.map(x => normPDF(x, m, s))
    return seq
}

function normalizeOne(array) {
    let min = Math.min(...array);
    let max = Math.max(...array);
    return array.map(element => (element - min) / (max - min))
}

function normalize(array) {
    let min = Math.min(...array.map(subarray => Math.min(...subarray)))
    let max = Math.max(...array.map(subarray => Math.max(...subarray)))
    return array.map(subarray => subarray.map(element => (element - min) / (max - min)))
}

let handles = [
    [CONF.svgWidth * 0.15, CONF.svgHeight * 0.7],
    [CONF.svgWidth * 0.4, CONF.svgHeight * 0.8],
    [CONF.svgWidth * 0.8, CONF.svgHeight * 0.7],
]

let array = handles.map(handle => handleToDist(handle[0], handle[1])).map(handle => normSeq(handle[0], handle[1]))


function clip(x, min, max) {
    if (x > max) {
        return max
    } else if (x < min) {
        return min
    } else {
        return x
    }
}


function druggy(event) {
    let self = d3.select(this);
    let selfi = self.attr("i")

    let cy = clip(event.y, 0, CONF.svgHeight);
    let cx = clip(event.x, 0, CONF.svgWidth)


    refreshHandles(cx, cy, selfi)
}

function handleToDist(x, y) {
    let mean = x / CONF.svgWidth * CONF.nPoints;
    let std = y / CONF.svgHeight * CONF.maxStd + 0.1;
    return [mean, std];
}

function refreshHandles(cx, cy, selfi) {

    d3.select(`.handle[i='${selfi}']`).attr("cx", cx).attr("cy", cy)


    let [mean, std] = handleToDist(cx, cy);


    let seq = normSeq(mean, std);

    d3.selectAll(`.data-${selfi}`)
        .attr("cy", (_, i) => CONF.svgHeight - seq[i] * 10000)

    handles[selfi] = [mean, std]
    refreshPCA()
}


function refreshPCA() {
    let array = handles.map(handle => normSeq(handle[0], handle[1]))
    let z = transpose(array);
    let predictions = pca.predict(z);
    let normalizedData = normalize(predictions.data);
    dataPoints.data(normalizedData);
    dataPoints.attr("cx", d => d[0] * (CONF.svgWidth - 20) + 10)
        .attr("cy", d => d[1] * (CONF.svgHeight - 20) + 10)
}

var dragHandler = d3
    .drag()
    .on("drag", druggy)

for (ai in array) {
    svgd.selectAll()
        .data(array[ai])
        .enter()
        .append("circle")
        .classed("data", true)
        .classed("data-" + ai, true)
        .attr("cx", (d, i) => i / CONF.nPoints * CONF.svgWidth)
        .attr("cy", d => CONF.svgHeight - d * 1000)
        .attr("r", 3)
        .attr("fill", (d, i, _) => myColor(i))
        // .attr("stroke", "dodgerblue")
        .style("opacity", 0.9)
}

let handleCircles = svgd
    .selectAll()
    .data(handles)
    .enter()
    .append("circle")
    .classed("handle", true)
    .attr("r", 10)
    .attr("fill", "transparent")
    .attr("stroke", "dodgerblue")
    .style("stroke-width", "5px")
    .attr("i", (_, i) => i)
    .call(dragHandler)



function transpose(a) {
    return Array.from(a[0]).map((_, i) => a.map(row => row[i]));
}

let z = transpose(array);

const pca = new PCA(z);



let predictions = pca.predict(z);
let normalizedData = normalize(predictions.data);


let dataPoints = svg.selectAll()
    .data(normalizedData)
    .enter()
    .append("circle")
    // .attr("cx", d => d[0] * (CONF.svgWidth - 20) + 10)
    // .attr("cy", d => d[1] * (CONF.svgHeight - 20) + 10)
    .attr("r", 3)
    .attr("fill", (d, i, _) => myColor(i))
// .attr("stroke", "black")

refreshPCA()

handles.map((handle, i) => refreshHandles(handle[0], handle[1], i))

// handles.map((handle, i) => refreshHandles(handle[0], handle[1], i))



