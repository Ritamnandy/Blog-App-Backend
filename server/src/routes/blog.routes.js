

import
{
    addBlog, deleteBlog,
    getAllBlogs,
    updateBlog, addComment,
    updateComment, deleteComment,
    addLike, removeLike
} from "../controllers/blog.controllers.js"

import express from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middlewares.js"

const Router = express.Router()

//blog routes

Router.route( '/addblog' ).post( verifyJWT, upload.single( "image" ), addBlog )  //add  new blog
Router.route( '/deleteblog/:id' ).delete( verifyJWT, deleteBlog ) //blog id
Router.route( '/updateblog/:id' ).patch( verifyJWT, updateBlog )  //blog id
Router.route( '/getallblogs' ).get( verifyJWT, getAllBlogs )   //get all blogs

//comments routes

Router.route( '/addcomment/:id' ).post( verifyJWT, addComment )  //blog id
Router.route( '/updatecomment/:id' ).patch( verifyJWT, updateComment )  //comment id
Router.route( '/deletecomment/:id' ).delete( verifyJWT, deleteComment ) //comment id

//likes routes  

Router.route( '/addlike/:id' ).post( verifyJWT, addLike ) //blog id
Router.route( '/removelike/:id' ).delete( verifyJWT, removeLike )  //blog id


export default Router