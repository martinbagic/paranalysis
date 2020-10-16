let svg = d3.select("svg");

let aux = {
  rectDim: 15,
};

aux["nHorz"] = Math.floor(window.innerWidth / aux.rectDim);
aux.nVert = Math.floor(window.innerHeight / aux.rectDim);

aux.rectW = window.innerWidth / aux.nHorz;
aux.rectH = window.innerHeight / aux.nVert;

svg.attr("width", aux.rectW * aux.nHorz).attr("height", aux.rectH * aux.nVert);

let colorantBlack = d3.scaleSequential(d3.interpolateTurbo).domain([15, 0]);
let colorantWhite = d3.scaleSequential(d3.interpolateGreys).domain([0, 8]);

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
let time = new Date().getTime();

let canvas = svg.append("g");

// let ant = svg.append("circle").attr("fill","white").attr("height",aux.rectH - 0.3).attr("width",aux.rectW-0.3)

let tiles = canvas
  .selectAll("rect")
  .data(flat)
  .join("rect")
  .attr("x", (_, i) => aux.rectH * Math.floor(i / aux.nVert) + 0.15)
  .attr("y", (_, i) => aux.rectH * Math.floor(i % aux.nVert) + 0.15)
  .attr("height", aux.rectH - 0.3)
  .attr("width", aux.rectW - 0.3)
  .attr("i", (_, i) => i)
  .attr("stroke", "black")
  .attr("stroke-width", 0.15)
  .attr("fill", "white")
  .attr("id", (_, i) => `rect${i}`)
  .on("click", function (tile) {
    if (still) {
      still = false;

      if (x == null) {
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
  x = new_x;
  y = new_y;

  let tile = d3.select(`#rect${x + y * aux.nVert}`);
  tile.attr("fill", function () {
    let d = flat[x + y * aux.nVert];
    return d % 2 ? colorantBlack(d ** 0.5) : colorantWhite(d ** 0.5);
  });

  //   tiles.data(flat).join(
  //     (enter) => enter,
  //     (update) =>
  //       update.attr("fill", (d) =>
  //         d % 2 ? colorantBlack(d ** 0.5) : colorantWhite(d ** 0.5)
  //       ),
  //     (exit) => exit
  //   );

  // let t = new Date().getTime();
  // console.log(t - time);
  // time = t;
}
