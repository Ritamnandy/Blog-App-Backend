
import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema( {
    comment: {
        type: String,
        required: true,
        trim: true
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    },
}, {
    timestamps: true
} )

const Comment = mongoose.model( "Comment", commentSchema )

export { Comment }