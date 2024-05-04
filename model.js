const { DataTypes } = require("sequelize");
const { sequelize } = require("./connection");

const dataSchema = sequelize.define('data', {
    name: { type: DataTypes.STRING, allowNull: false },
    file: { type: DataTypes.BLOB, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
}, {
    timestamps: false // This adds createdAt and updatedAt columns
});

// dataSchema.findAll().
//     then(console.log).
//     catch((e)=>{console.log(e.message)})

module.exports = {dataSchema}