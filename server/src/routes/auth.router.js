

import express from 'express'
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

/// Unsecured routes

route.route( '/register' ).post( userRegisterValidators(), validate, registerUser )
route.route( '/login' ).post( userLoginValidators(), validate, loginUser )
route.route( '/refresh' ).post( refreshAccessToken )


/// Secured routes

route.route( '/logout' ).post( verifyJWT, logoutUser )
route.route( '/avatar' ).post( verifyJWT, upload.single( 'avatar' ), setAvatar )


export default userRouter