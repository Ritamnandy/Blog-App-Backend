
import mongoose from "mongoose";

import { dbName } from "../constant.js"


const connectDB = async () =>
{
    try
    {

        const connect = await mongoose.connect( `${ process.env.MONGODB_URL }/${ dbName }` )
        console.log( "Database connected || DB Host:- ", connect.connection.host );
    } catch ( error )
    {
        console.log( "MongoDB is not connect:-  ", error );

    }
}

export { connectDB }