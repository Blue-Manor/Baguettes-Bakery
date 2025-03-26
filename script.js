let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let cW = canvas.width;
let cH = canvas.height;
let ctx = canvas.getContext('2d');
let menu = {
    background: new Image(),
    buttonText: "START",
    startButton: {
        Image: new Image(),
        X: center(2, resize(4), "x"),
        Y: resize(2),
        width: resize(4),
        height: resize(10),
    },
}
let kitchen = {
    background: new Image(),
    counter: new Image(),
    buttonText: "START",
    startButton: {
        Image: new Image(),
        X: center(2, resize(3), "x"),
        Y: resize(1.3),
        width: resize(3),
        height: resize(10),
        Mode: "Start"
    },
}
let measuring = {
    background: new Image(),
    counter: new Image(),
    bowl: new Image(),
    foodBackdrop: new Image(),
    cup: new Image(),
    halfCup: new Image(),
    quarterCup: new Image(),
    tablespoon: new Image()
};

let peopleSrc = ["Characters/girl1.png", "Characters/girl2.png", "Characters/girl3.png", "Characters/girl4.png", "Characters/girl5.png", "Characters/girl6.png", "Characters/girl7.png", "Characters/girl8.png", "Characters/boy1.png", "Characters/boy2.png", "Characters/boy3.png", "Characters/boy4.png","Characters/boy5.png","Characters/boy6.png","Characters/boy7.png","Characters/boy8.png"];

let currentGameMode = "Menu"; // Default game mode is Menu
let transitionOpacity = 0; // Initial opacity value for the transition
let GameModeTransitioning = false; // To track if the transition is active
let transitioning = false; 
let newGameMode = "";
let Foods = {
    bread: { 
        Name: "Bread",
        Image: new Image(),
        bakedGood: true,
        Ingredients: ["flour", "water", "salt", "yeast"],
        Color: NaN,
    },
    cake: { 
        Name: "Cake",
        Image: new Image(),
        bakedGood: true,
        Ingredients: ["flour", "milk", "sugar", "baking powder"],
        Color: NaN,
    },
    cupcake: { 
        Name: "CupCake",
        Image: new Image(),
        bakedGood: true,
        Ingredients: ["flour", "milk", "sugar", "oil", "salt", "baking powder"],
        Color: "pink",
    },
}
let customers = [];
let selectedFood = Foods[Object.keys(Foods)[0]]; // Initially selected food
let foodHasBeenSelected = false;
// Set image URLs for menu background and start button
function setImageUrls(){
    menu.background.src = "Menu_Background.png";
    menu.startButton.Image.src = "Start_Button.png";
    kitchen.background.src = "Shop_Background.png";
    kitchen.startButton.Image.src = "Start_Button.png";
    kitchen.counter.src = "Counter.png";
    Foods.bread.Image.src = "Food/Bread.png";
    Foods.cake.Image.src = "Food/Cake.png";
    Foods.cupcake.Image.src = "Food/PinkCupCake.png";
    measuring.background.src = "Kitchen_Background.png";
    measuring.counter.src = "Counter.png";
    measuring.bowl.src = "CookingTools/Bowl.png";
    measuring.foodBackdrop.src = "FoodBackdrop.png";
    measuring.cup.src = "CookingTools/Measuring_Cup.png";
    measuring.halfCup.src = "CookingTools/Measuring_Cup.png";
    measuring.quarterCup.src = "CookingTools/Measuring_Cup.png";
    measuring.tablespoon.src = "CookingTools/Measuring_Cup.png";
}
setImageUrls();

function update(){
    ctx.clearRect(0, 0, cW, cH); // Clear the canvas for redrawing
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cW = canvas.width;
    cH = canvas.height;
    updateValues();
    switch(currentGameMode) {
        case "Menu":
            Menu();
            break;
        case "Kitchen":
            Kitchen();
            break;
        case "Measuring":
            Measuring();
            break;
        case "Cooking":
            Cooking();
            break;
        case "MakeColors":
            MakeColors();
            break;
        case "Failed":
            Failed();
            break;
        default:
            break;
    }
    if(GameModeTransitioning){
        GameModeTransition();
    }
    if(foodHasBeenSelected){
        kitchen.startButton.Mode = "Cook";
    }
    window.requestAnimationFrame(update);
}
function updateValues(){
    menu.startButton.X = center(2, resize(4), "x");
    menu.startButton.Y = resize(2);
    menu.startButton.width = resize(4);
    menu.startButton.height = resize(10);
    kitchen.startButton.X = center(2, resize(3), "x");
    kitchen.startButton.Y = resize(1.3);
    kitchen.startButton.width = resize(3);
    kitchen.startButton.height = resize(10);
    customers.forEach(customer => {
        customer.update();
        customer.draw();
        customer.width = resize(4);
        customer.height = resize(1.5);
        customer.speed = cW / 160;
        customer.index = customers.indexOf(customer);
        customer.y = resize(1) - customer.height;
        customer.targetX = cW/2 - customer.width/2 - customer.width*1.1 * customer.index;
    });
}

//  menu screen
function Menu(){
    ctx.drawImage(menu.background, center(2, resize(1), "x"), 0, resize(1), resize(1));
    drawButton(menu.startButton, menu.buttonText)
}

//  kitchen screen
function Kitchen() {
    ctx.fillStyle = "rgb(206, 206, 206)";
    ctx.fillRect(0, 0, cW, cH);
    ctx.fillStyle = "rgb(209, 117, 46)";
    ctx.fillRect(center(2, resize(1), "x"), resize(1), resize(1), canvas.height - resize(1));
    ctx.drawImage(kitchen.background, center(2, resize(1), "x"), 0, resize(1), resize(1.5));
    customers.forEach(customer => {
        customer.update();
        customer.draw();
    });
    ctx.drawImage(kitchen.counter, center(2, resize(1), "x"), resize(1) - resize(4), resize(1), resize(4));
    if(kitchen.startButton.Mode == "Cook"){
        kitchen.buttonText = `Make ${selectedFood.Name}`
    }

    drawButton(kitchen.startButton, kitchen.buttonText)

    if(foodHasBeenSelected){
        ctx.drawImage(selectedFood.Image, center(2, resize(3), "x"), resize(2)-resize(3)/2, resize(3), resize(3));
    }
}
function drawButton(button, text) {
    // Set the font size relative to the button width and measure the text
    ctx.font = `${button.width / (3 + (text.length/2.3))}px Arial`;
    let textWidth = ctx.measureText(text).width;

    // Draw the button using its predefined properties
    ctx.drawImage(button.Image, button.X, button.Y, button.width, button.height);

    // Calculate text positions for drawing
    // Center text horizontally within the button
    let textX = button.X + (button.width / 2) - (textWidth / 2);
    // Center text vertically within the button
    let textY = button.Y + button.height / 2 + ctx.measureText('M').actualBoundingBoxAscent / 2;

    // Set fill style for text and draw it
    ctx.fillStyle = "white";
    ctx.fillText(text, textX, textY);
}
//  measuring screen
function Measuring() {
    ctx.fillStyle = "rgb(230, 230, 230)";
    ctx.fillRect(0, 0, cW, cH);
    ctx.drawImage(measuring.background, center(2, resize(1), "x"), 0, resize(1), resize(1.5));
    ctx.drawImage(measuring.counter, center(2, resize(1), "x"), resize(1) - resize(4), resize(1), resize(4));
    ctx.drawImage(measuring.bowl, center(2, resize(2), "x") - resize(2.5)/2, resize(1.1) - resize(4), resize(2), resize(4));

    // Drawing the measuring tools on the right side
    ctx.drawImage(measuring.cup, center(1, resize(2.5)*2, "x"), resize(4), resize(2.5), resize(5));
    ctx.drawImage(measuring.halfCup, center(1, resize(3)*2, "x"), resize(4) + resize(5)/2, resize(3), resize(6));
    ctx.drawImage(measuring.quarterCup, center(1, resize(4)*2, "x"), resize(4) + resize(5)/2 + resize(6)/2, resize(4), resize(8));
    ctx.drawImage(measuring.tablespoon, center(1, resize(5)*2, "x"), resize(4) + resize(5)/2 + resize(6)/2 + resize(8)/2, resize(5), resize(10));

    if(foodHasBeenSelected){
        ctx.drawImage(measuring.foodBackdrop, cW - resize(5), 0, resize(5), resize(5));
        ctx.drawImage(selectedFood.Image, cW - (resize(6) + resize(60)), resize(60), resize(6), resize(6));
    }
}


//  cooking screen
function Cooking() {
    ctx.fillStyle = "green";
    ctx.fillRect(center(2, resize(4), "x"), resize(2), resize(4), resize(4)); // Example of drawing during Cooking
}

//  MakeColors screen
function MakeColors() {
    ctx.fillStyle = "purple";
    ctx.fillRect(center(2, resize(4), "x"), resize(2), resize(4), resize(4)); // Example of drawing during MakeColors
}

//  failed screen
function Failed() {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", center(2, resize(4), "x"), resize(2)); // Example of failed screen
}

function SelectFood() {
    
}

function spawnCustomer() {
    const newCustomer = new Customer(customers.length);
    customers.push(newCustomer);
}

function startSpawningCustomers() {
    // Spawn the first customer immediately
    spawnCustomer();

    // Set an interval for subsequent customers
    let spawnInterval = setInterval(() => {
        if (customers.length < 10) {  // Limit the number of customers on screen
            spawnCustomer();
        } else {
            clearInterval(spawnInterval);  // Stop spawning if limit is reached
        }
    }, Math.random() * 10000 + 10000);  // Spawning interval between 10 and 20 seconds
}



function calculateDisplayDuration(elapsedTime, totalDuration) {
    // This function calculates the display duration such that it starts fast and slows down over time
    // It uses a simple linear interpolation for demonstration; adjust the formula as needed for different effects
    let fraction = elapsedTime / totalDuration;
    return initialFoodDisplayDuration + (fraction * (totalDuration / 10 - initialFoodDisplayDuration));
}

// Transition animation when the game mode changes
function GameModeTransition() {
    if(transitionOpacity >= 0){
        ctx.fillStyle = "black";
        ctx.globalAlpha = transitionOpacity;
        ctx.fillRect(0, 0, cW, cH);
    }
    if (transitionOpacity < 1 && transitioning) {
        // Gradually darken the screen until fully black
        transitionOpacity += 0.01; // Increase opacity
    } else if (transitionOpacity > 0) {
        // Once fully black, switch the game mode
        currentGameMode = newGameMode;
        transitioning = false; // Stop darkening the screen
        transitionOpacity -= 0.01;
    }else{
        GameModeTransitioning = false;
        transitionOpacity = 0;
    }
}
function StartTransition(GameMode){
    GameModeTransitioning = true;
    newGameMode = GameMode;
    transitioning = true;
}
// Resize function for scaling elements
function resize(value){
    let size;
    if(canvas.height > cW){
        size = cW / value;
    } else {
        size = canvas.height / value;
    }
    return size;
}

// Center function for positioning elements
function center(centerPosition, size, direction) {
    if(direction == "x"){
        let positionX;
        positionX = (cW / centerPosition) - (size / 2);
        return positionX;
    }else if(direction == "y"){
        let positionY;
        positionY = (cH / centerPosition) - (size / 2);
        return positionY;
    }
    return 0;
}
class Customer {
    constructor(index) {
        this.width = resize(4);
        this.height = resize(1.5);
        this.speed = cW / 160;
        this.index = index;
        this.x = -this.width;  // Start from the left edge of the canvas
        this.y = resize(1) - this.height;
        this.food = this.assignRandomFood();
        this.targetX = cW/2 - this.width/2 - this.width*1.1 * index;
        this.OrderComplete = false;
        this.Character = new Image();
        this.Character.src = peopleSrc[Math.floor(Math.random() * peopleSrc.length)];
    }   

    assignRandomFood() {
        const foodKeys = Object.keys(Foods);
        const randomFoodKey = foodKeys[Math.floor(Math.random() * foodKeys.length)];
        return Foods[randomFoodKey];
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.drawImage(this.Character,this.x, this.y, this.width, this.height);
        if (this.food.Image.complete) {
            ctx.drawImage(this.food.Image, this.x + this.width/2 - resize(10)/2, this.y - resize(10)*1.5,resize(10),resize(10));
        }
    }

    update() {
        if (this.OrderComplete){
            this.targetX = cW;
        }
        if (this.x < this.targetX) {
            this.x += this.speed;
        }
        if(this.x == this.targetX && this.targetX >= cW/2 - this.width/2){
            foodHasBeenSelected = true;
            selectedFood = this.food;
        }
        if (this.x > this.targetX && !this.OrderComplete) {
            this.x = this.targetX; // Correct overshooting the target
        }
        if(this.x >= cW && this.OrderComplete){
            customers.splice(this.index, 1)
        }
    }
}




canvas.addEventListener('click', function(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    switch(currentGameMode) {
        case "Menu":
            if(mouseX > menu.startButton.X && mouseY > menu.startButton.Y && mouseX < menu.startButton.X + menu.startButton.width && mouseY < menu.startButton.Y + menu.startButton.height){
                StartTransition("Kitchen");
            }
            break;
        case "Kitchen":
            if (mouseX > kitchen.startButton.X && mouseX < kitchen.startButton.Y + kitchen.startButton.width &&
                mouseY > kitchen.startButton.Y && mouseY < kitchen.startButton.Y + kitchen.startButton.height) {
                if(kitchen.startButton.Mode == "Start" && customers.length == 0){
                    startSpawningCustomers();
                }else if(kitchen.startButton.Mode == "Cook"){
                    StartTransition("Measuring");
                }
            }
            break;
        case "Measuring":
            break;
        case "Cooking":
            break;
        case "MakeColors":
            break;
        case "Failed":
            break;
        default:
            break;
    }
});
update();
