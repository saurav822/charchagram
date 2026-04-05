import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    constituency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Constituency",
        required: false
    },
    email: {
        type: String,
        required: false,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(email) {
                if (!email) return true;
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
            },
            message: "Please enter a valid email address"
        }
    },
    ageBracket: {
        type: String,
        required: false,
        enum: {
            values: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'],
            message: 'Age bracket must be one of: 18-25, 26-35, 36-45, 46-55, 56-65, 65+'
        }
    },
    gender: {
        type: String,
        required: false,
        enum: {
            values: ['male', 'female', 'other', 'prefer_not_to_say'],
            message: 'Gender must be one of: male, female, other, prefer_not_to_say'
        }
    },
    profileImage: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        required: false,
        default: 'user',
        enum: {
            values: ['user', 'admin', 'moderator'],
            message: 'Role must be one of: user, admin, moderator'
        }
    }
});

// Create a sparse index for email to allow multiple null values
userSchema.index({ email: 1 }, { sparse: true, unique: true });
userSchema.index({ name: 1 }, { unique: true });
userSchema.statics.getByUserName = function(userName) {
    return this.findOne({ name: userName });
};

export default mongoose.model("User", userSchema);