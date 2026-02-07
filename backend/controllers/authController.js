const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');


function generateToken(id){
    const my_secret_key = process.env.MY_SECRET_KEY;
    
    return jwt.sign({id},my_secret_key,{expiresIn: '30d'})
}

const registerUser = async (req,res) => {
    try {
        const {name, email, password, collegeName, hostel, roomNumber} = req.body;

        // 1. Basic Validation (rooNumber is Optional)
        if(!name || !email || !password || !collegeName || !hostel) {
            return res.status(400).json({message : "Please Fill all mandatory fields"});
        }
        
        //1.1 Check email ends with .ac.in or .edu


        // 2. Check user is already exists or not  
        // ( 409 : Conflict with the current state of the resource )
        const userExists = await User.findOne({ email });
        if(userExists) {
            return res.status(409).json({message : "User already exists"})
        }

        // 3. Create the user and Generate OTP 

        const otp = Math.floor(100000 + Math.random()*900000).toString(); 

        // console.log(otp);

        const user = await User.create({
            name,
            email,
            password,
            collegeName,
            hostel,
            roomNumber,
            otp,
            otpExpires: Date.now() + 15*60*1000, // expires in 15 min
        });
        // console.log("2");
        await sendEmail({
            email: user.email,
            subject: 'Your College Rental Verification Code',
            message: `Your OTP is ${otp}. It expires in 15 minutes`,
        });
        
        // 4. Attach JWT token and return back;
        
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            collegeName: user.collegeName,
            token: generateToken(user._id),
        });

    } catch (error) {
        res.status(500).json({message: "Signup Failed", error: error.message })
    }
};

const resendOTP = async (req,res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});

        if(!user) {
            return res.status(404).json({message: "User not Found"});
        }

        if(user.isVerified){
            return res.status(400).json({message: "This Account is already verified.Please Login"});
        }

        const newOTP = Math.floor(100000 + Math.random() * 90000).toString();

        const updatedUser = await User.findOneAndUpdate({email},{
            otp: newOTP,
            otpExpires: Date.now() + 15*60*1000
        },{new: true});
        // user.otp = newOTP;
        // user.otpExpires = Date.now() + 15*60*1000;
        // console.log("1")
        // await user.save();
        
        await sendEmail({
            email: user.email,
            subject: 'Your College Rental Verification Code',
            message: `Your OTP is ${newOTP}. It expires in 15 minutes`,
        })

        return res.status(200).json({message: "OTP resent successfully!"});

    } catch (error) {
        res.status(500).json({message: "Failed to resend OTP",error: error.message});
    }
}

const verifyOTP = async (req,res) => {
    try {
        const {email, otp} = req.body;
        const user = await User.findOne({email});

        // 1. Find user by email
        if(!user) {
            return res.status(404).json({message: 'User Not Found'});
        }
        if(user.isVerified){
            return res.status(400).json({message: "This Account is already verified.Please Login"});
        }
        // 2. Check if OTP matches and hasn't expired
        if(user.otp != otp || user.otpExpires < Date.now()){
            return res.status(400).json({message: "Invalid or expired OTP"});
        }

        // 3. Update user status and clear OTP fields
        const updatedUser = await User.findOneAndUpdate({email},{
            isVerified: true,
            otp: "",
            otpExpires: "",
        },{new: true});
        
        res.status(200).json({
            message: "Email verified successfully! You can now use the platform.",
            isVerified: user.isVerified
        });

    } catch (error) {
        res.status(500).json({message: "Verification Failed", error: error.message});
    }
}



const loginUser = async (req,res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user) {
            return res.status(404).json({message: "User Not Found"});
        }
        
        // Password Match
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: "Invalid Credentials"});
        }

        // Check if verified
        if(!user.isVerified){
            return res.status(400).json({message: "Email not verified. Please verify your email before logging in."});
        }

        // Attach JWT token and return back;
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            collegeName: user.collegeName,
            token: generateToken(user._id)
        })

    } catch (error) {
        res.status(500).json({message: "Login Failed", error: error.message});
    }
}




module.exports = {
    registerUser,
    verifyOTP,
    resendOTP,
    loginUser,
}