
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apierror.js"
import { asyncHandler } from "../utils/asynchandler.js"
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler( async ( req, res, next ) =>
{
    try
    {
        const token = req.cookies?.accessToken || req.header( "Authorization" )?.replace( "Bearer ", "" )
        if ( !token )
        {
            return res.status( 401 ).json( new ApiError( 401, "Unauthorized request", [ "access token not found" ] ) )
        }
        const decoded = jwt.verify( token, process.env.JWT_TOKEN_SECRET )
        const user = await User.findById( decoded?._id ).select( "-password -refreshToken" )
        if ( !user )
        {
            return res.status( 401 ).json( new ApiError( 401, "Unauthorized request", [ "user not found", "Invalid access token" ] ) )
        }
        req.user = user
        next()
    } catch ( error )
    {
        console.log( "verify jwt error", error.message );
        return res.status( 401 ).json( new ApiError( 401, "Unauthorized request", [ "Invalid access token" ] ) )
    }
} )


export { verifyJWT }