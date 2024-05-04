const { Sequelize } = require('sequelize');
require("dotenv").config()

const sequelize = new Sequelize(process.env.DB_URI);

async function connecttoDB() {
    try {
        await sequelize.authenticate();
        console.log("connection successfully established")
    } catch (e) {
        console.log(e.message)
    }
}

module.exports = {
    connecttoDB,
    sequelize
}