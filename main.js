/*
  Name: Sea Level Rise Data Visualization & Simulation
  Purpose: To visualize data of the rise of sea levels from 1993 to 2023 and simulate the projected impact on Tokyo City, Japan from 2020 to 2050.
  Author:  Shreeya Prasanna
  Created: 08-March-2025
  Updated: 23-March-2025
  Data obtained from: US Gouvernment https://earth.gov/sealevel/sea-level-explorer/
  Stars class inspired from: https://youtu.be/f4zncVufL_I
*/

//initializing for textures, visuals and data
let cityTexture;
let earthTexture;
let font;
let stars;
let tokyopin;
let legend;
let seaLevelData;

//initializing for flooding simulation 
let yoff = 0; //offset for perlin noise water waves
let rising = false;
let showWaves = false; //controls wave visibility
let floodSimulation;

//initializing for different scene management 
let startTime; //tracks transition timing between scenes 
let inFloodScene = false;

//initializing for hand tracking (WebXR interaction)
let leftHand, rightHand;

//initializing for camera position and motion
let globeRotation = 0;
let zoomLevel = 0;

//initializing for transporting (moving between scenes)
let selectedCity = "Tokyo, Japan";
let transporting = false; //controls whether the right hand controller is activated 
let transportStartTime = 0; 
let transportProgress = 0;//tracks process of the zoom transition animation


/**
  * preloads the VRCanvas and nessessary assets 
  *
  * @returns {void} Doesn't return anything. 
  */

function preload() {
  createVRCanvas();
  earthTexture = loadImage("assets/globe - Copy.jpg"); //earth texture for 3D globe
  font = loadFont("assets/OpenSans-Regular.ttf");
  cityTexture = loadImage("assets/tokyo3601.jpg"); //background image for Tokyo City scene
  seaLevelTable = loadTable("sealevelinfo.csv", "csv", "header"); 
}

/**
  * uses classes to instantiate objects for different visual elements that appear later in the program
  *
  * @returns {void} Doesn't return anything. 
  */

function setup() {
  pixelDensity(3);
  noStroke();
  textFont(font);
  startTime = millis(); //start time initialization for flooding animation
  
  //instantiating new objects from corresponding classes
  stars = new Stars(numStars = 500) 
  
  seaLevelData = new SeaLevelData(seaLevelTable); 
  
  floodSimulation = new FloodSimulation(100, 150, 20, 3000); 
  
  tokyopin = new TokyoPin(); 
  
  legend = new Legend(); 
}

/**
  * manages the visualization flow and scene switching
  *
  * @returns {void} Doesn't return anything
  */

function draw() {
  background(0);
  
  //enables use of left and right hand controllers for VR interaction 
  leftHand = getXRInput(LEFT); 
  rightHand = getXRInput(RIGHT);
  
  //handles scene transitions
  if (transporting) { 
    handleTransport(); 
  } else if (inFloodScene) {
    drawFloodingScene();
  } else {
    drawGlobeScene();
  }
}

/**
  * renders the 3D rotating globe and enables user interaction 
  *
  * @returns {void} Doesn't return anything
  */

function drawGlobeScene() {
  drawThumbstickBlocks(); //draws hand controllers for interaction
  
  //left hand controller rotates the globe clockwise and counterclockwise
  if (leftHand) globeRotation += leftHand.thumbstick2D.x * 0.01; 
  
  //right hand controller triggers a zoom-in transport effect when zoomed far enough
  if (rightHand && rightHand.thumbstick2D.y < -0.5) { 
      zoomLevel -= 0.02;  
      if (zoomLevel < -2) {
        startTransport(); 
      }
    }
  
  setViewerPosition(0, 0, zoomLevel);
  
  push(); 
  translate(0, 0, -1);
  scale(-1, 1, 1); //flipped along x-axis to ensure the texture is in proper orientation
  rotateY(globeRotation);
  texture(earthTexture);
  sphere(0.5, 50, 50); //renders Earth with a texture that is wrapped around sphere

  seaLevelData.getCountries().forEach(country => country.draw()); //iterates through the list of countries and draws all respective pins on the 3D globe
  
  tokyopin.draw(); //draws the Tokyo pin on globe
  legend.draw(); //shows the legend right above globe
  stars.draw(); //draws the starry background
  pop();
}

/**
  * executes the transition from the globe scene to the flood simulation scene. 
  *
  * @returns {void} Doesn't return anything
  */

function startTransport() {
  transporting = true;
  transportStartTime = millis();
  transportProgress = 0;
}

/**
  * manages a smooth zoom-in transition to Tokyo, Japan
  * 
  * @returns {void} Doesn't return anything
  */

function handleTransport() {
  let elapsed = millis() - transportStartTime; //how much time has passed since the transport effect has started 
  transportProgress = constrain(elapsed / 3000, 0, 1); //constrains the value between 0 and 1
  
  zoomLevel = -2 + transportProgress * 2;
  
  background(0);

  push();
  fill(255);
  textSize(0.2); 
  textAlign(CENTER, CENTER);
  translate(0, 1, -1.5);  
  scale(1, -1, 1);
  text("Welcome to Tokyo, Japan!", 0, 0);
  
  textSize(0.15); 
  text("Projected Sea Level Rise from 2020 - 2050: 12cm", 0, 0.25)
  pop();
  
  //checks if 3 seconds have passed after the zoom transition, then switches to the flood simulation scene
  if (elapsed >= 3000) {
    transporting = false;
    inFloodScene = true;
    startTime = millis(); 
  }
}

/**
  * simulates rising sea levels in Tokyo from 2020 to 2050.
  * 
  * @returns {void} Doesn't return anything
  */

function drawFloodingScene() {
  background(0);
  
  //renders the 360 degree Tokyo City texture within the globe
  if (cityTexture) {
    push();
    texture(cityTexture);
    scale(-1, -1, 1);
    translate(0, -350, 0);
    sphere(500, 100, 100);
    pop();
  }
  //adjust camera positioning to make user feel as if they're in Tokyo dome environment
  camera(0, 0, 200, 0, 0, 0, 0, 1, 0);
  translate(0, 100, 0);
  scale(1, -1, 1);
  
  //flood animation starts after 3 seconds 
  if (millis() - startTime >= 3000 && !rising) {
    floodSimulation.start(); 
    showWaves = true;
  }

  floodSimulation.update();
  if (showWaves) drawWater(floodSimulation.level1, floodSimulation.level2);
}

/**
  * Generates water waves using Perlin Noise. 
  * 
  * @param {number} level1 - Represents the initial water level at 2020.
  * @param {number} level2 - Represents the final water level after sea level rise at 2050.
  * 
  * @returns {void} Doesn't return anything. 
  */

function drawWater(level1, level2) {
  fill('rgb(100, 200, 255, 200)');
  stroke(50, 150, 255);
  strokeWeight(1);
  beginShape(TRIANGLE_STRIP); //creates connected triangle strips to form a water surface
  let yoffInner = yoff;
  //loops through z-axis (depth of water plane) in increase of 10 each time
  for (let z = -width / 2; z <= width / 2; z += 10) {
    let xoff = 0;
    //loops through the x-axis (width of water place)
    for (let x = -width / 2; x <= width / 2; x += 10) {
      //perlin noise function is used to generate smooth wave-like height variations
      let y = map(noise(xoff, yoffInner), 0, 1, level1, level2); //map function ensures the height is between level1 and level2 to make waves rise and fall over time
      vertex(x, y, z);
      xoff += 0.1; //shifts the wave pattern horizontally over time
    }
    yoffInner += 0.03; //does the same to the next row of lines
  }
  yoff += 0.03; //shifts the wave pattern vertically over time
  endShape();
}

/**
  * displays hand controllers on the WebXR immersion
  * 
  * @returns {void} Doesn't return anything
  */

function drawThumbstickBlocks() {
  
  // default color: white
  let leftColor = 'rgb(255, 255, 255)';  
  let rightColor = 'rgb(255, 255, 255)'; 
  
  //left hand controller turns pink when toggle moves left or right
  if (leftHand) {
    //checks if the horizontal movement of left controller exceeds a threshold of 2
    //abs ensures it detects movement in both directions
    if (abs(leftHand.thumbstick2D.x) > 0.2) { 
      leftColor = 'rgb(255, 102, 199)'; 
    }
    push();
    fill(leftColor);
    translate(leftHand.position.x, leftHand.position.y, leftHand.position.z);
    box(0.05);
    pop();
  }
  //right hand controller turns yellow when toggle down
  if (rightHand) {
    if (rightHand.thumbstick2D.y < -0.2) { 
      rightColor = 'rgb(255, 243, 115)'; 
    }
    push();
    fill(rightColor);
    translate(rightHand.position.x, rightHand.position.y, rightHand.position.z);
    box(0.05);
    pop();
  }
}

