/**
* Represents a pin marking the location of Tokyo, Japan, on the 3D globe.
*/

class TokyoPin {
    /**
     * Constructs a TokyoPin object with predefined coordinates and color.
     * 
     * @returns {TokyoPin} A new instance of the TokyoPin class.
     */
    constructor() {
      //latitude and longitude coordinates of Tokyo
      this.lat = 35.8688;
      this.lon = 320;
    
      //color of the pin
      this.color = 'rgb(242, 165, 70)';
    }
    /**
      * calculates the 3D location of Tokyo on the globe using the 2D coordinates.
      *
      * @returns {void} Does not return a value.
    */
    draw() {
      let lat = radians(90 - this.lat);
        let lon = radians(this.lon + 90);
      let x = 0.5 * sin(lat) * cos(lon);
        let y = 0.5 * cos(lat);
        let z = 0.5 * sin(lat) * sin(lon);
      
      //renders the pin at that particular location
      push();
      fill(this.color);
      translate(x, y, z);
      sphere(0.02);
      pop();
    }
  }

//makes the class globally accessible 
window.TokyoPin = TokyoPin;
  