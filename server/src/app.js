
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import requestIp from 'request-ip'
import { rateLimit } from 'express-rate-limit'
import { ApiError } from './utils/apierror.js'

const app = express()

app.use( cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
) )
app.use( express.json( { limit: "20kb" } ) )
app.use( express.urlencoded( { extended: true, limit: "20kb" } ) )
app.use( express.static( 'public' ) )
app.use( cookieParser() )
app.use( compression() )
app.use( requestIp.mw() )
const limiter = rateLimit(
    {
        windowMs: 15 * 60 * 1000,
        max: 1000,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: ( req, res ) =>
        {
            return req.clientIp
        },
        handler: ( req, res, next, options ) =>
        {
            return res.status( options.statusCode ).json( new ApiError( 429, options.message, [ "Too many requests, Please try again later" ] ) )
        }
    }
)
app.use( limiter )




/// import router 

import userRouter from './routes/auth.router.js'


app.use( '/api/v1/auth', userRouter )



export { app }