/*from left to right
there will be 143 object represent as the grid
in each object, there wil be r: and c:
to determine where is the current snake head and tails
*/

/*
    known bug
        - sometime when snake passed through fruit, it doesn't count to point or add tail or do anything, simply treat it as not existed (done)
        -after checking it, it does count to score and add tail so it's ok (done)
    - feature
        - eat tail will result in lose, need to add (done)
        - score UI 
*/





let eatCountDoc = document.querySelector(".snake-count");
let scoreDoc = document.querySelector(".score-count");
let highScoreDoc = document.querySelector(".high-score-count");

let arraySnakePosition = [];
let snakeArray = [
    {"id": "head", "color": "red", "c": 3, "r":3},
    {"id": "tail", "tailFirst": true, "color": "white", "c": 2, "r":3},
    {"id": "tail", "color": "white", "c": 1, "r":3}
];
let arrayOfSquare = document.querySelectorAll(".square");
let direction = "DOWN";
let snakeHeadOldPosition = [];
let fruitPosition = "";
let found = false;
let headLastPoint = "";
let eatCount = 0;
let score = 0;
let fruiteLastPosition = "";

//check for highscore in browser storage
let highScoreFromStorage;
if(localStorage.getItem("highScoreSnake")){
    highScoreFromStorage = localStorage.getItem("highScoreSnake");
    highScoreDoc.textContent = "Highscore: " + highScoreFromStorage;
}else {
    highScoreFromStorage = 0;
}

//13 column, so less than 14
let count = 0;
for(let j = 1; j < 14; j++){
    //11 row, so less than 12
    for(let k = 1; k < 12; k++){
        arraySnakePosition.push({"squareBox":arrayOfSquare[count], "c": j , "r": k })
        count+=1;
    }
}


/*movement detection*/
function movement(){
    document.addEventListener("keyup", function(event){
        if (event.keyCode == 38 && direction != "DOWN" && direction != "UP"){
            direction = "UP";
        }else if (event.keyCode == 39 && direction != "RIGHT" && direction != "LEFT" ){
            direction = "RIGHT";
        }else if (event.keyCode == 37 && direction != "LEFT" && direction != "RIGHT"){
            direction = "LEFT";
        }else if (event.keyCode == 40 && direction != "DOWN" && direction != "UP"){
            direction = "DOWN";
        }else {
        }
    })
}

function findSnakeHead(snakeObject){
    for(let i = 0; i<snakeObject.length; i++){
        if (snakeObject[i].id == "head"){
            return snakeObject[i];
        }
    }
}
//whatever where the head was, make it grey
function oldHeadPositionClear(oldHeadPosition,arraySnakePosition){
    //clear the position that head was in
    for(let i = 0; i < arraySnakePosition.length; i++){
        if(arraySnakePosition[i].c == oldHeadPosition.c && arraySnakePosition[i].r == oldHeadPosition.r){
            arraySnakePosition[i].squareBox.style.background = "lightgrey";
        }
    }
}

/*test idea with snakeArray*/
function whereToColorHead(snakeArray, arraySnakePosition){
    /*mock, and check the arraySnakePosition that connect to the DOM*/
        for(let i = 0; i < arraySnakePosition.length; i++){
            for(let k = 0; k < snakeArray.length; k++){
                if(snakeArray[k].id == "head"){
                    if(arraySnakePosition[i].c == snakeArray[k].c && arraySnakePosition[i].r == snakeArray[k].r){
                        arraySnakePosition[i].squareBox.style.background = "red";
                    }
                }
            }
        }
}

function lookingIfHeadMatchFruite(fruitPosition, snakeHead, arraySnakePosition, currentSnakeArray){
    // console.log("snakeHead:", snakeHead);
     //console.log("fruitPosition:", fruitPosition)
     //eat detect
     //now after it eat, we have to increase the snake tail length 
     //by findout the last c,r of the tail
     //then we add new tail
     //after that we make new fruit appear
     if(snakeHead.c == fruitPosition.c && snakeHead.r == fruitPosition.r){
         eatCount += 1;
         score += 100;
        //time to find the last tail of the currentSnakeArray
        let lastTail = currentSnakeArray[currentSnakeArray.length - 1];
        //if the direction is left and last tail is not at the same column as head and and row
        //then add -c other wise -r
        fruiteRandomAppear(currentSnakeArray,arraySnakePosition);
        if(direction == "LEFT" && lastTail.c != snakeHead.c && lastTail.r!= snakeHead.r){
            if (lastTail.c < snakeHead.c){
                 currentSnakeArray.push( {"id": "tail", "color": "white", "c": (lastTail.c - 1), "r": lastTail.r})
                 //console.log("happen in LEFT: <")
            }else {
                 currentSnakeArray.push( {"id": "tail", "color": "white", "c": (lastTail.c + 1), "r": lastTail.r})
                //console.log("happen in LEFT: else")
            }
        }else if (direction == "LEFT" && lastTail.c == snakeHead.c && lastTail.r!= snakeHead.r){
             currentSnakeArray.push( {"id": "tail", "color": "white", "c": lastTail.c , "r": (lastTail.r + 1)})
             //console.log("happen == C LEFT")
        }else if (direction == "RIGHT" && lastTail.c != snakeHead.c && lastTail.r!= snakeHead.r){
             if (lastTail.c < snakeHead.c){
                 currentSnakeArray.push( {"id": "tail", "color": "white", "c": (lastTail.c - 1), "r": lastTail.r})
                 //console.log("happen in RIGHT: <")
             }else {
                 currentSnakeArray.push( {"id": "tail", "color": "white", "c": (lastTail.c + 1), "r": lastTail.r})
                 //console.log("happen in RIGHT: else")
             }
        }else if (direction == "RIGHT" && lastTail.c == snakeHead.c && lastTail.r!= snakeHead.r){
             currentSnakeArray.push( {"id": "tail", "color": "white", "c": lastTail.c , "r": (lastTail.r - 1)})
             //console.log("happen == C RIGHT")
        }else if(direction == "UP" && lastTail.c != snakeHead.c  && lastTail.r != snakeHead.r){
             if (lastTail.r < snakeHead.r){
                 currentSnakeArray.push({"id": "tail", "color": "white", "c": lastTail.c , "r": (lastTail.r - 1)})
                 //console.log("happen UP <")
             }else {
                 currentSnakeArray.push({"id": "tail", "color": "white", "c": lastTail.c , "r": (lastTail.r + 1)})
                 //console.log("happen UP ELSE")
             }
        }else if (direction == "UP" && lastTail.c != snakeHead.c  && lastTail.r == snakeHead.r){
             currentSnakeArray.push({"id": "tail", "color": "white", "c":(lastTail.c + 1 ), "r": lastTail.r})
             //console.log("happen == R UP")
        }else if (direction == "DOWN" && lastTail.c != snakeHead.c  && lastTail.r != snakeHead.r){
             if (lastTail.r < snakeHead.r){
                 currentSnakeArray.push({"id": "tail", "color": "white", "c": lastTail.c , "r": (lastTail.r - 1)})
                 //console.log("happen DOWN <")
             }else {
                 currentSnakeArray.push({"id": "tail", "color": "white", "c": lastTail.c , "r": (lastTail.r + 1)})
                 //console.log("happen DOWN else")
             }
        }else if (direction == "DOWN" && lastTail.c != snakeHead.c  && lastTail.r == snakeHead.r){
             currentSnakeArray.push({"id": "tail", "color": "white", "c": (lastTail.c - 1) , "r": lastTail.r})
             //console.log("happen == DOWN")
        }
 
     }
 }

//looking if head is on one of the tail
function doesSnakeHeadHitTail(snakeHead, snakeArray){
    for(let i = 0; i < snakeArray.length; i++){
        if(snakeArray[i].id != "head" && snakeArray[i].c == snakeHead.c && snakeArray[i].r == snakeHead.r){
            clearInterval(gameTime);
            clearInterval(movementGame);
        }
    }
}

//if left and right, move row
//if up and down, move column
function movingSnakeHead(fruitPosition, snakeArray, arraySnakePosition){
    //find where the head is
    //get the direction
    //go in that direction every 100 of a second
    let snakeHead = findSnakeHead(snakeArray);
    snakeHeadOldPosition = snakeHead;
    //how can i detect if the snake hit the wall ?
    // for row, 11
    //for column, 13
    // i don't need first if check to see if less than 13
    //i can just directly + or -
    //then check after plus before change color , 
    //if the position > 13
    //just say, you lose
    if(direction == "DOWN"){
        oldHeadPositionClear(snakeHeadOldPosition, arraySnakePosition);
        headLastPoint = {"c":snakeHead.c ,"r": snakeHead.r};
        snakeHead.c += 1;
        doesSnakeHeadHitTail(snakeHead, snakeArray);
        lookingIfHeadMatchFruite(fruitPosition,snakeHead, arraySnakePosition, snakeArray);
        if(snakeHead.c > 13){
            clearInterval(gameTime);
            clearInterval(movementGame);
        }else {
            whereToColorHead(snakeArray, arraySnakePosition);
        }   
    }else if (direction == "UP"){
        oldHeadPositionClear(snakeHeadOldPosition, arraySnakePosition);
        headLastPoint = {"c":snakeHead.c ,"r": snakeHead.r};
        snakeHead.c -= 1;
        doesSnakeHeadHitTail(snakeHead, snakeArray);
        lookingIfHeadMatchFruite(fruitPosition,snakeHead, arraySnakePosition, snakeArray);
        if(snakeHead.c < 1){
            clearInterval(gameTime);
            clearInterval(movementGame);
        }else {
            whereToColorHead(snakeArray, arraySnakePosition);
        }
        
    }else if (direction == "RIGHT"){  
        oldHeadPositionClear(snakeHeadOldPosition, arraySnakePosition);
        headLastPoint = {"c":snakeHead.c ,"r": snakeHead.r};
        snakeHead.r += 1;
        doesSnakeHeadHitTail(snakeHead, snakeArray);
        lookingIfHeadMatchFruite(fruitPosition,snakeHead, arraySnakePosition, snakeArray);
        if(snakeHead.r > 11){
            clearInterval(gameTime);
            clearInterval(movementGame);
        }else {
            whereToColorHead(snakeArray, arraySnakePosition);
        }
      
    }else if (direction == "LEFT"){  
        oldHeadPositionClear(snakeHeadOldPosition, arraySnakePosition);
        headLastPoint = {"c":snakeHead.c ,"r": snakeHead.r};
        snakeHead.r -= 1;
        doesSnakeHeadHitTail(snakeHead, snakeArray);
        lookingIfHeadMatchFruite(fruitPosition,snakeHead, arraySnakePosition, snakeArray);
        if(snakeHead.r < 1){
            clearInterval(gameTime);
            clearInterval(movementGame);
        }else {
            whereToColorHead(snakeArray, arraySnakePosition);
        }       
    }
}
function movingSnakeTails(snakeArray, arraySnakePosition){
    let snakeTails = [];
    let lastPoint = "";
    let beforeLastPoint = "";
    for(let i = 0; i < snakeArray.length; i++){
        if(snakeArray[i].id == "tail"){
            snakeTails.push(snakeArray[i]);
        }
    }
    //make sure the consequence tails doesn't over lap
    for(let i = 0; i < snakeTails.length ; i++){
        if (snakeTails[i].tailFirst == true){
            lastPoint = {"c": snakeTails[i].c, "r": snakeTails[i].r};
            removeLastPosition(lastPoint, arraySnakePosition);
            snakeTails[i].c = headLastPoint.c;
            snakeTails[i].r = headLastPoint.r;
            colorThisPosition(thisPosition = snakeTails[i], arraySnakePosition);
        }else{
            beforeLastPoint = {"c": snakeTails[i].c, "r": snakeTails[i].r};
            removeLastPosition(beforeLastPoint, arraySnakePosition);
            snakeTails[i].c = lastPoint.c;
            snakeTails[i].r = lastPoint.r;
            colorThisPosition(thisPosition = snakeTails[i], arraySnakePosition);
            lastPoint = beforeLastPoint;
        }
    }
}
function reconfirmFruitPosition(fruitPosition, arraySnakePosition){
    for(let i = 0; i < arraySnakePosition.length; i++){
        if(arraySnakePosition[i].c == fruitPosition.c && arraySnakePosition[i].r == fruitPosition.r){
            arraySnakePosition[i].squareBox.style.background = "green";
        }
    }
}
function removeLastPosition(lastPoint, arraySnakePosition){
    for(let i = 0; i < arraySnakePosition.length; i++){
        if(arraySnakePosition[i].c == lastPoint.c && arraySnakePosition[i].r == lastPoint.r){
            arraySnakePosition[i].squareBox.style.background = "lightgrey";
        }
    }
}
function colorThisPosition(thisPosition, arraySnakePosition){
    for(let i = 0; i < arraySnakePosition.length; i++){
        if(arraySnakePosition[i].c == thisPosition.c && arraySnakePosition[i].r == thisPosition.r){
            arraySnakePosition[i].squareBox.style.background = "white";
        }
    }
}
//count number of random CR function call to keep track incase of bug
//var countR = 0;
//function random fruite
function randomFruiteCR(){
    //countR += 1;
    let randomC = Math.floor(Math.random() * 12) + 1;
    let randomR = Math.floor(Math.random() * 10) + 1;
    //console.log("c:", randomC, "r:", randomR, "randomCount:", countR);
    return {"c": randomC, "r": randomR}
}
//must be appear within 11x13
function fruiteRandomAppear(currentSnakeArray,currentArraySnakePosition){
    found = false;
    //we need 2 random
    let randomCR = randomFruiteCR();
    //first get the position of c and r from random
    //make sure r and c are not in the snake Already position like tail or read
    //and find that in the arrayPosition and green it
    for(let i = 0; i < currentSnakeArray.length; i++){
        if(currentSnakeArray[i].c == randomCR.c && currentSnakeArray[i].r == randomCR.r){
            //console.log("in check if snake in that appear fruite!")
            found = true;
            return fruiteRandomAppear(currentSnakeArray,currentArraySnakePosition);
        }
    }
    if (found == false){
        for(let i =0; i< currentArraySnakePosition.length; i++){
            if(currentArraySnakePosition[i].c == randomCR.c  && currentArraySnakePosition[i].r == randomCR.r){
                //console.log("run normal!")
                currentArraySnakePosition[i].squareBox.style.background = "green";
                fruitPosition = currentArraySnakePosition[i];
                return;
            }
        }
    }
}


//first fruite appear
fruiteRandomAppear(snakeArray,arraySnakePosition);


function determineHighScore(score, highScore){
    if(score > highScore){
        highScoreDoc.textContent = "Highscore: " + score;
        localStorage.setItem("highScoreSnake", score);
    }
}

let gameTime = setInterval(function(){
    movingSnakeHead(fruitPosition,snakeArray, arraySnakePosition);
    movingSnakeTails(snakeArray, arraySnakePosition);
    reconfirmFruitPosition(fruitPosition, arraySnakePosition);
    eatCountDoc.textContent = "Fruit: " + eatCount;
    scoreDoc.textContent = "Score: " + score;
    determineHighScore(score, highScoreFromStorage)
}, 100)

let movementGame = setInterval(movement(), 10)










