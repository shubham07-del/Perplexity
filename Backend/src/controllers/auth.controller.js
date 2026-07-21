import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { sendEmail } from "../services/mail.service.js"
import bcrypt from "bcryptjs"
import redis from "../config/cache.js"


export async function register(req,res){
    const {username, email, password} = req.body
    
    let isUserExist = await userModel.findOne({email})
    if(isUserExist){
        return res.status(400).json({
            message:"User already exist with this email address.",
            success:false,
            err:"user already exist."
        })
    }

   const user = await userModel.create({
        username,
        email,
        password
    })

    const emailVerificationToken = jwt.sign(
        {email:user.email},
        process.env.JWT_SECRET
    )

    await sendEmail({
        to:email,
        subject:"Welcome to Perplexity.",
        html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
        `

    })
    

    res.status(201).json({
        message:"User registered successfully.",
        success:true,
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        },
    })

}

export async function verifyEmail(req,res){
    const {token} = req.query

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findOne({email:decoded.email})
        if(!user){
            return res.redirect(`http://localhost:5173/verify-email?status=error&message=User+not+found`)
        }

        if(user.verified){
            return res.redirect(`http://localhost:5173/verify-email?status=already-verified&message=Email+already+verified`)
        }

        user.verified = true
        await user.save()

        return res.redirect(`http://localhost:5173/verify-email?status=success&message=Email+verified+successfully`)
    } catch (err) {
        return res.redirect(`http://localhost:5173/verify-email?status=error&message=Invalid+or+expired+token`)
    }
}

export async function login(req,res){
    const {email, password} = req.body
    const user = await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(401).json({
            message:"Invalid credentials",
            success:false,
            err:"user not found."
        })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if(!isValidPassword){
        return res.status(401).json({
            message:"Invalid credentials",
            success:false,
            err:"user not found."
        })
    }

    if(!user.verified){
        return res.status(400).json({
            message:"Please verify your email first.",
            success:false,
            err:"Email not verified."
        })
    }
    const token = jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"3d"}
    )

    res.cookie("token", token)
    res.status(200).json({
        message:"user logged in successfully.",
        success:true,
        user:{
            username:user.username,
            email:user.email
        }
    })

}


export async function getMe(req,res){
    const id = req.user.id
    const user = await userModel.findById(id).select("-password")
    if(!user){
        return res.status(401).json({
            message:"Invalid credentials",
            success:false,
            err:"user not found."
        })
    }

    res.status(200).json({
        message:"User fetched successfully.",
        success:true,
        user
    })
}


export async function logout(req,res) {
      const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  res.clearCookie("token");

  if (token) {
    await redis.set(token, Date.now().toString(), "EX", 60 * 60);
  }

  res.status(201).json({
    message: "User logout successfully."
  });
}