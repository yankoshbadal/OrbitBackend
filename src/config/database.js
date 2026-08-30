const mongoose = require("mongoose");

//Connecting to the DB part1
const connectDB = async()=>{
    await mongoose.connect(
        "mongodb+srv://yankoshbadal_db_user:bx5Q54LKcDHzyq2s@orbitcluster0.ppsun5k.mongodb.net/OrbitDataBase"
    );
    console.log("Database Connected Successfully");
};

module.exports = connectDB;