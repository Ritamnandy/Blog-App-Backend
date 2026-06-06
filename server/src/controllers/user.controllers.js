
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/apierror.js"
import { ApiResponse } from "../utils/apiresponse.js"
import { asyncHandler } from "../utils/asynchandler.js"
import { uploadCloudinary } from "../utils/cloudinary.upload.js"
import { sendVerificationEmail } from "../utils/mail.js"
import jwt from "jsonwebtoken"

const options = {
    httpOnly: true,
    secure: true,

}

const getVerificationCode = () =>
{
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString()
}
const getExpiryTime = () =>
{
    return new Date( Date.now() + 5 * 60 * 1000 )
}
const generateTokenPair = async ( userId ) =>
{
    try
    {
        const user = await User.findById( userId )
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save( { validateBeforeSave: false } );
        return { accessToken, refreshToken }
    } catch ( error )
    {
        console.log( "token generate time error:- ", error );

    }
}



//  ++++++ register user ++++++

const registerUser = asyncHandler( async ( req, res ) =>
{
    const { firstName, lastName, email, password } = req.body

    if ( !firstName && !lastName && !email && !password )
    {
        return res.status( 400 ).json( new ApiError( 400, "Missing required fields", [ "firstName", "lastName", "email", "password" ] ) )
    }
    if ( firstName === "" && lastName === "" && email === "" && password === "" )
    {
        return res.status( 400 ).json( new ApiError( 400, "Missing required fields", [ "firstName", "lastName", "email", "password" ] ) )
    }
    const user = await User.findOne( { email } )
    if ( user )
    {
        return res.status( 400 ).json( new ApiError( 400, "User already exists", [ "User with this email already exists" ] ) )
    }
    const verificationCode = getVerificationCode()
    const verificationCodeExpiresAt = getExpiryTime()
    const createdUser = await User.create( {
        firstName, lastName,
        email, password,
        verificationCode,
        verificationCodeExpiresAt
    } )
    if ( !createdUser )
    {
        return res.status( 500 ).json( new ApiError( 500, "Server error", [ "Failed to create user" ] ) )
    }
    const userName = createdUser.firstName + " " + createdUser.lastName
    await sendVerificationEmail( email, userName, verificationCode )
    return res.status( 201 )
        .json( new ApiResponse( 201, "User created successfully,Check your email for verification", [ "Check your email for verification" ] ) )
} )


///++++++ verify email+++++++

const verifyEmail = asyncHandler( async ( req, res ) =>
{
    const { email, code } = req.body
    if ( !email && !code )
    {
        return res.status( 400 ).json( new ApiError( 400, "Missing required fields", [ "Missing required fields" ] ) )
    }
    if ( email === "" && code === "" )
    {
        return res.status( 400 ).json( new ApiError( 400, "Missing required fields", [ "Missing required fields" ] ) )
    }
    const user = await User.findOne( { email } )
    if ( !user )
    {
        return res.status( 404 ).json( new ApiError( 404, "User not found", [ "User not found" ] ) )
    }
    if ( user.isVerified )
    {
        return res.status( 400 ).json( new ApiError( 400, "Email is already verified", [ "Email is already verified" ] ) )
    }
    if ( user.verificationCode !== code )
    {
        return res.status( 400 ).json( new ApiError( 400, "Invalid verification code", [ "Invalid verification code" ] ) )
    }
    if ( user.verificationCodeExpiresAt < Date.now() )
    {
        return res.status( 400 ).json( new ApiError( 400, "Verification code has expired", [ "Verification code has expired" ] ) )
    }
    user.isVerified = true
    user.verificationCode = null
    user.verificationCodeExpiresAt = null
    await user.save( { validateBeforeSave: false } )
    const { accessToken, refreshToken } = await generateTokenPair( user._id )
    if ( !accessToken || !refreshToken )
    {
        return res.status( 500 ).json( new ApiError( 500, "Server error", [ "Failed to generate token pair" ] ) )
    }
    const createdUser = await User.findById( user._id )
        .select( "-password -refreshToken -verificationCode -verificationCodeExpiresAt -isVerified -googleId" )
    return res.status( 200 )
        .cookie( "accessToken", accessToken, options )
        .cookie( "refreshToken", refreshToken, options )
        .json( new ApiResponse( 200, "Email verified successfully", [ "Email verified successfully", createdUser ] ) )


} )

/// ++++++ resend verification code +++++++

const resendVerificationCode = asyncHandler( async ( req, res ) =>
{
    const { email } = req.body
    if ( !email )
    {
        return res.status( 400 ).json( new ApiError( 400, "Missing required fields", [ "Missing required fields" ] ) )
    }
    if ( email === "" )
    {
        return res.status( 400 ).json( new ApiError( 400, "Missing required fields", [ "Missing required fields" ] ) )
    }
    const user = await User.findOne( { email } )
    if ( !user )
    {
        return res.status( 404 ).json( new ApiError( 404, "User not found", [ "User not found" ] ) )
    }
    if ( user.isVerified )
    {
        return res.status( 400 ).json( new ApiError( 400, "Email is already verified", [ "Email is already verified" ] ) )
    }
    const verificationCode = getVerificationCode()
    const verificationCodeExpiresAt = getExpiryTime()
    user.verificationCode = verificationCode
    user.verificationCodeExpiresAt = verificationCodeExpiresAt
    await user.save( { validateBeforeSave: false } )
    const userName = user.firstName + " " + user.lastName
    await sendVerificationEmail( email, userName, verificationCode )
    return res.status( 200 )
        .json( new ApiResponse( 200, "Verification code sent successfully", [ "Verification code sent successfully" ] ) )
} )



//++++++ login user  +++++++

const loginUser = asyncHandler( async ( req, res ) =>
{
    const { email, password } = req.body
    if ( !email && !password )
    {
        return res.status( 400 ).json( new ApiError( 400, "Missing required fields", [ "email", "password" ] ) )
    }
    if ( email === "" && password === "" )
    {
        return res.status( 400 ).json( new ApiError( 400, "Missing required fields", [ "email", "password" ] ) )
    }
    const user = await User.findOne( { email } )
    if ( !user )
    {
        return res.status( 401 ).json( new ApiError( 401, "Unauthorized request", [ "Invalid email or password" ] ) )
    }
    if ( !user.isVerified )
    {
        return res.status( 400 ).json( new ApiError( 400, "Email is not verified", [ "Email is not verified" ] ) )
    }
    const isMatch = await user.comparePassword( password )
    if ( !isMatch )
    {
        // throw new ApiError( 401, "Unauthorized request", [ "Invalid email or password" ] )
        return res.status( 401 ).json( new ApiError( 401, "Unauthorized request", [ "Invalid email or password" ] ) )
    }
    const { accessToken, refreshToken } = await generateTokenPair( user._id )
    const loginedInUser = await User.findById( user._id ).select( "-password -refreshToken" )
    return res.status( 200 )
        .cookie( "accessToken", accessToken, options )
        .cookie( "refreshToken", refreshToken, options )
        .json( new ApiResponse( 200, "User logged in successfully", [ { accessToken: accessToken }, { refreshToken: refreshToken }, loginedInUser ] ) )
} )


/// +++++ logout user +++++++

const logoutUser = asyncHandler( async ( req, res ) =>
{
    const { _id: userId } = req.user
    if ( !userId )
    {
        return res.status( 401 ).json( new ApiError( 401, "Unauthorized request", [ "User not found" ] ) )
    }
    const user = await User.findByIdAndUpdate( userId,
        {
            $set: {
                refreshToken: " "
            }
        },
        { new: true }
    )
    return res.status( 200 )
        .clearCookie( "accessToken" )
        .clearCookie( "refreshToken" )
        .json( new ApiResponse( 200, "User logged out successfully" ) )
} )


/// ++++++ refresh accessToken token +++++++

const refreshAccessToken = asyncHandler( async ( req, res ) =>
{
    const { refreshToken: Token } = req.cookies || req.headers || req.body
    if ( !Token )
    {
        return res.status( 401 ).json( new ApiError( 401, "Unauthorized request", [ "Refresh token not found" ] ) )
    }
    const decoded = jwt.verify( Token, process.env.REFRESH_TOKEN_SECRET )
    const user = await User.findById( decoded._id )
    if ( !user )
    {
        return res.status( 401 ).json( new ApiError( 401, "Unauthorized request", [ "user not found", "Invalid refresh token" ] ) )
    }
    const { accessToken, refreshToken } = await generateTokenPair( decoded._id )
    return res.status( 200 )
        .cookie( "accessToken", accessToken, options )
        .cookie( "refreshToken", refreshToken, options )
        .json( new ApiResponse( 200, "Access token refreshed successfully", [ { accessToken: accessToken }, { refreshToken: refreshToken } ] ) )
} )
//+++++ upload avatar on server and cloudinary +++++

const setAvatar = asyncHandler( async ( req, res ) =>
{
    const { _id: userId } = req.user
    const { avatar: avatarPath } = req.file?.path
    if ( !userId )
    {
        return res.status( 401 ).json( new ApiError( 401, "Unauthorized request", [ "User not found" ] ) )
    }
    if ( !avatarPath )
    {
        return res.status( 400 ).json( new ApiError( 400, "Missing required fields", [ "avatar" ] ) )
    }
    const cloudinaryAvatar = await uploadCloudinary( avatarPath )
    if ( !cloudinaryAvatar )
    {
        return res.status( 500 ).json( new ApiError( 500, "Server error", [ "Cloudinary upload error" ] ) )
    }

    const user = await User.findByIdAndUpdate( userId,
        {
            $set: {
                avatar: cloudinaryAvatar.url
            }
        },
        { new: true }
    )
    return res.status( 200 ).json( new ApiResponse( 200, "Avatar uploaded successfully", { avatar: cloudinaryAvatar.url } ) )
} )


const socialLogin = asyncHandler( async ( req, res ) =>
{
    const user = req.user
    if ( !user )
    {
        return res.status( 401 ).json( new ApiError( 401, "Unauthorized request", [ "User not found" ] ) )
    }
    const { accessToken, refreshToken } = await generateTokenPair( user._id )
    return res.status( 200 )
        .cookie( "accessToken", accessToken, options )
        .cookie( "refreshToken", refreshToken, options )
        .json( new ApiResponse( 200, "Google logged in successfully", [ { accessToken: accessToken }, { refreshToken: refreshToken }, { user: user } ] ) )
} )






export { registerUser, loginUser, logoutUser, refreshAccessToken, setAvatar, socialLogin }


