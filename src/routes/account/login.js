const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../../models/users"); 

const loginRouter = express.Router();

loginRouter.post("/login",async(req, res)=>{
        try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).send("No such user found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send("Invalid password");
        } else if(isPasswordValid){ 
            const token = await jwt.sign({ id: user._id },"YankoshTheBoss",{ expiresIn: "30d" }); // Create a JWT that only has an id
            res.cookie("token", token); //token as cookie
            res.status(200).send("Login successful");
        };
        
    } catch (err) {
        res.status(500).send(err.message);
    }
})

module.exports = loginRouter;