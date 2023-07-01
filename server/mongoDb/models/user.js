import  { Schema, model } from "mongoose";

const UserSchema= new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    allProperties: [{
        type: Schema.Types.ObjectId,
        ref: 'Property'
    },]
})

const userModel = model('User', UserSchema)

export default userModel