var dog,dogImg,dogImg2;

var database;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var foodS,foodStock;

function preload(){
  
   dogImg=loadImage("Dog.png");

   dogImg2=loadImage("happydog.png");

     

  }

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

foodObj = new food();

  dog=createSprite(500,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.29;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 
  
  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

}

function draw() {
  background("pink");
 
  if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(dogImg2);
  }

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  foodObj.display();
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Fed At : 12 AM",350,30);
   }else{
     text("Last Fed At : "+ lastFed + " AM", 350,30);
   }
  drawSprites();
  fill("blue");
  stroke("purple");
  text("Food Left : "+foodS,470,150);
 // textSize(13);
  //text("Press UP TO Feed Little Cuty Pie Doggo!!!",130,10,300,20);
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}



function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  } 
  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dog.addImage(dogImg2);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}