/**
 * Simulates the gradual rise of sea levels over time. 
 */

class FloodSimulation {
    /**
     * Constructs a FloodSimulation object to simulate rising sea levels over time.
     * 
     * @param {number} initialLevel - The initial water level before water starts to rise.
     * @param {number} secondWaterLevel - Another water level at a different reference point to show water doesn't rise evenly everywhere 
     * @param {number} riseAmount - The total amount by which the sea level will rise.
     * @param {number} duration - The time in milliseconds over which the rise occurs. 
     *
     * @returns {FloodSimulation} A new instance of the FloodSimulation class.
     */
    constructor(initialLevel, secondWaterLevel, riseAmount, duration) {
        this.level1 = initialLevel;
        this.level2 = secondWaterLevel;
        this.riseAmount = riseAmount;
        this.duration = duration;
        this.startTime = null;
        this.rising = false;
    }
    /**
     * Starts the flooding simulation by recording the start time and setting 'rising' to true.
     * 
     * @return {void} Does not return a value. 
     */
    start() {
        this.startTime = millis();
        this.rising = true;
    }
    /**
     * Updates the flood simulation over time, adjusting water levels based on elapsed time.
     *
     * @returns {void} Does not return a value.
     */
    update() {
        if (this.rising) {
            let elapsedTime = millis() - this.startTime; //calculates time that has passed since the rise started
            let riseProgress = constrain(elapsedTime / this.duration, 0, 1);
            //calculates and stores how much water should rise
            this.level1 = 100 - (riseProgress * this.riseAmount * 0.5); 
            this.level2 = 150 - (riseProgress * this.riseAmount * 0.5);
        }
    }
}

//makes the class globally accessible 
window.FloodSimulation = FloodSimulation;
