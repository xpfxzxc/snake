var const_offset = [ [0, -1], [1, 0], [0, 1], [-1, 0] ];
var const_init_snake = [ [2, 9], [3, 9], [4, 9], [5, 9] ]; // [x, y]
                                                //  head
var const_width = 20;
var const_height = 15;
var const_interval = 100;

var global_highest_score_text;
var global_score_text;
var global_grids = [];
var global_snake = [];

var global_highest_score;
var global_score;
var global_direction; // 0  1     2    3 
                      // UP RIGHT DOWN LEFT
var global_food = new Object();
var global_movement;

function createScoreText() {
    var box = document.getElementById("box");
    global_highest_score_text = document.createElement("p");
    global_highest_score_text.setAttribute("class", "score");
    global_score_text = document.createElement("p");
    global_score_text.setAttribute("class", "score");
    global_highest_score_text.appendChild(document.createTextNode(""));
    global_score_text.appendChild(document.createTextNode(""));
    box.appendChild(global_highest_score_text);
    box.appendChild(global_score_text);
}

function changeGrid(x, y, css, isbody) {
    global_grids[x][y].grid.setAttribute("class", css);
    global_grids[x][y].isbody = isbody;
}

function createTable() {
    var box = document.getElementById("box");
    var table = document.createElement("table");
    table.setAttribute("id", "area");
    for (var i = 0; i < const_width; i++) {
        global_grids[i] = [];
    }
    for (var y = 0; y < const_height; y++) {
        var tr = document.createElement("tr");
        for (var x = 0; x < const_width; x++) {
            var grid = document.createElement("td");
            global_grids[x][y] = new Object();
            global_grids[x][y].grid = grid;
            tr.appendChild(grid);
        }
        table.appendChild(tr);
    }
    box.appendChild(table);
}

function generateSnake() {
    global_snake = const_init_snake.slice();
    for (var i = 0; i < global_snake.length; i++) {
        var x = global_snake[i][0];
        var y = global_snake[i][1];
        changeGrid(x, y, "snake_color", true);
    }
}

function generateFood() {
    var rd = ~~(Math.random() * (const_width * const_height - global_snake.length));
    for (var y = 0; y < const_height; y++) {
        for (var x = 0; x < const_width && rd > 0; x++) {
            if (!global_grids[x][y].isbody) {
                global_food.x = x;
                global_food.y = y;
                rd--;
            }
        }
    }
    changeGrid(global_food.x, global_food.y, "food_color", false);
}

function keySettings(e) {
    var keychar = String.fromCharCode(e.which || e.keyCode || 0);
    var direction;
    switch (keychar) {
        case "w": case "W":
            direction = 0;
            break;
        case "d": case "D":
            direction = 1;
            break;
        case "s": case "S":
            direction = 2;
            break;
        case "a": case "A":
            direction = 3;
            break;
        default:
            return false;
    }
    var length = global_snake.length;
    var x = global_snake[length - 1][0] + const_offset[direction][0];
    var y = global_snake[length - 1][1] + const_offset[direction][1];
    var penultimate = global_snake[length - 2];
    if (penultimate[0] != x || penultimate[1] != y) {
        global_direction = direction;
    }
}

function prompt(msg) {
    window.removeEventListener("keypress", keySettings);
    clearTimeout(global_movement);
    var box = document.getElementById("box");
    var para = document.createElement("p");
    para.innerHTML = msg + "<br />Your score: " + global_score;
    para.innerHTML += "<br />" + "Press Space bar to restart...";
    para.setAttribute("class", "msg");
    box.appendChild(para);
    document.addEventListener("keypress", function func(e) {
        var keychar = String.fromCharCode(e.which || e.keyCode || 0);
        if (keychar == " ") {
            box.removeChild(para);
            document.removeEventListener("keypress", func);
            reset();
        }
    });
}

function running() {
    var length = global_snake.length;
    var x = global_snake[length - 1][0] + const_offset[global_direction][0];
    var y = global_snake[length - 1][1] + const_offset[global_direction][1];
    if (x < 0 || x >= const_width || y < 0 || y >= const_height || global_grids[x][y].isbody) {
        prompt("You FAIL!");
        return false;
    }
    changeGrid(x, y, "snake_color", true);
    global_snake.push([x, y]);
    if (x == global_food.x && y == global_food.y) {
        global_score++;
        global_highest_score = Math.max(global_highest_score, global_score);
        updateScoreText();
        if (global_score + const_init_snake.length >= const_width * const_height) {
            prompt("You PASS!");
            return false;
        }
        generateFood();
    } else {
        var tail = global_snake[0];
        changeGrid(tail[0], tail[1], "normal_color", false);
        global_snake.shift();
    }
    global_movement = setTimeout("running();", const_interval);
}

function updateScoreText() {
    global_highest_score_text.lastChild.nodeValue = "Highest Score: " + global_highest_score;
    global_score_text.lastChild.nodeValue = "Current Score: " + global_score;
}

function resetTable() {
    for (var y = 0; y < const_height; y++) {
        for (var x = 0; x < const_width; x++) {
            changeGrid(x, y, "normal_color", false);
        }
    }
}

function reset() {
    global_score = 0;
    global_direction = 1;
    resetTable();
    generateFood();
    generateSnake();
    updateScoreText();
    document.addEventListener("keypress", keySettings);
    global_movement = setTimeout("running();", const_interval);
}

function init() {
    global_highest_score = 0;
    createScoreText();
    createTable();
    reset();
}

window.addEventListener("load", init);