/********************************************************************************

* WEB322 – Assignment 05

* 

* I declare that this assignment is my own work in accordance with Seneca's

* Academic Integrity Policy:

* 

* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html

* 

* Name: SURYANSH Student ID: 138004239 Date: 12-04-2024

*

* Published URL: https://tan-hermit-crab-yoke.cyclic.app

*

********************************************************************************/

const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path'); 
const legoData = require('./modules/legoSets');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

legoData.initialize().then(() => {
    console.log("The Lego data initialization got successfully.");
    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
}).catch((error) => {
    console.error("Initialization of lego data failed:", error);
});

app.get('/', (req, res) => {
    res.render("home", { page: "/" });
});

app.get('/about', (req, res) => {
    res.render("about", { page: "/about" });
});

app.get("/lego/sets", async (req, res) => {
    try {
        const allSets = await legoData.getAllSets();
        res.render("sets", { sets: allSets });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/lego/sets/:set_num', async (req, res) => {
    try {
        const set = await legoData.getSetByNum(req.params.set_num);
        if (set) {
            res.render('set', { set });
        } else {
            res.status(404).render("404", { message: "Lego set not found." });
        }
    } catch (error) {
        res.status(500).render("500", { message: "Error finding the set." });
    }
});

app.get('/lego/addSet', async (req, res) => {
    try {
        const themes = await legoData.getThemes();
        res.render("addSet", { themes });
    } catch (error) {
        console.error("Error loading themes:", error);
        res.status(500).render("500", { message: error.message });
    }
});

app.get('/lego/editSet/:num', async (req, res) => {
    try {
        const set = await legoData.getSetByNum(req.params.num);
        if (!set) {
            res.status(404).render("404", { message: "Set not found" });
        } else {
            const themes = await legoData.getThemes();
            res.render("editSet", { set, themes });
        }
    } catch (error) {
        console.error("Error loading set for editing:", error);
        res.status(500).render("500", { message: error.message });
    }
});

app.post('/lego/editSet', async (req, res) => {
    try {
        await legoData.editSet(req.body.set_num, req.body);
        res.redirect('/lego/sets');
    } catch (error) {
        console.error("Error editing set:", error);
        res.status(500).render("500", { message: error.message });
    }
});

app.get('/lego/deleteSet/:num', async (req, res) => {
    try {
        await legoData.deleteSet(req.params.num);
        res.redirect('/lego/sets');
    } catch (error) {
        res.status(500).render("500", { message: `Failed to delete set: ${error.message}` });
    }
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
});

module.exports = app;
