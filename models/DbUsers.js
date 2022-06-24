import mongoose  from "mongoose";

const UsersSchema=mongoose.Schema({
    name:String,
    phoneNumber:{type:String,require:true},
    email:String,
    contacts:{type:[mongoose.Schema.Types.ObjectId],default:[]},
    password:{type:String,require:true},
    avatar:String,
})

export default mongoose.model('users',UsersSchema)