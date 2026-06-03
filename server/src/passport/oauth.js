
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '../models/user.models.js'
import { ApiError } from '../utils/apierror.js'
import { userLoginType } from '../constant.js'


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async function ( accessToken, refreshToken, profile, done )
        {
            try
            {
                return done( null, profile )
            } catch ( error )
            {
                console.log( "Google auth error:- ", error );

            }
        }
    )
)

passport.serializeUser( function ( user, done )
{
    done( null, user )
} )

passport.deserializeUser( function ( user, done )
{
    done( null, user )
} )