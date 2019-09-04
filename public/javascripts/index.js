const cols = 50;
const rows = 50;
const grid = new Array(cols);

let openSet = [];
let closeSet = [];

let start;
let end;

var w, h;

let path = [];

function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1)
        }
    }
}

function heuristic(a, b) {
    var d = abs(a.x - b.x) + abs(a.y - b.y)
    return d
}

function Spot(x, y) {
    this.x = x;
    this.y = y;
    this.h = 0;
    this.g = 0;
    this.f = 0;
    this.wall = false;
    if (random(1) < 0.3) {
        this.wall = true;
    }
    this.previous = undefined;
    this.neighbors = [];
    this.show = function (col) {
        fill(col);
        if (this.wall) {
            fill(0);
        }
        rect(this.x * w, this.y * h, w - 1, h - 1)
    }
    this.addNeighbors = function (grid) {
        var x = this.x;
        var y = this.y;
        if (x < cols - 1) {
            this.neighbors.push(grid[x + 1][y])
        }
        if (x > 0) {
            this.neighbors.push(grid[x - 1][y])
        }
        if (y < rows - 1) {
            this.neighbors.push(grid[x][y + 1])
        }
        if (y > 0) {
            this.neighbors.push(grid[x][y - 1])
        }
    }
}

function setup() {
    createCanvas(1080, 800);

    w = width / cols;
    h = height / rows;
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows)
    }
    console.log(grid)
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j)
        }
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }


    start = grid[0][0];
    end = grid[cols - 1][rows - 1]
    start.wall = false;
    end.wall = false;
    openSet.push(start)
}

function draw() {
    background(0);

    if (openSet.length > 0) {
        let winner = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i
            }
        }
        var current = openSet[winner]
        removeFromArray(openSet, current)
        closeSet.push(current)

        let neighbors = current.neighbors;
        for (var i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if (!closeSet.includes(neighbor) && !neighbor.wall) {
                let tempG = current.g + 1;

                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor = tempG;
                    }
                } else {
                    neighbor.g = tempG;
                    openSet.push(neighbor)
                }
                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = current;
            }
        }
        if (current === end) {
            noLoop()
            console.log('DONE')
        }
    } else {
        // NO solution
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].show(255)
        }
    }

    for (let i = 0; i < closeSet.length; i++) {
        closeSet[i].show(color(255, 0, 0))
    }
    for (let i = 0; i < openSet.length; i++) {
        openSet[i].show(color(0, 255, 0))
    }
    path = []
    path.push(current);
    while (current.previous) {
        path.push(current.previous);
        current = current.previous;
    }

    for (let i = 0; i < path.length; i++) {
        path[i].show(color(0, 0, 255))
    }

}