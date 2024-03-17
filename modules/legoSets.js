const setData = require("../data/setData");
const themeData = require("../data/themeData");
let sets = [];

function initialize() {
    return new Promise((resolve, reject) => {
        try {
            // Reset 'sets' to ensure it's empty before initialization
            sets = [];
            setData.forEach((set, index) => {
                // Find the corresponding 'theme' based on 'theme_id'
                const theme = themeData.find(themeItem => themeItem.id === set.theme_id);
  
                // Append 'theme' property to the set; use "Unknown Theme" if not found
                sets.push({
                    ...set,  // Spread operator to copy properties from 'set'
                    theme: theme ? theme.name : "NO THEME MATCHED"  
                });
            });

            resolve();  // Resolve the promise after all sets have been processed
        } catch (error) {
            reject(`Initialization rejected: ${error}`);  // Reject the promise with an error message
        }
    });
}
  

  function getAllSets() {
    return sets;
}


function getSetByNum(setNum) {
    console.log("Searching for set number:", setNum); // Debug log
    const set = sets.find(set => set.set_num === setNum);
    if (!set) {
        console.log("Set not found:", setNum); // If not found, log an informative message
    }
    return set || null;
}

function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
        // Check if 'theme' parameter is provided and not empty
        if (!theme || typeof theme !== 'string' || theme.trim() === '') {  //if the conditions did not match as per the requirements 
            reject("Invalid theme parameter provided.");  //so it will display a typeof error message 
            return;
        }

        // Converting the 'theme' to lowercase 
        const themeLower = theme.toLowerCase();

        // Filter the 'sets' array to find matches
        const filteredSets = sets.filter(set => set.theme.toLowerCase().includes(themeLower));

        // Check if any sets were found
        if (filteredSets.length > 0) {
            resolve(filteredSets);  // Resolve the promise with the filtered sets
        } else {
            reject(`No sets found with theme containing "${theme}".`);  // Reject the promise if no sets match
        }
    });
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }

initialize().then(() => {
    console.log('All sets have been initialized successfully!');
  }).catch((error) => {
    console.error(error);
  });
// console.log(sets);




//CALLING ALL THE DEFINED FUNCTIONS 
initialize(); 
console.log("---------------------------------------------------------------");
console.log(getAllSets());
console.log("---------------------------------------------------------------");
console.log(getSetByNum("19741980-1"));
console.log("---------------------------------------------------------------");

console.log(getSetsByTheme("Books"));