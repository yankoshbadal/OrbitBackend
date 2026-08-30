const express = require('express');
const auth = require('../../middlewares/auth');
const { profileEditValidator } = require("../../config/profileEditValidator");

const profileEditRouter = express.Router();

profileEditRouter.patch("/profile/edit", auth, async(req,res)=>{
    try {
        if(!profileEditValidator(req)){
            throw new Error ("Invalid Edit");
        };
        const loggedInUser = req.user; // from auth (auth gets user form DB using id saved in token)

        Object.keys(req.body).forEach((key)=> {
            return loggedInUser[key] = req.body[key]; 
        });

        await loggedInUser.save();//Save this to particular User document (._id already got from req.user / loggedInUser)
        res.send("Profile Updated")

    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = profileEditRouter;