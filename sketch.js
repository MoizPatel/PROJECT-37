//Create variables here
var database;
var dog,dogImage,dogImage1,food,foodImage,foodStock,foodRef;
var feed;
var fedTime,lastFed,foodRem;
var foodObj;
var namebox;
var value;
var milkimg,milkbottle;
var readState;
var gameState;
var saddog;
var bedroom, garden, washroom;
function preload()
{
  dogimage = loadImage("Dog.png");
  dogimage2 = loadImage("happydog.png");
  milkimg = loadImage("Milk.png");
  saddog = loadImage("virtual pet images/deadDog.png");
  bedroom = loadImage("virtual pet images/Bed room.png");
  garden = loadImage("virtual pet images/garden.png");
  washroom = loadImage("virtual pet images/Wash Room.png");
}

function setup() {
  createCanvas(500, 500);
  foodObj=new Food();
  //foodObj.updateFoodStock(20);

  dog = createSprite(450,300);
  dog.addImage(dogimage);
  dog.scale = 0.2;

  database = firebase.database();
  
  //food = database.ref('Food');
  //food.on("value",readStock);

  feed = createButton("Feed your dog");
  feed.position(650,150);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(770,150);
  addFood.mousePressed(addFoods);
  
 

  milkbottle = createSprite(370,320)
  milkbottle.addImage(milkimg)
  milkbottle.visible = 0
  milkbottle.scale = 0.1
}


function draw() {  
  background(46, 139, 87);
  fill("white");
  text("Press DOWN_ARROW KEY To Start Feeding The Dog",100,80);
  drawSprites();
  
  foodObj.display();
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
    readState = database.ref('GameState');
    readState.on("value",function(data){
      gameState=data.val();
    });

    currentTime=hour();
    if(currentTime==(lastFed+1)){
      update("playing");
      foodObj.garden();
    }else if (currentTime==(lastFed+2)) {
      update("sleeping");
      foodObj.bedroom();
    }else if (currentTime==(lastFed+2) && currentTime<=(lastFed+4)) {
      update("bathing");
      foodObj.washroom();
    }else{
      update("Hungry");
      foodObj.display();
    }

    if (keyIsDown("DOWN_ARROW")) {
      gameState="Play";
    }

    if(gameState!="Hungry"){
      feed.hide();
      addFood.hide();
      
     //dog.remove()

    }else{
      feed.show();
      addFood.show();
     // dog.addImage(saddog);
    }
    //console.log(gameState)
  fill("white");
  textSize(15);
  if(lastFed>=12){
    text("Last Fed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Fed : 12 AM",350,30);
   }else{
     text("Last Fed : "+ lastFed + " AM", 350,30);
   }
   fill(4,23,117)
   textSize(20)
   text(value,400,dog.y-80)
}
function feedDog()
{
  foodObj.getFoodStock();
  if(foodObj.foodStock<=0)
  {
    foodObj.foodStock=0;
    milkbottle.visible=0;
    dog.addImage(dogimage);
  }
  else{
    dog.addImage(dogimage2);
    if(foodObj.foodStock===1)
    {
        milkbottle.visible=0;
        dog.addImage(dogimage);
    }
    else
    milkbottle.visible = 1
    foodObj.updateFoodStock(foodObj.foodStock-1);
    database.ref('/').update({
    Food:foodObj.foodStock,
    FeedTime:hour()
    });
  }
}
function addFoods()
{
  
  foodObj.updateFoodStock(foodObj.foodStock+1);
  database.ref('/').update({
    Food:foodObj.foodStock
  });
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}
