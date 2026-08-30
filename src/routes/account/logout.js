const express = require("express");
const logoutRouter = express.Router();


logoutRouter.post('/logout', (req, res)=>{
    res.cookie ('token', null, {expires:new Date(Date.now())});
    res.send("Logout Successfull");
});

module.exports = logoutRouter;