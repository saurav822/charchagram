import mongoose from 'mongoose';


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    views: {
        type: Number,
        required: false,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: false
    }],
    commentCount: {
        type: Number,
        default: 0
    },
    link: {
        type: String,
        required: false
    },
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislike: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    constituency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Constituency",
        required: true
    },
    tags: [{
        type: String,
        required: false
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isEdited: {
        type: Boolean,
        default: false,
        required: false
    },
    pollOptions: [{
        label: {
            type: String,
            required: false
        },
        votes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        }],
        percentage: {
            type: Number,
            required: false
        }
    }],
    pollType: {
        type: String,
        required: false
    },
    totalVotes: {
        type: Number,
        required: false,
        default: 0,
    }
})

postSchema.index({ constituency: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
// postSchema.index({ tags: 1 });

postSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        //delete the comments of this postID
        await mongoose.model('Comment').deleteMany({ post: this._id })
        next();
    }
    catch (error) {
        next(error);
    }
})

export default mongoose.model("Post", postSchema);