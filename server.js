var blobs = [];

function Blob(id, x, y, color, name){
    this.id = id;
    this.x = x;
    this.y = y;
    this.color = color;
    this.name = name;
}

var express = require('express');

var app = express();
//var server = app.listen(3000);

// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}


app.use(express.static('public'));

console.log("My socket server is running");

var socket = require('socket.io');

var io = socket(server);

setInterval(heartbeat, 33);
function heartbeat(){
    io.sockets.emit('heartbeat', blobs);
}

io.sockets.on('connection', newConnection);



var onlineCounter = 0;



//document.getElementById("online").innerHTML = onlineCounter;

function newConnection(socket) {
  //  console.log('new connection: ' + socket.id);
   // updateDisplay();

    socket.on('start', startPlayer);

    socket.on('update', updatePlayer);

    socket.on('player', playerDetails);

    socket.on('paint', paintDetails);
    
    socket.on('disconnect', disconnect);

    function startPlayer(data){
        console.log(socket.id + " " + data.x + " " + data.y + " " + data.color + " " + data.name);
        var blob = new Blob(socket.id, data.x, data.y, data.color, data.name);
        blobs.push(blob);
       // onlineCounter++;
       

       // send a message with client id so we're not replicating ourselves every heatbeat
       
    }

    function updatePlayer(data){
      //  console.log(socket.id + " " + data.x + " " + data.y);
        var blob;
        // improve with dictionary, array will do for now
        for(var i = 0; i < blobs.length; i++){
            if (socket.id == blobs[i].id){
                blob = blobs[i];
            }
        }
        blob.x = data.x;
        blob.y = data.y;
        blob.color = data.color;
        blob.name = data.name;
    }


    function playerDetails(data){
        socket.broadcast.emit('player', data);
        // io.sockets.emit('mouse', data);
      //  console.log(data);
    }

    function paintDetails(data){
        socket.broadcast.emit('paint', data);
        // io.sockets.emit('mouse', data);
       //  console.log(data);
    }

    function disconnect(){
        blobs.splice(blobs.findIndex(elem => elem.id === socket.id), 1);
        console.log("player has left the server bye bye");
     //   onlineCounter--;
    }


}

// function updateDisplay(){
//     online.innerHTML = onlineCounter;
//     console.log(onlineCounter);
// };


