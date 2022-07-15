import mongoose  from "mongoose";

const UsersSchema=mongoose.Schema({
    name:String,
    phoneNumber:{type:String,require:true},
    email:String,
    contacts:{type:[{_id:mongoose.Schema.Types.ObjectId,smsStatus:String}],default:[]},
    password:{type:String,require:true},
    avatar:String,
    status:String,
})

export default mongoose.model('users',UsersSchema)