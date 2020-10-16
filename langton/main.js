//
// white 0 -> turn left
// black 1 -> turn right
//
// orientation = 0 1 2 3 .. up right down left
//

let svg = d3.select("svg");

let aux = {
  rectDim: 15,
  colorantDomain: [10, 0],
};

aux["nHorz"] = Math.floor(window.innerWidth / aux.rectDim);
aux.nVert = Math.floor(window.innerHeight / aux.rectDim);

aux.rectW = window.innerWidth / aux.nHorz;
aux.rectH = window.innerHeight / aux.nVert;

svg.attr("width", aux.rectW * aux.nHorz).attr("height", aux.rectH * aux.nVert);

let colorant = d3
  .scaleSequential()
  .domain(aux.colorantDomain)
  .interpolator(d3.interpolateCubehelixDefault);

let x,
  y,
  orient = 0,
  flat = Array(aux.nVert * aux.nHorz).fill(0);

function next_pos(x, y, orient) {
  // if black, turn right, else turn left
  orient += flat[x + y * aux.nVert] % 2 ? 1 : -1;

  // check if orientation inside range
  if (orient == -1) {
    orient = 3;
  } else if (orient == 4) {
    orient = 0;
  }

  // move
  if (orient == 0) {
    y -= 1;
  } else if (orient == 1) {
    x += 1;
  } else if (orient == 2) {
    y += 1;
  } else if (orient == 3) {
    x -= 1;
  }

  // check if you're off screen
  if (x >= aux.nVert) {
    x = 0;
  } else if (x < 0) {
    x = aux.nVert - 1;
  }
  if (y >= aux.nHorz) {
    y = 0;
  } else if (y < 0) {
    y = aux.nHorz - 1;
  }

  return [x, y, orient];
}

let timer;
let still = true;

let canvas = svg.append("g");

let tiles = canvas
  .selectAll("rect")
  .data(flat)
  .join("rect")
  .attr("x", (_, i) => aux.rectH * Math.floor(i / aux.nVert) + 0.15)
  .attr("y", (_, i) => aux.rectH * Math.floor(i % aux.nVert) + 0.15)
  .attr("height", aux.rectH - 0.3)
  .attr("width", aux.rectW - 0.3)
  .attr("i", (_, i) => i)
  .attr("fill", (d) => colorant(d ** 0.5))
  .on("click", function (tile) {
    if (still) {
      still = false;

      if (typeof x == "undefined") {
        let i = d3.select(this).attr("i");
        y = Math.floor(i / aux.nVert);
        x = Math.floor(i % aux.nVert);
      }

      timer = d3.timer(step);
    } else {
      still = true;
      timer.stop();
    }
  });

function step() {
  let new_x, new_y;
  [new_x, new_y, orient] = next_pos(x, y, orient);
  flat[x + y * aux.nVert] += 1;
  // if (flat[x + y * aux.nVert] > aux.colorantDomain[1]) {
  //   aux.colorantDomain[1] += 5;
  //   colorant = d3.scaleSequential().domain(aux.colorantDomain).interpolator(d3.interpolateBlues);
  // }
  x = new_x;
  y = new_y;

  tiles.data(flat).join(
    (enter) => enter,
    (update) => update.attr("fill", (d) => colorant(d ** 0.5)),
    (exit) => exit
  );
}
