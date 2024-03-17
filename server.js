/********************************************************************************
*  WEB322 – Assignment 02
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: ____SURYANSH__________Student ID: __138004239_________Date: _____18-02-2024_________
*
********************************************************************************/


const express = require('express');
const path = require('path');
const legoData = require('./modules/legoSets');

const app = express();
const PORT = process.env.PORT||3000; //3000 PATH DEFINED


app.use(express.static('public'));
// Initialize legoData before starting the server
legoData.initialize().then(() => {
    console.log("The Lego data initializiation got successfully.");

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`); //WHERE THE SERVER RUNNING ON PORT LIKE 3000
    });
}).catch((error) => {
    console.error("Initializiation of lego data failed:", error);
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Serve the about.html file for the About route
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Route to get all Lego sets
app.get('/lego/sets', (req, res) => {
    try {
        const allSets = legoData.getAllSets();  // Calling the function directly
        res.json(allSets);  // Respond with the data
    } catch (error) {
        // Handle any potential errors
        res.status(404).send("Error fetching all sets: " + error.message);
    }
});


// Route to demonstrate getSetByNum functionality
// app.get('/lego/sets/set_num', (req, res) => {
//     const knownSetNum = '19741980-1';
//     legoData.getSetByNum(knownSetNum).then((set) => {
//         res.json(set);
//     }).catch((error) => {
//         res.status(404).send("The Required Set not found: " + error);
//     });
// });

app.get('/lego/sets/:set_num', (req, res) => {
    const set = legoData.getSetByNum(req.params.set_num);
    if (set) {
        res.json(set);
    } else {
        res.status(404).send("Lego set not found.");
    }
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});
