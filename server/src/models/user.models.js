
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { userLoginType } from "../constant.js"
import { use } from "react";

const userSchema = new mongoose.Schema( {
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowerCase: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        lowerCase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowerCase: true
    },
    password: {
        type: String,
        trim: true
    },
    googleId: {
        type: String,
        trim: true,
        default: "",
    },
    loginType: {
        type: String,
        enum: userLoginType,
        default: userLoginType.EMAIL_PASSWORD
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        trim: true,
        default: ""
    },
    verificationCodeExpiresAt: {
        type: Date,
        trim: true,
        
    },
    avatar: {
        type: String,
        default: ""
    },
    refreshToken: {
        type: String,
        trim: true
    }
}, { timestamps: true } )

userSchema.pre( "save", async function ()
{
    if ( !this.isModified( "password" ) ) return;
    this.password = await bcrypt.hash( this.password, 10 )
} )

userSchema.methods.comparePassword = async function ( password )
{
    return await bcrypt.compare( password, this.password )
}

userSchema.methods.generateAccessToken = function ()
{
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
        },
        process.env.JWT_TOKEN_SECRET,
        {
            expiresIn: process.env.JWT_TOKEN_EXPIRES_IN
        }
    )
}




userSchema.methods.generateRefreshToken = function ()
{
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
        }
    )
}

const User = mongoose.model( "User", userSchema )



export { User }