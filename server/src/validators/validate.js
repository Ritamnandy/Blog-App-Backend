
import { validationResult } from "express-validator"
import { ApiError } from "../utils/apierror.js"

export const validate = ( req, res, next ) =>
{
    const errors = validationResult( req )
    if ( errors.isEmpty() )
    {
        return next()
    }
    const extractErrors = []
    errors.array().map( ( err ) => extractErrors.push( { [ err.path ]: err.msg } ) )
    if ( !errors.isEmpty() )
    {
        return res.status( 422 ).json( new ApiError( 422, "Recived data is not valid", extractErrors ) )
    }
    next()
}