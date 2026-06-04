

import './config/env.config.js'
import { app } from "./app.js"
import { connectDB } from './db/connect.db.js'



connectDB().then( () =>
{
    app.listen( process.env.PORT, () =>
    {
        console.log( `Server is running on http://localhost:${ process.env.PORT }` );
    } )
} ).catch( ( err ) =>
{
    console.log( "Server is not running:- ", err );
} )
