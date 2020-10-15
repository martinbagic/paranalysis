const d3 = require("d3");
const { PCA } = require("ml-pca");

aid = new Aid(
    {
        svgHeight: 300,
        svgWidth: 300,
        maxStd: 50,
        nPoints: 300,
    },
    d3
);

let svg = d3
    .select("svg#pca")
    .attr("height", aid.conf.svgHeight)
    .attr("width", aid.conf.svgWidth);
let svgd = d3
    .select("svg#data")
    .attr("height", aid.conf.svgHeight)
    .attr("width", aid.conf.svgWidth);

let handles = [
    [aid.conf.svgWidth * 0.15, aid.conf.svgHeight * 0.7],
    [aid.conf.svgWidth * 0.4, aid.conf.svgHeight * 0.8],
    [aid.conf.svgWidth * 0.8, aid.conf.svgHeight * 0.7],
];

let array = handles
    .map((handle) => aid.handleToDist(handle[0], handle[1]))
    .map((handle) => aid.normSeq(handle[0], handle[1]));

function refreshHandles(cx, cy, selfi) {
    d3.select(`.handle[i='${selfi}']`).attr("cx", cx).attr("cy", cy);
    let [mean, std] = aid.handleToDist(cx, cy);
    let seq = aid.normSeq(mean, std);
    d3.selectAll(`.data-${selfi}`).attr(
        "cy",
        (_, i) => aid.conf.svgHeight - seq[i] * 10000
    );
    handles[selfi] = [mean, std];
}

function refreshPCA() {
    let array = handles.map((handle) => aid.normSeq(handle[0], handle[1]));
    let z = aid.transpose(array);
    let pca = new PCA(z);
    let predictions = pca.predict(z);
    // console.log(predictions)
    // let normalizedData = Array.from([0,1]).map(array => aid.normalize(array))
    // normalizedData = aid.transpose(normalizedData)
    let normalizedData = aid.normalize(predictions.data);

    // console.log("before",normalizedData[0], normalizedData[normalizedData.length - 1])
    // for (let i of [0, 0]) {

    //     if (normalizedData[0][i] > normalizedData[normalizedData.length - 1][i]) {
    //         for (let j in normalizedData){
    //             normalizedData[j][i] = 1 - normalizedData[j][i];
    //         }
    //     }
    // }
    console.log(
        "after",
        normalizedData[0],
        normalizedData[normalizedData.length - 1]
    );
    console.log();
    dataPoints.data(normalizedData);

    dataPoints
        .attr("cx", (d) => d[0] * (aid.conf.svgWidth - 20) + 10)
        .attr("cy", (d) => d[1] * (aid.conf.svgHeight - 20) + 10);
}

var dragHandler = d3
    .drag()
    .on("start", (_) => console.log("start"))
    .on("drag", function (event) {
        // console.log("drag")

        let self = d3.select(this);
        let selfi = self.attr("i");

        let cy = aid.clip(event.y, 0, aid.conf.svgHeight);
        let cx = aid.clip(event.x, 0, aid.conf.svgWidth);

        // console.log(event);
        // console.log(event.x, event.y);

        refreshHandles(cx, cy, selfi);
        refreshPCA();
    })
    .on("end", (_) => console.log("end"));

for (ai in array) {
    svgd
        .selectAll()
        .data(array[ai])
        .enter()
        .append("circle")
        .classed("data", true)
        .classed("data-" + ai, true)
        .attr("cx", (d, i) => (i / aid.conf.nPoints) * aid.conf.svgWidth)
        .attr("cy", (d) => aid.conf.svgHeight - d * 1000)
        .attr("r", 3)
        .attr("fill", (d, i, _) => aid.colorScale(i))
        // .attr("stroke", "dodgerblue")
        .style("opacity", 0.9);
}

let handleCircles = svgd
    .selectAll()
    .data(handles)
    .enter()
    .append("circle")
    .classed("handle", true)
    .attr("r", 8)
    .attr("fill", "rgba(255,255,255,0.5)")
    .attr("stroke", "dodgerblue")
    .attr("stroke-dasharray", "1 1")
    .style("stroke-width", "10px")
    .attr("i", (_, i) => i);

// .call(dragHandler)

// console.log(handleCircles)
// handleCircles.each(_ => console.log(_))

handleCircles.call(dragHandler);
// .on("touchmove", druggy)

let z = aid.transpose(array);

let pca = new PCA(z);

let predictions = pca.predict(z);
let normalizedData = aid.normalize(predictions.data);

dataPoints = svg
    .selectAll()
    .data(normalizedData)
    .enter()
    .append("circle")
    // .attr("cx", d => d[0] * (aid.conf.svgWidth - 20) + 10)
    // .attr("cy", d => d[1] * (aid.conf.svgHeight - 20) + 10)
    .attr("r", 3)
    .attr("fill", (d, i, _) => aid.colorScale(i));
// .attr("stroke", "black")

refreshPCA();

handles.map((handle, i) => refreshHandles(handle[0], handle[1], i));

// handles.map((handle, i) => refreshHandles(handle[0], handle[1], i))
