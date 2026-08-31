const Users = require('../../models/users');
const Connections = require('../../models/connections');
const auth = require('../../middlewares/auth');
const express = require('express');

const feedPeopleRouter = express.Router();

feedPeopleRouter.get("/feed/people", auth, async(req, res)=>{
    try {
        const loggedInUser = req.user._id;
    } catch (error) {
        
    }
});