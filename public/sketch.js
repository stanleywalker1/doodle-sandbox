let nameInput, nameButton, greeting, startButton;
var socket;
let player, playerName, playerSize, playerSpeed;
let pallete;
let colorPicker;
let players = [];
let particles = [];
let foods = [];
let state = 0;
let paint = 0;
let sketchHeight, sketchWidth;
let img, song, test;
let studio, github, info;
let canvas, playerLayer, drawingLayer, pixelLayer;
let mobileButton;


function preload() {
  img = loadImage('media/background.PNG');
  song = loadSound("media/lowfi.mp3");
  test = loadImage('media/test.png');


}


function setup() {
  sketchWidth = document.getElementById("p5").offsetWidth;
  sketchHeight = document.getElementById("p5").offsetHeight;
  canvas = createCanvas(sketchWidth, sketchHeight);
  canvas.parent("p5");
  playerLayer = createGraphics(sketchWidth, sketchHeight);
  drawingLayer = createGraphics(sketchWidth, sketchHeight);
  pixelLayer = createGraphics(sketchWidth, sketchHeight);
  studio = document.getElementById("personalweb");
  github = document.getElementById("github");
  info = document.getElementById("infoContainter");

 
  

  startPageLayout();

  mobileButton = new Button(width/2-20, height-100, test);

 
  
  

  // https for running online, local host for local 
  socket = io.connect('https://doodle-sandbox.herokuapp.com');
//  socket = io.connect('localhost:3000');

  // details about player attributes 
  playerSize = 50;
  playerSpeed = 2.5;
  textGrow = 15;
  pallete = [color('#7400b8'), color('#e67e22'), color('#5e60ce'), color('#5390d9'), color('#4ea8de'), color('48bfe3,'), color('#56cfe1'), color('#64dfdf'), color('#72efdd'), color('#80ffdb')];
  colorPicker = random(pallete); 

  // initializing a dummy player
  player = new human(width/2, height/2, playerSize, playerName, textGrow, colorPicker);
  

  noiseDetail(24); 

  // initializing the background particles
  for (let i = 0; i <  800; i++){
    let tempParticle = new Particle(random(width), random(height), 5, random(pallete));
    particles.push(tempParticle);
  }

  // connecting server for paint values
  socket.on('paint', updateCanvas);

  // sending server data about current client
  var data = {
    x: player.position.x,
    y: player.position.y,
    color: player.color,
    name: player.name
   };
   socket.emit('start', data);

   // throttle for the rate data is being sent to server
   socket.on('heartbeat', 
    function(data){
      players = data;
    }
   );
 }

 // updating paint canvas
 function updateCanvas(data){
  let food = new Food(data.x, data.y);
  food.display();
}

function draw() {
  if (state == 0) {
    startPage();
  } else if (state == 1){
    gamePlay();
  } 
  // working on mobile 
  if (window.matchMedia("(max-width: 767px)").matches) {
    mobileButton.display();
   // test.mousePressed(changeBG);
  } 
}

// html elements for start page
function startPageLayout(){
  startLayer = createGraphics(sketchWidth, sketchHeight);
  nameInput = createInput().attribute('placeholder', 'Enter a name');;
  nameInput.parent("startElements");
  nameInput.id("input");
  let div = createDiv();
  div.parent('startElements');
  div.style('margin-left', '10px');
  nameButton = createButton('start');
  nameButton.parent(div);
  nameButton.id("start");
  nameButton.mousePressed(nameSent);
}

// p5 elements for start page
function startPage(){
  background(50);
  img.resize(width, height);
  image(img, 0, 0);

  fill(255);
  textSize(40);
  textAlign(CENTER);
  textFont('monospace');
  text('DOODLE SANDBOX', width/2, height*0.4);
}
// when start button is pressed, switch to game state and play song
function nameSent(){
  playerName = nameInput.value();
  player = new human(width/2, height/2, playerSize, playerName, textGrow, colorPicker);
  state = 1;
  song.play();
  song.loop();
}

function gamePlay(){
  nameInput.remove();
  nameButton.remove();
  studio.remove();
  github.remove();
  info.remove();

  background(0);
  
  translate(width/2-player.position.x, height/2-player.position.y);
  
  for(let i = particles.length -1; i >= 0; i--){
    particles[i].playMove();
    particles[i].display();
  }
  // checking to see if the server is trying to re-render myself, without this there will be x2 versions of your player
  for(let i = players.length -1; i >= 0; i--){
    var id = players[i].id;
    if(id !== socket.id){
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


  // sending data in real time about your player to update the server and other clients 

    var data = {
      x: player.position.x,
      y: player.position.y,
      color: player.color,
      name: player.name
    };
    socket.emit('update', data);
    
    //trying to fix buffers on window resize, ignore
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


// class for each player
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
     
      if(keyIsDown(32)){
       
      push();
      let food = new Food(x, y);
      foods.push(food);
      food.display();
     
      pop();
      var data = {
        x: x,
        y: y
       }
       socket.emit('paint', data); 
       
      }

    }
  }
// class for the background particle
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

// class for the paint, i wanted to make it into food for the particles, hence the name; this will come soon
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

      if(keyIsDown(38) || keyIsDown(87)){
      for(let i=particles.length-1;i>0;i--){
        let d = dist(this.x, this.y, particles[i].x, particles[i].y);
        fill(255);
        stroke(255);
        
        if (d < 80) {
        //  line(this.x, this.y, particles[i].x, particles[i].y);
          particles[i].x = lerp(particles[i].x, this.x, 0.1);
          particles[i].y = lerp(particles[i].y, this.y, 0.1);
          //trying to keep particles attracted to paint trials, ignore
          // particles[i].x = constrain(this.x, particles[i].x, particles[i].x+20);
          // particles[i].y = constrain(this.y, particles[i].y, particles[i].y+20);
       }
     }
    }
    }
  }

  function windowResized() {
   sketchWidth = document.getElementById("p5").offsetWidth;
   sketchHeight = document.getElementById("p5").offsetHeight;
 
    canvas.resize(sketchWidth, sketchHeight);

   
    //trying to fix buffers on window resize, ignore
    // playerLayer.size(sketchWidth, sketchHeight);
    // drawingLayer.size(sketchWidth, sketchHeight);
    // pixelLayer.size(sketchWidth, sketchHeight);
    // startLayer.size(sketchWidth, sketchHeight);
  
}

// stop space bar from moving the page down
window.onkeydown = function(e) { 
  return !(e.keyCode == 32);
};


  // nameButton.parent(div);
  // nameButton.id("start");
  // nameButton.mousePressed(nameSent);
//let link = document.querySelector(".theme-btn.btn-style-four");



function changeBG() {
console.log('pressed');
}

class Button {
  // adapted from here: https://editor.p5js.org/kjhollen/sketches/dHOoxK_hD
  
  constructor(inX, inY, inImg) {
    this.x = inX;
    this.y = inY;
    this.img = inImg;
  }

  display() {
    stroke(0);
    
    // tint the image on mouse hover
    if (this.over()) {
      tint(204, 0, 128);
    } else {
      noTint();
    }
    
    image(this.img, this.x, this.y);
  }
  
  // over automatically matches the width & height of the image read from the file
  // see this.img.width and this.img.height below
  over() {
    if (mouseX > this.x && mouseX < this.x + this.img.width && mouseY > this.y && mouseY < this.y + this.img.height) {
      return true;
    } else {
      return false;
    }
  }
}


