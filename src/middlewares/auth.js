//cockies and token validation
const jwt = require('jsonwebtoken');
const Users = require("../models/users"); 

//function
const auth = async(req, res, next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error('Login Please, token not found');
        }
        const {id} = jwt.verify(token, "YankoshTheBoss");

        const user = await Users.findById(id).select("-password");//Find user by ID, but exclude password from the result
        if(!user){
            throw new Error("User not found");
        }
        req.user = user; //to send it to "/profile" etc
        next();
    }catch(err){
        res.status(401).send(err.message);//send err like this
    };

};


module.exports = auth;