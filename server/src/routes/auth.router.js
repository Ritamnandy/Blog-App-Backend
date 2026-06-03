

import express from 'express'
import { upload } from '../middlewares/multer.middlewares.js'
import { verifyJWT } from '../middlewares/auth.middlewares.js'
import
{
    registerUser, loginUser,
    logoutUser,
    refreshAccessToken, setAvatar
} from '../controllers/user.controllers.js'

const route = express.Router()

/// post routes ++++++++

route.route( '/register' ).post( registerUser )
route.route( '/login' ).post( loginUser )
route.route( '/refresh' ).post( refreshAccessToken )
route.route( '/logout' ).post( verifyJWT, logoutUser )
route.route( '/avatar' ).post( verifyJWT, upload.single( 'avatar' ), setAvatar )


export default userRouter