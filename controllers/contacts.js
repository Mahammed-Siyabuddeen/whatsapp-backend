import mongoose from "mongoose";
import DbUsers from "../models/DbUsers.js";

export const allUsers = async (req, res) => {
    const {_id}=req.body;
    try {
        let contactData = await DbUsers.aggregate([
            {
                $match:{'_id':mongoose.Types.ObjectId(_id)}
            },
            {
                $unwind:'$contacts'
            },
            {
                $project:{
                    contacts:1,
                    _id:0,

                    
                },
                
            },{
                $project:{
                    '_id':'$contacts._id'
                }
            }
        ])
        
        
        
        let  allusers= DbUsers.find({},{'_id':1,name:1,phoneNumber:1,avatar:1})
        let totalData=await   Promise.all([allusers,contactData])
        totalData[1]=[...totalData[1],{"_id":_id}]
        
          

        var   arr1=totalData[1]
        var arr2=totalData[0]
  
            var len=arr1.length;
            var len2;;
            for(let i=0;i<len;i++)
            {
                for(let j=0,len2=arr2.length;j<len2;j++){
                    if((arr1[i]._id).toString()===(arr2[j]._id).toString())
                    {
                        arr2.splice(j,1);
                        len2=arr2.length
                    }
                }
            }
        res.status(200).json(arr2)
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message })

    }

}

export const addTocontacts = async (req, res) => {

    try {
        const { userId, _id } = req.body

         await DbUsers.findByIdAndUpdate(_id,{$push:{contacts:{_id:userId}}},{new:true})
        const data=await DbUsers.findByIdAndUpdate(userId,{$push:{contacts:{_id:_id}}},{new:true})
         res.status(200).json({ data })
    } catch (error) {
        res.status(404).json({ message: error })

    }


}