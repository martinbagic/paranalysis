(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//
// white 0 -> turn right
// black 1 -> turn left
//
// orientation = 0 1 2 3 .. up right down left
//

// const d3 = require("d3");
let svg = d3.select("svg");

let aux = {
  n_horz: 10,
  n_vert: 10,
  rectw: 50,
};

let x = 3,
  y = 5,
  orient = 0,
  matrix = Array(aux.n_vert)
    .fill()
    .map((_) => Array(aux.n_horz).fill(0));

function next_pos(x, y, orient) {
  orient += matrix[x][y] == 0 ? 1 : -1;
  switch (orient) {
    case 0:
      y -= 1;
    case 1:
      x += 1;
    case 2:
      y += 1;
    case 3:
      x -= 1;
  }
  if (x >= aux.n_horz) {
    x = 0;
  } else if (x < 0) {
    x = aux.n_horz - 1;
  }
  if (y >= aux.n_vert) {
    y = 0;
  } else if (y < 0) {
    y = aux.n_vert - 1;
  }
  return [x, y, orient];
}

for (let i = 0; i < 10; i++) {
  let new_x, new_y;
  [new_x, new_y, orient] = next_pos(x, y, orient);
  matrix[x][y] = matrix[x][y] == 0 ? 1 : 0;
  x = new_x;
  y = new_y;
}

svg
  .attr("width", aux.rectw * aux.n_horz)
  .attr("height", aux.rectw * aux.n_vert)
  .selectAll("g")
  .data(matrix)
  .join("g")
  .attr("transform", (_, i) => `translate(0,${aux.rectw * i})`)
  .selectAll("rect")
  .data((d) => d)
  .join("rect")
  .attr("x", (_, i) => aux.rectw * i)
  .attr("height", aux.rectw * 0.9)
  .attr("width", aux.rectw * 0.9);

},{}]},{},[1]);
