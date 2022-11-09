// QUESTIONS TO ASK
// when you resize one of the buffer does not follow suite, player starts moving in the dark 
// preformence with food
// online counter
// cursur not ??
//  sometimes the player is white for no reason?

let nameInput, nameButton, greeting, startButton;
var socket;
let player;
let playerName;
let pallete;
let colorPicker;
let playerSize;
let playerSpeed;
let particles = [];
let state = 0;
let paint = 0;
let v2;
var b1, b2, c1, c2;
let sketchHeight, sketchWidth;
let img;
let foods = [];

let canvas, playerLayer, drawingLayer, pixelLayer;
let players = [];


function preload() {
  img = loadImage('media/agariomush.png');
}


function setup() {
  sketchWidth = document.getElementById("p5").offsetWidth;
  sketchHeight = document.getElementById("p5").offsetHeight;
  canvas = createCanvas(sketchWidth, sketchHeight);
  canvas.parent("p5");
  playerLayer = createGraphics(sketchWidth, sketchHeight);
 // playerLayer.parent("p5");
  drawingLayer = createGraphics(sketchWidth, sketchHeight);
  //drawingLayer.parent("p5");
  pixelLayer = createGraphics(sketchWidth, sketchHeight);
 // pixelLayer.parent("p5");

  startPageLayout();
 //
 let online = document.getElementById("online");

  socket = io.connect('http://localhost:3000');

  playerSize = 50;
  playerSpeed = 2.5;
  textGrow = 15;
  pallete = [color('#7400b8'), color('#e67e22'), color('#5e60ce'), color('#5390d9'), color('#4ea8de'), color('48bfe3,'), color('#56cfe1'), color('#64dfdf'), color('#72efdd'), color('#80ffdb')];
  colorPicker = random(pallete); 

  player = new human(width/2, height/2, playerSize, playerName, textGrow, colorPicker);
  

  noiseDetail(24); 

  for (let i = 0; i <  500; i++){
    let tempParticle = new Particle(random(width), random(height), 5, random(pallete));
    particles.push(tempParticle);
  }

  socket.on('paint', updateCanvas);

  // socket.on('paint', data => {
  //  // console.log("reading paint");
	// 	drawingLayer.fill(255);
  //   drawingLayer.ellipse(data.x, data.y, 10, 10);
	// })

  var data = {
    x: player.position.x,
    y: player.position.y,
    color: player.color,
    name: player.name
   };
   socket.emit('start', data);

   socket.on('heartbeat', 
    function(data){
      players = data;
    }
   );
 }


 function updateCanvas(data){
 // console.log("x: " + data.x + "y: " + data.y);

  let food = new Food(data.x, data.y);
  food.display();
}

function draw() {
  if (state == 0) {
    startPage();
  } else if (state == 1){
    gamePlay();
 //   startPage();
  }
}

function startPageLayout(){
  startLayer = createGraphics(sketchWidth, sketchHeight);

  nameInput = createInput().attribute('placeholder', 'Enter a name');;
  nameInput.parent("startElements");
  nameInput.id("input");
 // nameInput.position(sketchWidth/2-nameInput.width/2, sketchHeight/2);
  let div = createDiv();
  div.parent('startElements');
  div.style('margin-left', '10px');
  nameButton = createButton('start');
  nameButton.parent(div);
  nameButton.id("start");
  //nameButton.position(nameInput.x + nameInput.width + 50);
  nameButton.mousePressed(nameSent);

}

function startPage(){
  background(50);
  img.resize(width, height);
  image(img, 0, 0);

  fill(255);
  textSize(20);
  textAlign(CENTER);
  text('this is a game', width/2, height*0.4);

  text('this is how the game works its really so so amazing you can draw stuff with ur friends'
        , width/2, height*0.8);

}

function nameSent(){
  playerName = nameInput.value();
 // nameInput.value('');
  player = new human(width/2, height/2, playerSize, playerName, textGrow, colorPicker);
  state = 1;
}

function gamePlay(){
 // sketchWidth = document.getElementById("p5").offsetWidth;
 // sketchHeight = document.getElementById("p5").offsetHeight;
  nameInput.remove();
  nameButton.remove();


  background(0);
  //orbitControl();
  
 
 // ellipse(player.position.x, player.position.y, 40, 40);
  translate(width/2-player.position.x, height/2-player.position.y);
  
  for(let i = particles.length -1; i >= 0; i--){
    particles[i].playMove();
    particles[i].display();
  }

  for(let i = players.length -1; i >= 0; i--){
    var id = players[i].id;
   // var id = players[i].name;
    if(id !== socket.id){
     // console.log("id is not itself");
      fill(colorPicker); 
      ellipse(players[i].x, players[i].y, playerSize, playerSize);

      fill(255);
      textAlign(CENTER);
      textSize(15);
      text(players[i].name, players[i].x, players[i].y+10);
    }
  }

  player.display(); 
  player.move();
  player.paint();
 
  
  // wrap around
  // if(player.position.x < -width){
  //   player.position.x = width*2;
  // } 
  // else if(player.position.x > width*2){
  //   player.position.x = 0;
  // }
  // if(player.position.y < -height){
  //   player.position.y = height*2;
  // } 
  // else if(player.position.y > height*2){
  //   player.position.y = 0;
  //  } 

   if(player.position.x < 0){
    player.position.x = width;
  } 
  else if(player.position.x > width){
    player.position.x = 0;
  }
  if(player.position.y < 0){
    player.position.y = height;
  } 
  else if(player.position.y > height){
    player.position.y = 0;
   } 


  //. console.log('Sending Human data');

    var data = {
      x: player.position.x,
      y: player.position.y,
      color: player.color,
      name: player.name
    };
    socket.emit('update', data);

    // image(pixelLayer, 0, 0, sketchWidth, 0);
    // image(drawingLayer, 0, 0, sketchWidth, 0);
    // image(playerLayer, 0, 0, sketchWidth, 0);
   // imageMode(CENTER);
    // rotateX(frameCount * 0.01);
    // rotateY(frameCount * 0.01);
  
  
    image(pixelLayer, 0, 0);
    image(drawingLayer, 0, 0);
    image(playerLayer, 0, 0);
    playerLayer.clear();
    pixelLayer.clear();
    
}



class human {
  constructor(x, y, size, name, textGrow, color){
    this.x = x;
    this.y = y;
    this.position = createVector(x, y);
    this.size = size;
    this.name = name;
    this.textGrow = textGrow;
    this.color = color;
  }
  
  move(){
    let vel = createVector(mouseX-width/2, mouseY- height/2);
    vel.setMag(playerSpeed);
    this.position.add(vel);
  }
  
    display(){
      playerLayer.fill(this.color);
    //  console.log(this.color); sometimes the player is white for no reason?
      playerLayer.ellipse(this.position.x, this.position.y, this.size, this.size);
      playerLayer.textSize(this.textGrow);
      playerLayer.fill(255);
      playerLayer.textAlign(CENTER);
      playerLayer.text(this.name, this.position.x,this.position.y+1);
      playerLayer.fill(0, 102, 153, 51);
    }
    paint(){
      let x = this.position.x;
      let y = this.position.y;


      for(let i=foods.length-1;i>0;i--){
        let d = dist(foods[i].x, foods[i].y, particles[i].x, particles[i].y);
        // line(foods[i].x, foods[i].y, particles[i].x, particles[i].y);
        if (d < 50) {
          particles[i].x = lerp(particles[i].x, foods[i].x, 0.1);
          particles[i].y = lerp(particles[i].y, foods[i].y, 0.1);
        } 
      }
     

     

      if(keyIsDown(32)){
       
      push();
  
      // drawingLayer.noStroke();
      // drawingLayer.fill(lineColor);

      // drawingLayer.ellipse(x, y, 10, 10);

      let food = new Food(x, y);
      foods.push(food);
      food.display();

      // try making an ellipse object so that the pixels move towards the color lines
      
     
      pop();
      var data = {
        x: x,
        y: y
       }
   
       socket.emit('paint', data); 
       
      }
      
    }
  }

  class Particle {
    constructor(x, y, size, color) {
      this.x = x;
      this.y = y;
  
      this.size = size;
      this.color = color;
  
      this.xOffset = random(0, 1000);
      this.yOffset = random(1000, 2000);
    
    }
  
    display(){
      pixelLayer.noStroke();
      pixelLayer.fill(this.color, 100);
      //glow(color(255), 8);
      pixelLayer.rect(this.x, this.y, this.size, this.size);

      push();
      pixelLayer.rectMode(CENTER);
      pixelLayer.noFill();
      pixelLayer.stroke(255);
      pixelLayer.strokeWeight(4);
      pixelLayer.rect(width/2, height/2, width, height);
      pop();
    }
  
    playMove(){
      let xMovement = map( noise(this.xOffset), 0, 1, -1, 1 );
      let yMovement = map( noise(this.yOffset), 0, 1, -1, 1 );
  
      // update our position
      this.x += xMovement;
      this.y += yMovement;
  
      // handle wrap-around
      // if (this.x > width*2) {
      //   this.x = 0;
      // }
      // else if (this.x < -width) {
      //   this.x = width*2;
      // }
      // if (this.y > height*2) {
      //   this.y = 0;
      // }
      // else if (this.y < -height) {
      //   this.y = height*2;
      // }

      if (this.x > width) {
        this.x = 0;
      }
      else if (this.x < 0) {
        this.x = width;
      }
      if (this.y > height) {
        this.y = 0;
      }
      else if (this.y < 0) {
        this.y = height;
      }

    
   
  
        // update our noise offset values
        this.xOffset += 0.01;
        this.yOffset += 0.01;
    }
  }


  class Food {
    constructor(x, y){
      this.x = x;
      this.y = y;
    }
    display(){
       // gradient code adapted from https://happycoding.io/tutorials/p5js/for-loops/vertical-gradient


      const m = 100;

      const topR = 255 * noise(frameCount / m);
      const topG = 255 * noise(1000 + frameCount / m);
      const topB = 255 * noise(2000 + frameCount / m);
      const bottomR = 255 * noise(3000 + frameCount / m);
      const bottomG = 255 * noise(4000  + frameCount / m);
      const bottomB = 255 * noise(5000 + frameCount / m);

      const topColor = color(topR, topG, topB);
      const bottomColor = color(bottomR, bottomG, bottomB);
      
      const lineColor = lerpColor(topColor, bottomColor, 1);
      drawingLayer.noStroke();
      drawingLayer.fill(lineColor);

      drawingLayer.ellipse(this.x, this.y, 10, 10);

    }
  }

  function windowResized() {
    sketchWidth = document.getElementById("p5").offsetWidth;
   sketchHeight = document.getElementById("p5").offsetHeight;
 
    canvas.resize(sketchWidth, sketchHeight);
    // playerLayer.size(sketchWidth, sketchHeight);
    // drawingLayer.size(sketchWidth, sketchHeight);
    // pixelLayer.size(sketchWidth, sketchHeight);
    // startLayer.size(sketchWidth, sketchHeight);
}

window.onkeydown = function(e) { 
  return !(e.keyCode == 32);
};



