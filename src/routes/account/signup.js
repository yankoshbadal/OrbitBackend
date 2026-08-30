const express = require("express");
const Users = require("../../models/users");
const bcrypt = require("bcrypt");
//also import middlewares here

const signupRouter = express.Router();

signupRouter.post("/signup", async(req, res) =>{
    try{
        const plainPassword = req.body.password;
        const hashedPassword = await bcrypt.hash(plainPassword, 10); //encrpyting password // install bycrpt

        req.body.password = hashedPassword; // Replace plain password with hashed password

        const user = new Users (req.body);  //req.body REMEMBER always comes in JSON
        
        await user.save(); //to save

        res.send("User added");
    }catch(err){
        res.send(err);
    }
})

module.exports = signupRouter;