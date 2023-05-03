"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var data = require("./ranges.json");
// To run this script use: npm run fill_db, it will create a js file
// This script creates the ranges table and fill it with the data from ranges.json
var sequelize = new sequelize_1.Sequelize("postgresql://postgres:N9BaDJO5aYmruvEftKGF@containers-us-west-72.railway.app:5890/amcham", {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    dialect: "postgres",
});
var sequelize_2 = require("sequelize");
var Range = sequelize.define("Range", {
    range_id: {
        type: sequelize_2.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    range_type: {
        type: sequelize_2.DataTypes.STRING(50),
        allowNull: false,
    },
    from_range: {
        type: sequelize_2.DataTypes.FLOAT(10, 2),
        allowNull: false,
    },
    to_range: {
        type: sequelize_2.DataTypes.FLOAT(10, 2),
        allowNull: false,
    },
    base: {
        type: sequelize_2.DataTypes.FLOAT(8, 2),
        allowNull: false,
    },
    excess_percentage: {
        type: sequelize_2.DataTypes.FLOAT(2, 2),
        allowNull: false,
    },
    can_delete: {
        type: sequelize_2.DataTypes.BOOLEAN,
        defaultValue: false,
    },
});
Range.bulkCreate(data).then(function () {
    console.log("Created");
    sequelize.close();
});
