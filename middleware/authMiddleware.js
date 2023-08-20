const jwt = require('jsonwebtoken');
const User = require("../Models/userModel")
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req,res,next)=>{
    let token;

    if(
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ){
        try {
            token = req.headers.authorization.split(" ")[1];
            //the token will look like this-   Bearer zxfiekjfxf    so we are going to remove Bearer and take the token

            //decodes token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);  //khas baat ye hai ki maine token ko database me store hi nahi kiya phir bhi yaha ye easily verify ho jaa raha
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }
})

module.exports = {protect};