# doodle-sandbox
Live Demo: [https://doodle-sandbox.herokuapp.com/](https://doodle-sandbox.herokuapp.com)

Tools:
- [p5.js](p5.js)
- [socket.io](socket.io)

This is an experimental project I built for Interactive Computing at NYU.  I challenged myself to create an interactive project that could be experienced collaboratively by people online. I really love the idea of connecting with my friends through a unique medium that doesn’t have many gamified aspects – just simply creative and exploratory. The current stage of the project taps into this feeling by enabling multiplayer functionality with socket.io and offering a creative output through a player-controlled paintbrush and subtle interactive elements.

The website begins on a start page with a simple description, as well as a name input bar. After assigning your player's name, you spawn onto a black canvas with perlin noise-controlled elements floating freely behind you. Your player is constantly moving between the confined canvas with wrap-around functionality to keep you within a set boundary. When holding the space bar, a streak of gradient color is emitted, trailing behind your player's movement. During the entirety of this, your player's position, name, color, and gradient trail data is sent to a server and transmitted back to other players that connect to the lobby. When another player joins, they will begin to see the streak of colors you draw and are provided with the same functionality. This allows people to collectively draw and roam together the space together simultaneously.


In the project directory, you can run:

# `npm install`

Installs required dependancies

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

# `node server.js`

Launches the test server. Alternatively you can run it with VS Code “Go Live” plugin to experience it offline. Make sure to adjust line 51 of sketch.js to match your project, as well as uncommenting line 52 to run locally. 


my main portfolio site: [stanno.us](stanno.us)