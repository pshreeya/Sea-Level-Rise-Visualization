/**
* Processes and extracts sea level rise data from the CSV file and stores it as CountryPin class as an array.
*/

class SeaLevelData {
    /**
     * Extracts relevant information and stores it as an array of CountryPin objects.
     * 
     * @param {object} csvTable - The csv file containing sea level rise data for different countries.  
     *
     * @returns {SeaLevelData} A new instance of the SeaLevelData class.
     */
    constructor(csvTable) {
        this.countries = [];
        //iterates through each row of the csv file
        for (let i = 0; i < csvTable.getRowCount(); i++) {
            let row = csvTable.getRow(i);
            //creates a new CountryPin object for each country in the list
            let country = new CountryPin(
                row.get("name"), //country name 
                parseFloat(row.get("lat")), 
                parseFloat(row.get("lon")),
                parseFloat(row.get("seaLevelRise")) //sea level rise from 1993-2023
            );
            this.countries.push(country); //adds the newly created CountryPin objects to the array
        }
    }
    /**
     * Retrieves the list of country pins with sea level data.
     * 
     * @returns {Array} An array of CountryPin objects representing countries affected by sea level rise.
     */
    getCountries() {
        return this.countries;
    }
}

//makes the class globally accessible 
window.SeaLevelData = SeaLevelData;
