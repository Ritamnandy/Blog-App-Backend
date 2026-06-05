
import { v2 as cloudinary } from "cloudinary";
import fs from "fs"



cloudinary.config( {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
} )

const uploadCloudinary = async ( filePath ) =>
{

    try
    {
        console.log( "filepath:- ", filePath );

        if ( !filePath )
        {
            console.log( "file not provide" );
            return null

        };
        const result = await cloudinary.uploader.upload( filePath, {
            resource_type: "auto"
        } )
        fs.unlinkSync( filePath )
        return result;
    } catch ( error )
    {
        fs.unlinkSync( filePath )
        console.log( "cloudinary upload error:- ", error );
        return null;
    }
}

export { uploadCloudinary }