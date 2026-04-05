/**
 * @module models/blog
 *
 * Mongoose schema and model for platform-wide Blog documents.
 *
 * Blogs differ from Posts in scope: Posts are constituency-scoped (local),
 * while Blogs are platform-wide editorial content authored by citizens or admins.
 *
 * Notable design decisions:
 *  - `author` is stored as a String (MongoDB ObjectId string) rather than a
 *    DBRef so that the field remains readable even if the User document is
 *    later deleted.
 *  - `slug` is auto-generated from the title on first save via a pre-save hook.
 *  - Deleting a Blog cascades to its Comment documents via a pre-deleteOne hook.
 */

import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: false
    },
    preview: {
        type: String,
        required: false
    },
    author: {
        type: String,
        required: true
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
    views: {
        type: Number,
        required: false,
        default: 0
    },
    tags: [{
        type: String,
        required: false
    }],
    createdAt: {
        type: Date,
        required: true
    },
    isUpdated: {
        type: Boolean,
        default: false
    },
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislike: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    updatedAt: {
        type: Date,
        required: true        
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    slug: {
        type: String,
        required: false
    }
});

// Indexes for better query performance
blogSchema.index({ createdAt: -1 });
blogSchema.index({ isPublished: 1, createdAt: -1 });

// Pre-save middleware to generate slug from title
blogSchema.pre('save', function(next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }
    this.updatedAt = new Date();
    next();
});

// Pre-delete middleware to clean up comments
blogSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        // Delete the comments of this blog
        await mongoose.model('Comment').deleteMany({ blog: this._id });
        next();
    }
    catch (error) {
        next(error);
    }
});

export default mongoose.model("Blog", blogSchema);
