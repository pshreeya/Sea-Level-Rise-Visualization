/**
  * Represents a starry background surrounding the initial globe scene
  */
class Stars {
    /**
     * Creates a star field with a given number of stars.
     * 
     * @param {number} numStars - The number of stars to generate.
     * 
     * @returns {Stars} A new instance of the Stars class.
     */
    constructor(numStars) {
        this.numStars = numStars;
        this.stars = this.generateStars();
    }
  
    /**
     * Generates an array of randomly positioned stars in a spherical distribution.
     * 
     * @returns {Array} An array of star objects with positions.
     */
    generateStars() {
      let stars = [];
      //every iteration generates a new star and places it on a random position
      for (let i = 0; i < this.numStars; i++) {
        let star = this.randomSpherePoint();
        
        //modulo used to slightly scale up every 10th star for different radius
        if (i % 10 === 0) {
            star.pos.mult(1.1); //moved further away from the sphere's centre
        }
        
        stars.push(star); //adds each generated star to the array
      }
      return stars;
    }
    
    /**
     * Generates a random coordinate of a point on a sphere's surface to position a star.
     * 
     * @returns {Object} An object containing the star's position vector and color.
     */
    randomSpherePoint() {
        const radius = random(2.5, 3.0);
        const u = random();
        const v = random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);

        let x = radius * sin(phi) * cos(theta);
        let y = radius * sin(phi) * sin(theta);
        let z = radius * cos(phi);

        return {
            pos: createVector(x, y, z),
            color: color(`hsl(${map(radius, 2.5, 3.0, 200, 240)}, 80%, 70%)`),
        };
    }
    /**
     * Renders the star field in 3D space.
     *
     * @returns {void} Does not return a value.
     */
    draw() {
        //iterates through each star in the this.stars array
        this.stars.forEach(star => {
            push();
            translate(star.pos.x, star.pos.y, star.pos.z);
            fill(star.color);
            noStroke();
            sphere(0.007);
            pop();
        });
    }
}

//makes the class globally accessible 
window.Stars = Stars;