let canvas;
let context;

let Arrow = {
    'Left': 37,
    'Up': 38,
    'Right': 39,
    'Down': 40
}
let point = {
    'width': 20,
    'height': 20
}
let snake = {
    'length': 5,
    'x': 0,
    'y': 0,
    'arrowX': 0,
    'arrowY': 0,
    'dots': [],
    'color': '#00ff00',
}
let map = {
    'width': 0,
    'height': 0,
}
let food = {
    'x': -1,
    'y': -1,
    'ate': true,
    'color': '#D50000',
    'color-second': '#F44336',
    'isColor': false,
}

let isPlay = false;
let isGameOver = false;

let defaultLength = 3 - 1;

let speedGame = 7;

let intervalGame;

let player = {
    'point': 0,
    'speed': speedGame,
    'length': snake.dots.length,
}

window.onload = function(){
    canvas = document.getElementById("contentGame");
    context = canvas.getContext('2d');
    map.width = canvas.width / point.width;
    map.height = canvas.height / point.height
    document.addEventListener('keydown', move);
    playGame();
    intervalGame = setInterval(game, 1000 / speedGame);
}

function game(){
    if(isPlay && !isGameOver){
        playGame();
        food.isColor = !food.isColor;
    }
    printPlayerPoint();
    calculatorPlayerPoint();
}

function playGame(){
    drawBackground(context, canvas.width, canvas.height);

    moveSnake(snake, map);
    drawSnake(context, snake.dots, point.width, point.height);

    eatFood(snake, food);
    createFood(snake, food);
    drawFood(context, food.x, food.y, point.width, point.height);
}

function move(e){
    switch(e.keyCode){
        case Arrow.Left:
            if(snake.arrowX !== 1){
                snake.arrowX = -1;
                snake.arrowY = 0;
            }
            isPlay = true;
            break;
        case Arrow.Right:
            if(snake.arrowX !== -1){
                snake.arrowX = 1;
                snake.arrowY = 0;
            }
            isPlay = true;
            break;
        case Arrow.Up:
            if(snake.arrowY !== 1){
                snake.arrowY = -1;
                snake.arrowX = 0;
            }
            isPlay = true;
            break;
        case Arrow.Down:
            if(snake.arrowY !== -1){
                snake.arrowY = 1;
                snake.arrowX = 0;
            }
            isPlay = true;
            break; 
    }
}

function createFood(snake, food){
    if(food.ate){
        do{
            food.x = Math.floor(Math.random() * map.width);
            food.y = Math.floor(Math.random() * map.height);
        } while (isFoodInSnake(snake, food))
        food.ate = false;
    }
}

function isFoodInSnake(snake, food){
    for (const dot of snake.dots) {
        if(dot.x === food.x
        && dot.y === food.y){
            return true;
        }
    }
    return false
}

function eatFood(snake, food){
    if(snake.x === food.x && snake.y === food.y){
        let newX = snake.dots[snake.dots.length - 1].x
        , newY = snake.dots[snake.dots.length - 1].y;
        snake.dots.push({
            'x': newX - snake.arrowX,
            'y': newY - snake.arrowY
        });
        food.ate = true;

        increaseSpeedGame();
    }
}

function increaseSpeedGame(){
    if(snake.dots.length > 0 && snake.dots.length % 5 == 0){
        speedGame++;
        clearInterval(intervalGame);
        intervalGame = setInterval(game, 1000 / speedGame);
    }
}

function moveSnake(snake, map){
    snake.x += snake.arrowX;
    snake.y += snake.arrowY;
    if(snake.x >= map.width) snake.x = 0;
    if(snake.y >= map.height) snake.y = 0;
    if(snake.x < 0) snake.x = map.width - 1;
    if(snake.y < 0) snake.y = map.height - 1;

    for (let i = snake.dots.length - 1; i > 0; i--) {
        if(snake.dots[0].x === snake.dots[i].x 
            && snake.dots[0].y === snake.dots[i].y){
                isGameOver = true;
                return;
        }
        snake.dots[i].x = snake.dots[i-1].x;
        snake.dots[i].y = snake.dots[i-1].y;
    }

    snake.dots[0] = {'x': snake.x, 'y': snake.y};

    if(defaultLength > 0 && isPlay){
        snake.dots.push({
            'x': snake.dots[snake.dots.length - 1].x - snake.arrowX,
            'y': snake.dots[snake.dots.length - 1].y - snake.arrowY
        })
        defaultLength--;
    }
}

function drawSnake(context, dots, width, height){
    for (let i = dots.length - 1; i >= 0; i--) {
        const dot = dots[i];
        drawSnakeDot(context, dot.x, dot.y, width, height, i === 0 ? '#2196F3' : snake.color);
    }
}

function drawSnakeDot(context, x, y, width, height, color){
    draw(context, x, y, width, height, color);
}

function drawFood(context, x, y, width, height){
    draw(context, x, y, width, height, food.isColor ? food.color : food["color-second"]);
}

function drawBackground(context, width, height){
    draw(context, 0, 0, width, height, '#424242');
}

function draw(context, x, y, width, height, color){
    context.fillStyle = color;
    context.fillRect(x * width, y * height, width - 2, height - 2);
}

function calculatorPlayerPoint(){
    player.speed = speedGame;
    player.length = snake.dots.length;
    let d = parseInt(player.length / 10);
    let r = player.length % 10;
    player.point = (d + 1)*r + d*(d+1)*10/2;
}

function printPlayerPoint(){
    document.getElementById("point").innerHTML = player.point;
    document.getElementById("level").innerHTML = player.speed - 6;
    document.getElementById("length").innerHTML = player.length;

}