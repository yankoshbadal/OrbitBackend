//NEED TO BE CHANGED

const express = require('express');
const auth = require('../../middlewares/auth')

const profileRoute = express.Router();

profileRoute.get('/profile',auth, async(req, res)=>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){res.send("err")}
});

module.exports = profileRoute;