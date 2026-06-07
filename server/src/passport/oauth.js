import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '../models/user.models.js'
import { ApiError } from '../utils/apierror.js'
import { uploadCloudinary } from '../utils/cloudinary.upload.js'
import { userLoginType } from '../constant.js'

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async function ( _, __, profile, done )
        {
            try
            {
                if ( !profile )
                {
                    throw new ApiError( "Google auth error", 400 )
                }
                const email = profile?._json?.email;
                const firstName = profile?._json?.given_name;
                const lastName = profile?._json?.family_name;

                const user = await User.findOne( { email } )
                if ( user )
                {
                    return done( null, user )
                }

                const newUser = await User.create(
                    {
                        firstName,
                        lastName,
                        email,
                        loginType: userLoginType.GOOGLE,
                        googleId: profile?.id
                    }
                )
                return done( null, newUser )
            } catch ( error )
            {
                console.log( "Google auth error:- ", error.message );

            }
        }
    )
)

passport.serializeUser( function ( user, done )
{
    done( null, user._id )
} )

passport.deserializeUser( async function ( id, done )
{
    try
    {
        const user = await User.findById( id ).select( "-password -refreshToken -googleId -loginType -isVerified -verificationCode -verificationCodeExpiresAt" )
        if ( !user )
        {
            return done( "User not found", null )
        } else
        {
            return done( null, user )
        }
    } catch ( error )
    {
        done( error.message, null )
    }
} )
