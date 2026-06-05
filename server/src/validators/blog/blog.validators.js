
import { body, param } from "express-validator"


const blogValidators = () =>
{
    return [
        body( 'title' )
            .trim()
            .notEmpty()
            .withMessage( 'Title is required' )
            .isLength( { min: 3 } )
            .withMessage( 'Title must be at least 3 characters long' ),
        body( 'description' )
            .trim()
            .notEmpty()
            .withMessage( 'Description is required' )
            .isLength( { min: 10 } )
            .withMessage( 'Description must be at least 10 characters long' ),
        body( 'thumbnailImage' )
            .trim()
            .notEmpty()
            .withMessage( 'Thumbnail image is required' ),
    ]
}

export { blogValidators }