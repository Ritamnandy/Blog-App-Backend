
import mongoose from 'mongoose'
import { status } from '../constant.js'

const blogSchema = new mongoose.Schema( {
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    thumbnailImage: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: status,
        default: "draft",
        required: true
    },
    likes: {
        type: Number,
        default: 0
    }
}, { timestamps: true } )

const Blog = mongoose.model( "Blog", blogSchema )

export { Blog }