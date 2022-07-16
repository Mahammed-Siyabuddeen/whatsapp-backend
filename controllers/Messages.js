import mongoose from 'mongoose';
import Message from '../models/dbMessage.js'
import DbUsers from '../models/DbUsers.js';
export const sync = async(req, res) => {
     const{userId,friendId}=req.body
    try {
    const totalDocuments=await Message.countDocuments( {   $or:[{$and:[{"author":userId},{"to":friendId}]},{$and:[{"author":friendId},{"to":userId}]}]})
    console.log('count is : ',totalDocuments);
    
        const data= await Message.find(
            {
            $or:[
                {
                    $and:[
                        {"author":userId},
                        {"to":friendId}
                    ]
                },
                {
                    $and:[
                        {"author":friendId},
                        {"to":userId}
                    ]
                }
            ]
        },{message:1,audioFile:1,imageFile:1,timeStamp:1,author:1,to:1}
        ).skip(totalDocuments>=40&&  totalDocuments-20)

        res.status(200).json({data})
    } catch (error) {

        
    }
}
export const newMessage = async (req, res) => {
    const { dbMessage, author, to } = req.body;
    const sms = await Message.create(dbMessage, (err, data) => {
        if (err) res.status(500).send(err)
        else res.status(201).send(data)
    })


}

export const FindMessage=async(req,res)=>{
    try {
    const {_id}=req.params
    const {videoFile}=await Message.findById({_id},{videoFile:1})

    return  res.status(200).json(videoFile)
    } catch (error) {
        return res.status(404).json({message:error.message}) 
    }
}

export const notification=async(req,res)=>{
    const {friendId,_id,smsStatus}=req.body;
   
    try {
        var result=await DbUsers.updateOne(
            {_id:mongoose.Types.ObjectId(friendId), "contacts._id":mongoose.Types.ObjectId(_id)},
            {$set:{"contacts.$.smsStatus":smsStatus}},
            
        )
        res?.status(200).send({result,friendId,_id,smsStatus})
    } catch (error) {
        console.log(error);
        res?.status(404).send({message:error.message})
    }
}