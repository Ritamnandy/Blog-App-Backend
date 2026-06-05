
import { Blog } from "../models/blog.models.js"
import { Comment } from "../models/comments.models.js"
import { ApiError } from "../utils/apierror.js"
import { ApiResponse } from "../utils/apiresponse.js"
import { asyncHandler } from "../utils/asynchandler.js"
import { uploadCloudinary } from "../utils/cloudinary.upload.js"
import mongoose from "mongoose"


const addBlog = asyncHandler( async ( req, res ) =>
{
    const { title, description, status } = req.body
    const { _id: userId } = req.user
    const blogImage = req.file?.path || null;
    if ( !title && !description && !status )
    {
        return res.status( 400 ).json( new ApiError( 400, "All fields are required", [ "All fields are required" ] ) )
    }
    if ( title === "" && description === "" )
    {
        return res.status( 400 ).json( new ApiError( 400, "All fields are required", [ "All fields are required" ] ) )
    }
    if ( !userId )
    {
        return res.status( 401 ).json( new ApiError( 401, "Unauthorized request", [ "Unauthorized request" ] ) )
    }
    const cloudiImage = await uploadCloudinary( blogImage )
    if ( !cloudiImage )
    {
        return res.status( 400 ).json( new ApiError( 400, "Thumbnail image is required", [ "Thumbnail image is required" ] ) )
    }
    const blog = await Blog.create( {
        title,
        description,
        author: new mongoose.Types.ObjectId( userId ),
        thumbnailImage: cloudiImage.url,
        status
    } )
    return res.status( 201 ).json( new ApiResponse( 201, "Blog added successfully", blog ) )
} )


const updateBlog = asyncHandler( async ( req, res ) =>
{
    const { title, description, status } = req.body
    const blogId = req.params.id
    if ( !title && !description && !status )
    {
        return res.status( 400 ).json( new ApiError( 400, "All fields are required", [ "All fields are required" ] ) )
    }
    if ( title === "" && description === "" && status === "" )
    {
        return res.status( 400 ).json( new ApiError( 400, "All fields are required", [ "All fields are required" ] ) )
    }
    const blog = await Blog.findByIdAndUpdate( blogId, {
        $set: {
            title,
            description,
            status
        }
    }, { new: true } )
    if ( !blog )
    {
        return res.status( 404 ).json( new ApiError( 404, "Blog not found", [ "Blog not found" ] ) )
    }

    return res.status( 200 ).json( new ApiResponse( 200, "Blog updated successfully", blog ) )
} )

const deleteBlog = asyncHandler( async ( req, res ) =>
{
    const blogId = req.params.id
    if ( !blogId )
    {
        return res.status( 400 ).json( new ApiError( 400, "All fields are required", [ "All fields are required" ] ) )
    }
    await Blog.findByIdAndDelete( blogId )
    return res.status( 200 ).json( new ApiResponse( 200, "Blog deleted successfully", [] ) )
} )


const getAllBlogs = asyncHandler( async ( req, res ) =>
{
    const blogs = await Blog.find()
    return res.status( 200 ).json( new ApiResponse( 200, "Blogs fetched successfully", blogs ) )
} )

/// comment controller

const addComment = asyncHandler( async ( req, res ) =>
{
    const { comment } = req.body
    const blogId = req.params.id
    if ( !comment )
    {
        return res.status( 400 ).json( new ApiError( 400, "comment is required", [ "comment is required" ] ) )
    }
    if ( comment === "" )
    {
        return res.status( 400 ).json( new ApiError( 400, "comment is required", [ "comment is required" ] ) )
    }
    const blog = await Blog.findById( blogId )
    if ( !blog )
    {
        return res.status( 404 ).json( new ApiError( 404, "Blog not found", [ "Blog not found" ] ) )
    }
    const newComment = await Comment.create( {
        comment,
        blog: new mongoose.Types.ObjectId( blogId ),
    } )
    return res.status( 201 ).json( new ApiResponse( 201, "Comment added successfully", newComment ) )

} )

const updateComment = asyncHandler( async ( req, res ) =>
{
    const commentId = req.params.id
    const { comment: inComingComment } = req.body
    if ( !commentId )
    {
        return res.status( 400 ).json( new ApiError( 400, "comment id is required", [ "comment id is required" ] ) )
    }
    if ( !inComingComment )
    {
        return res.status( 400 ).json( new ApiError( 400, "comment is required", [ "comment is required" ] ) )
    }
    if ( inComingComment === "" )
    {
        return res.status( 400 ).json( new ApiError( 400, "comment is required", [ "comment is required" ] ) )
    }
    const comment = await Comment.findById( commentId )
    if ( !comment )
    {
        return res.status( 404 ).json( new ApiError( 404, "Comment not found", [ "Comment not found" ] ) )
    }
    comment.comment = inComingComment
    await comment.save( { validateBeforeSave: false } )
    return res.status( 200 ).json( new ApiResponse( 200, "Comment updated successfully", comment ) )
} )


const deleteComment = asyncHandler( async ( req, res ) =>
{
    const commentId = req.params.id
    if ( !commentId )
    {
        return res.status( 400 ).json( new ApiError( 400, "comment id is required", [ "comment id is required" ] ) )
    }
    await Comment.findByIdAndDelete( commentId )
    return res.status( 200 ).json( new ApiResponse( 200, "Comment deleted successfully", [] ) )
} )

/// Like controller

const addLike = asyncHandler( async ( req, res ) =>
{
    const blogId = req.params.id
    if ( !blogId )
    {
        return res.status( 400 ).json( new ApiError( 400, "blog id is required", [ "blog id is required" ] ) )
    }
    const blog = await Blog.findById( blogId )
    if ( !blog )
    {
        return res.status( 404 ).json( new ApiError( 404, "Blog not found", [ "Blog not found" ] ) )
    }
    blog.likes += 1
    await blog.save( { validateBeforeSave: false } )
    return res.status( 200 ).json( new ApiResponse( 200, "Blog liked successfully", blog.likes ) )
} )

const removeLike = asyncHandler( async ( req, res ) =>
{
    const blogId = req.params.id
    if ( !blogId )
    {
        return res.status( 400 ).json( new ApiError( 400, "blog id is required", [ "blog id is required" ] ) )
    }
    const blog = await Blog.findById( blogId )
    if ( !blog )
    {
        return res.status( 404 ).json( new ApiError( 404, "Blog not found", [ "Blog not found" ] ) )
    }
    if ( blog.likes <= 0 )
    {
        blog.likes = 0
    } else
    {

        blog.likes -= 1
    }
    await blog.save( { validateBeforeSave: false } )
    return res.status( 200 ).json( new ApiResponse( 200, "Blog liked successfully", blog.likes ) )
} )










export
{
    addBlog, updateBlog, deleteBlog,
    getAllBlogs, addComment, updateComment,
    deleteComment, addLike, removeLike
}