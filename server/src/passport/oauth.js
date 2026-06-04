
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
        async function ( _, _, profile, done )
        {
            try
            {
                const user = await User.findOne( { email: profile?.email } )
                if ( user )
                {
                    return done( null, user )
                }
                if ( !profile )
                {
                    throw new ApiError( "Google auth error", 400 )
                }
                const avatarUrl = await uploadCloudinary( profile?.photos[ 0 ].value )
                const newUser = await User.create(
                    {
                        firstName: profile?.name?.givenName,
                        lastName: profile?.name?.familyName,
                        email: profile?.email,
                        avatar: avatarUrl.url,
                        loginType: userLoginType.GOOGLE,
                        googleId: profile?.id
                    }
                )
                return done( null, newUser )
            } catch ( error )
            {
                console.log( "Google auth error:- ", error );

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
        const user = await User.findById( id ).select( "-password -refreshToken" )
        done( null, user )
    } catch ( error )
    {
        done( error, null )
    }
} )