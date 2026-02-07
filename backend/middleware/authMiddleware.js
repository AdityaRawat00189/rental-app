const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req,res, next) => {
    let token ;
    // console.log(req);
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            
            token = req.headers['authorization'].split(' ')[1];

            // 2. verify token
            const decoded = jwt.verify(token,process.env.MY_SECRET_KEY);

            // 3. Get user from token except password and attach it
            req.user = await User.findById(decoded.id).select('-password');

            // 4. Verification Check: Only verified users can list items
            if (!req.user) {
                return res.status(401).json({ message: "User no longer exists" });
            }
            if (req.user && !req.user.isVerified) {
                return res.status(403).json({ message: "Please verify your email to access this feature." });
            }

            console.log(`Authenticated: ${req.user.name} from ${req.user.collegeName}`);

            next();

        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if(!token){
        return res.status(401).json({message: "Not authorized, no token"});
    }
};

module.exports = { protect };