const User = require('../models/User');
const Email = require('../models/Email');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');


function generateToken(id){
    const my_secret_key = process.env.MY_SECRET_KEY;
    
    return jwt.sign({id},my_secret_key,{expiresIn: '30d'})
}

const registerUser = async (req,res) => {
    try {
        const {name, email, password, collegeName, hostel, roomNumber, otp} = req.body;
        // console.log(name, email, password, collegeName, hostel, roomNumber, otp);

        // 1. Basic Validation (rooNumber is Optional)
        if(!name || !email || !password || !collegeName || !hostel || !otp || !roomNumber) {
            return res.status(400).json({message : "Please Fill all mandatory fields"});
        }
        
        //1.1 Check email ends with .ac.in or .edu

        // 1.2 Check email otp is correct or not;
        const emailRecord = await Email.findOne({email});
        // console.log(emailRecord);
        if(!emailRecord || emailRecord.otp !== otp || emailRecord.otpExpires < Date.now()) {
            return res.status(400).json({message: "Invalid or expired OTP"});
        }
        await Email.findOneAndDelete({email});

        // console.log("Successfully OTP Verified");
        // 2. Check user is already exists or not  
        // ( 409 : Conflict with the current state of the resource )
        const userExists = await User.findOne({ email });
        if(userExists) {
            return res.status(409).json({message : "User already exists"})
        }

        // // 3. Create the user and Generate OTP 
        
        // const otp = Math.floor(100000 + Math.random()*900000).toString();
        
        // console.log(otp);
        
        const user = await User.create({
            name,
            email,
            password,
            collegeName,
            hostel,
            roomNumber,
            isVerified: true,
            otp:"",
            otpExpires: null, // expires in 15 min
        });

        // console.log("Successfully User Created");
        // console.log("2");
        
        // 4. Attach JWT token and return back;
        // console.log("HII");
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
        // console.log("Resend OTP Called");
        const {email} = req.body;
        console.log("Resend OTP Called for email:", email);
        const user = await Email.findOne({email});

        // if(!user) {
        //     return res.status(404).json({message: "User not Found"});
        // }

        const newOTP = Math.floor(100000 + Math.random() * 900000).toString();

        // 🎨 THE PROFESSIONAL HTML TEMPLATE
        const htmlTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #eeeeee;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #F2B82E;">
                    <h2 style="color: #333333; margin: 0;">CampusLink</h2>
                </div>
                
                <div style="padding: 30px 20px; text-align: center; background-color: #ffffff; border-radius: 8px; margin-top: 20px;">
                    <p style="color: #666666; font-size: 16px; margin-bottom: 10px;">Hello,</p>
                    <p style="color: #333333; font-size: 18px; font-weight: bold; margin-bottom: 20px;">Your verification code is:</p>
                    
                    <div style="background-color: #F8F9FA; border: 2px dashed #F2B82E; padding: 15px 30px; display: inline-block; border-radius: 6px; letter-spacing: 5px;">
                        <h1 style="color: #050505; font-size: 36px; margin: 0;">${newOTP}</h1>
                    </div>
                    
                    <p style="color: #999999; font-size: 14px; margin-top: 30px;">This code will expire in <strong>15 minutes</strong>.</p>
                    <p style="color: #999999; font-size: 14px;">If you did not request this code, please ignore this email.</p>
                </div>
                
                <div style="text-align: center; padding-top: 20px; color: #aaaaaa; font-size: 12px;">
                    <p>&copy; ${new Date().getFullYear()} CampusLink Team. All rights reserved.</p>
                </div>
            </div>
        `;

        // OTP SEND TO EMAIL
        await sendEmail({
            email: email,
            subject: 'Your College Rental Verification Code',
            message: `Your OTP is ${newOTP}. It expires in 15 minutes`,
            html: htmlTemplate
        });

        const updatedUser = await Email.findOneAndUpdate({email},{
            otp: newOTP,
            otpExpires: Date.now() + 15*60*1000
        },{new: true, upsert: true});
        // user.otp = newOTP;
        // user.otpExpires = Date.now() + 15*60*1000;
        // console.log("1")
        // await user.save();
        
        return res.status(200).json({message: "OTP  sent successfully!"});

    } catch (error) {
        res.status(500).json({message: "Failed to  send OTP",error: error.message});
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