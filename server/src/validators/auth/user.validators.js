
import { body, param } from 'express-validator'


const userRegisterValidators = () =>
{
    return [
        body( 'firstName' )
            .trim()
            .notEmpty()
            .withMessage( 'First name is required' )
            .isLength( { min: 3 } )
            .withMessage( 'First name must be at least 3 characters long' ),
        body( 'lastName' )
            .trim()
            .notEmpty()
            .withMessage( 'Last name is required' )
            .isLength( { min: 3 } )
            .withMessage( 'Last name must be at least 3 characters long' ),
        body( 'email' )
            .trim()
            .notEmpty()
            .withMessage( 'Email is required' )
            .isEmail()
            .withMessage( 'Email is invalid' ),
        body( 'password' )
            .trim()
            .notEmpty()
            .withMessage( 'Password is required' ),
    ]
}



const userLoginValidators = () =>
{
    return [
        body( 'email' )
            .trim()
            .notEmpty()
            .withMessage( 'Email is required' )
            .isEmail()
            .withMessage( 'Email is invalid' ),
        body( 'password' )
            .trim()
            .notEmpty()
            .withMessage( 'Password is required' ),
    ]
}


export { userRegisterValidators, userLoginValidators }