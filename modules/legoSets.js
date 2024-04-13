require('dotenv').config();
const Sequelize = require('sequelize');

const setData = require("../data/setData.json");
const themeData = require("../data/themeData.json");

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { 
            require: true, 
            rejectUnauthorized: false
        }
    },
});

const Theme = sequelize.define('Theme', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING
}, {
    tableName: 'Themes',
    timestamps: false
});

const Set = sequelize.define('Set', {
    set_num: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Theme,
            key: 'id'
        }
    },
    img_url: Sequelize.STRING,
}, {
    tableName: 'Sets',
    timestamps: false
});
Set.belongsTo(Theme, { foreignKey: 'theme_id' });

async function initialize() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (error) {
        console.error('Database not connected:', error);
    }
}

async function getAllSets() {
    try {
        return await Set.findAll({ include: [Theme] });
    } catch (error) {
        console.error("Sorry try again Error in displaying all Sets:", error);
        throw error;
    }
}

async function getSetByNum(setNum) {
    try {
        const set = await Set.findOne({
            where: { set_num: setNum },
            include: [Theme]
        });
        return set;
    } catch (error) {
        console.error("Sorry try again Error in displaying all Sets by set numberr:", error);
        throw error;
    }
}

async function addSet(setData) {
    try {
        await Set.create(setData);
    } catch (error) {
        console.error("Error in adding the set:", error);
        throw error;
    }
}

async function editSet(setNum, setData) {
    try {
        await Set.update(setData, {
            where: { set_num: setNum }
        });
    } catch (error) {
        console.error("Error in editing the set:", error);
        throw error;
    }
}

async function deleteSet(setNum) {
    try {
        await Set.destroy({
            where: { set_num: setNum }
        });
    } catch (error) {
        console.error("Error in deleting the set:", error);
        throw error;
    }
}

async function getThemes() {
    try {
        return await Theme.findAll();
    } catch (error) {
        console.error("Error in extracting themes:", error);
        throw error;
    }
}

async function addTheme(themeData) {
    try {
        await Theme.create(themeData);
    } catch (error) {
        console.error("Error in adding theme:", error);
        throw error;
    }
}

module.exports = {initialize,getAllSets,getSetByNum,addSet,editSet,deleteSet,getThemes,addTheme
};
