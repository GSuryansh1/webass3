/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: ____SURYANSH__________Student ID: __138004239_________Date: _____18-03-2024_________
*
********************************************************************************/



const express = require('express');
const path = require('path');
const legoData = require('./modules/legoSets');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('public'));

legoData.initialize().then(() => {
    console.log("The Lego data initialization got successfully.");

    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("Initialization of lego data failed:", error);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/lego/sets', (req, res) => {
    try {
        const allSets = legoData.getAllSets();
        res.json(allSets);
    } catch (error) {
        res.status(404).send("Error fetching all sets: " + error.message);
    }
});

app.get('/lego/sets/:set_num', async (req, res) => {
    try {
        const set = legoData.getSetByNum(req.params.set_num);
        if (set) {
            res.json(set);
        } else {
            res.status(404).send("Lego set not found.");
        }
    } catch (error) {
        res.status(404).send("Error finding the set.");
    }
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
});
