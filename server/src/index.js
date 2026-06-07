

import './config/env.config.js'
import { app } from "./app.js"
import { connectDB } from './db/connect.db.js'

const port = process.env.PORT||3001

connectDB().then( () =>
{
    app.listen( port, () =>
    {
        console.log( `Server is running on ${ port }` );
    } )
} ).catch( ( err ) =>
{
    console.log( "Server is not running:- ", err );
} )
