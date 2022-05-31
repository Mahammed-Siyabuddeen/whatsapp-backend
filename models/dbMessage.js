import mongoose from 'mongoose'

const WhatsappSchema=mongoose.Schema({
    message:String,
    audioFile:String,
    timeStamp:{type:Date,default:new Date},
    author:mongoose.Types.ObjectId,
    to:mongoose.Types.ObjectId
})


export default  mongoose.model('messagecontents',WhatsappSchema)