/**
*Represents a country affected by sea level rise on a 3D globe. Each instance of this class stores a country's name, its geographic coordinates,
 and its respective sea level rise.
*/
class CountryPin {
  /**
     * Constructs a CountryPin object representing a country affected by sea level rise.
     * 
     * @param {string} name - Name of a country.
     * @param {number} latitude - Latitude of a country.
     * @param {number} longitude - Longitude of a country.
     * @param {number} seaLevelRise - The projected sea level rise in cm.
     *
     * @returns {CountryPin} A new instance of the CountryPin class.
     */
    constructor(name, latitude, longitude, seaLevelRise) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.seaLevelRise = seaLevelRise;
    }
  
    /**
     * Determines the color representation of the country based on sea level rise.
     * 
     * @returns {string} A color string in RGB format representing the severity of sea level rise.
     */
    getColor() {
        if (this.seaLevelRise > 10) {
          return 'rgb(3, 32, 252)';
        }
        if (this.seaLevelRise > 5) {
          return 'rgb(3, 215, 252)';
        }
        if (this.seaLevelRise >= 0){
          return 'rgb(166, 45, 247)';
        }
        else{
          return 'rgb(186, 247, 45)';
        }
    }
    
    /**
     * Draws the countries' pins to visually represent their respective location and sea level rise data.
     * 
     * @returns {void} Does not return a value. 
     */
    draw() {
        fill(this.getColor());
        let lat = radians(90 - this.latitude);
        let lon = radians(this.longitude + 90);
        let x = 0.5 * sin(lat) * cos(lon);
        let y = 0.5 * cos(lat);
        let z = 0.5 * sin(lat) * sin(lon);

        push();
        translate(x, y, z);
        sphere(0.01);
        pop();
    }
}

//makes the class globally accessible 
window.CountryPin = CountryPin;
