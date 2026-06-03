

import express from 'express'
import { ApiResponse } from '../utils/apiresponse.js'
import passport from 'passport'
import { upload } from '../middlewares/multer.middlewares.js'
import { verifyJWT } from '../middlewares/auth.middlewares.js'
import
{
    registerUser, loginUser,
    logoutUser,
    refreshAccessToken, setAvatar
} from '../controllers/user.controllers.js'
import { userRegisterValidators, userLoginValidators } from '../validators/auth/user.validators.js'
import { validate } from '../validators/validate.js'

const route = express.Router()

/// oauth using google


route.route( '/google' ).get(
    passport.authenticate( 'google',
        {
            scope: [ 'email', 'profile' ]
        }
    )
)



route.route( '/google/callback' ).get(
    passport.authenticate( 'google',
        {
            failureRedirect: '/login'
        }
    ), ( req, res ) =>
{
    res.status( 200 ).json( new ApiResponse( 200, "User logged in successfully", req.user ) )
} )







/// Unsecured routes

route.route( '/register' ).post( userRegisterValidators(), validate, registerUser )
route.route( '/login' ).post( userLoginValidators(), validate, loginUser )
route.route( '/refresh' ).post( refreshAccessToken )


/// Secured routes

route.route( '/logout' ).post( verifyJWT, logoutUser )
route.route( '/avatar' ).post( verifyJWT, upload.single( 'avatar' ), setAvatar )


export default userRouter