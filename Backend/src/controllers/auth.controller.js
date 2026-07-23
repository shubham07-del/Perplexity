import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";
import redis from "../config/cache.js";

export async function register(req, res) {
  const { username, email, password } = req.body;

  let isUserExist = await userModel.findOne({ email });
  if (isUserExist) {
    return res.status(400).json({
      message: "User already exist with this email address.",
      success: false,
      err: "user already exist.",
    });
  }

  const user = await userModel.create({
    username,
    email,
    password,
    provider: "local",
  });

  const emailVerificationToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
  );

  try {
    await sendEmail({
      to: email,
      subject: "Welcome to Signature.",
      text: `Hi ${username},\n\nThank you for registering at Signature. Please verify your email address by clicking the link below:\n\nhttps://perplexity-s7gf.onrender.com/api/auth/verify-email?token=${emailVerificationToken}\n\nIf you did not create an account, please ignore this email.`,
      html: `
                    <p>Hi ${username},</p>
                    <p>Thank you for registering at <strong>Signature</strong>. We're excited to have you on board!</p>
                    <p>Please verify your email address by clicking the link below:</p>
                    <a href="https://perplexity-s7gf.onrender.com/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                    <p>If you did not create an account, please ignore this email.</p>
                    <p>Best regards,<br>The Signature Team</p>
            `,
    });
  } catch (emailError) {
    return res.status(500).json({
      message: "User registered, but failed to send verification email.",
      success: false,
      err: emailError.message,
    });
  }

  res.status(201).json({
    message: "User registered successfully. Please check your email to verify.",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  if (user.provider === "google") {
    return res.status(400).json({
      success: false,
      message:
        "This account was created using Google. Please continue with Google.",
    });
  }
  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    return res.status(401).json({
      message: "Invalid credentials",
      success: false,
      err: "user not found.",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify your email first.",
      success: false,
      err: "Email not verified.",
    });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    message: "user logged in successfully.",
    success: true,
    token, // Send token in response payload
    user: {
      username: user.username,
      email: user.email,
    },
  });
}

export async function googleLogin(req, res) {
   try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required.",
      });
    }

    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload.email_verified) {
      return res.status(400).json({
        success: false,
        message: "Google email is not verified.",
      });
    }

    // Find user by email
    let user = await userModel.findOne({ email: payload.email });

    // Create user if not exists
    if (!user) {
      user = await userModel.create({
        username: payload.name,
        email: payload.email,
        provider: "google",
        verified: true,
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Google login successful.",
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Google authentication failed.",
      error: error.message,
    });
  }
}

export async function verifyEmail(req, res) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return res.redirect(
        `https://perplexity-liard.vercel.app/verify-email?status=error&message=User+not+found`,
      );
    }

    if (user.verified) {
      return res.redirect(
        `https://perplexity-liard.vercel.app/verify-email?status=already-verified&message=Email+already+verified`,
      );
    }

    user.verified = true;
    await user.save();

    return res.redirect(
      `https://perplexity-liard.vercel.app/verify-email?status=success&message=Email+verified+successfully`,
    );
  } catch (err) {
    return res.redirect(
      `https://perplexity-liard.vercel.app/verify-email?status=error&message=Invalid+or+expired+token`,
    );
  }
}

export async function getMe(req, res) {
  const id = req.user.id;
  const user = await userModel.findById(id).select("-password");
  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
      success: false,
      err: "user not found.",
    });
  }

  res.status(200).json({
    message: "User fetched successfully.",
    success: true,
    user,
  });
}

export async function logout(req, res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  if (token) {
    await redis.set(token, Date.now().toString(), "EX", 60 * 60);
  }

  res.status(201).json({
    message: "User logout successfully.",
  });
}
