/**
 * Represents a visual legend containing color-coded labels for different sea level rise values and a unqiue color pin for Tokyo, Japan for better visualization. 
 * 
 */
class Legend {
    /**
     * Constructs the Legend object containing color-coded labels for different sea level rise values. 
     *
     * @returns {Legend} A new instance of the Legend class.
     */
    constructor() {
      this.labels = [
        { color: 'rgb(3, 32, 252)', text: '> 10 cm' },
        { color: 'rgb(3, 215, 252)', text: '5-10 cm' },
        { color: 'rgb(166, 45, 247)', text: '0-5 cm' },
        { color: 'rgb(186, 247, 45)', text: 'Drop in Sea Level' },
        { color: 'rgb(242, 165, 70)', text: 'Tokyo, Japan' }
      ];
      this.opacity = 255;
      this.showDuration = 7000; // legend will only be shown for 7 seconds
      this.startTime = millis();  // time when the legend started showing 
    }
    
    /**
     * Draws the legend on the screen, displaying color-coded labels for sea level rise levels.
     *
     * @returns {void} Does not return a value.
     */
    draw() {
      // if more than 7 seconds have passed, fade out the legend
        if (millis() - this.startTime > this.showDuration) {
            this.opacity = max(0, this.opacity - 10);  // after 7 seconds, legend will fade away
        }
      push();
      fill(255, this.opacity); 
      textSize(0.1);
      translate(-0.05, 2.35, -1.5);
      textAlign(CENTER, CENTER);
      scale(-1, -1, 1);
      text('Legend: Sea Level Rise from 1993 - 2023', 0, 0);
  
      let yOffset = 0.2;
      let rectSize = 0.1;
      let rectX = -0.7;
      let textX = -0.1;
  
      for (let i = 0; i < this.labels.length; i++) {
        let colorWithOpacity = this.RGBToRGBA(this.labels[i].color, this.opacity);
            fill(colorWithOpacity);
        rect(rectX, yOffset * i + 0.1, rectSize, rectSize); //draws a rectangle for each label with corresponding label color
        fill(255, this.opacity); //applies the opacity to the text
        text(this.labels[i].text, textX, yOffset * i + 0.15); //draws the text of the label next to the rectangle
      }
      pop();  
    }
  
    /**
     * Converts RGB color to RGBA format
     * 
     * @param {string} rgbColor - RGB color in the 'rgb(r, g, b)' format.
     * @param {number} opacity - opacity value.
     * 
     * @returns {string} - RGBA formatted color.
     */
    RGBToRGBA(rgbColor, opacity) {
        const rgb = rgbColor.match(/\d+/g);  // extracts the RGB values of the color as an array
        return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity / 255})`;  // converts the color to RGBA format
    }
}

//makes the class globally accessible 
window.Legend = Legend;
