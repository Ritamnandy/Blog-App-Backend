

import express from 'express'
import passport from 'passport'
import { upload } from '../middlewares/multer.middlewares.js'
import { verifyJWT } from '../middlewares/auth.middlewares.js'
import
{
    registerUser, loginUser,
    logoutUser, socialLogin,
    refreshAccessToken, setAvatar,
    verifyEmail, resendVerificationCode,
    forgetPassword, sendresetPasswordMail
} from '../controllers/user.controllers.js'
import { userRegisterValidators, userLoginValidators } from '../validators/auth/user.validators.js'
import { validate } from '../validators/validate.js'

const Router = express.Router()

/// oauth using google


Router.route( '/google' ).get(
    passport.authenticate( 'google',
        {
            scope: [ 'email', 'profile' ]
        }
    )
)



Router.route( '/google/callback' ).get(
    passport.authenticate( 'google',
        {
            failureRedirect: '/login'
        }
    ), socialLogin
)







/// Unsecured routes

Router.route( '/register' ).post( userRegisterValidators(), validate, registerUser )
Router.route( '/verify-email' ).post( verifyEmail )
Router.route( '/resend-code' ).post( resendVerificationCode )
Router.route( '/send-reset-password-mail' ).post( sendresetPasswordMail )
Router.route( '/forget-password' ).post( forgetPassword )
Router.route( '/login' ).post( userLoginValidators(), validate, loginUser )
Router.route( '/refresh' ).post( refreshAccessToken )


/// Secured routes

Router.route( '/logout' ).post( verifyJWT, logoutUser )
Router.route( '/avatar' ).post( verifyJWT, upload.single( 'avatar' ), setAvatar )


export default Router