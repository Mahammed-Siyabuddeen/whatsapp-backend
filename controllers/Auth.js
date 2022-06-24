import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import DbUsers from '../models/DbUsers.js'
import mongoose from 'mongoose'
export const signIn = async (req, res) => {
    const { phoneNumber, password } = req.body
    console.log('hello this is login page')

    try {
        const existUser = await DbUsers.findOne({ phoneNumber })

        if (!existUser)
            return res.status(400).json({ message: 'user not found' })
        const isPassword = await bcrypt.compare(password, existUser.password)
        if (!isPassword) return res.status(400).json({ message: 'password incorrect' })
        const token = jwt.sign({ email: existUser.email, id: existUser._id }, 'test', { expiresIn: '1h' })
        const { name, contacts, _id,email,avatar } = existUser

        res.status(200).json({ name, phoneNumber, contacts, _id, token,email ,avatar})
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message })

    }

}

export const signUp = async (req, res) => {
    const { name, password, email, contacts, phoneNumber,avatar } = req.body
    console.log('hello this is sigup page')

    try {
        const oldUser = await DbUsers.findOne({ phoneNumber })
        if (oldUser)
            return res.status(400).json({ message: 'user already exists ' });

        const hashPassword = await bcrypt.hash(password, 12)
        const result = await DbUsers.create({ name, password: hashPassword, email, contacts, phoneNumber,avatar })

        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: '1h' })
        res.status(201).json({ _id: result?._id, name, contacts, phoneNumber, token ,avatar,email})
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message })
    }
}



export const fetchRooms = async (req, res) => {
    const { _id } = req.body;
    try {
        var list = await DbUsers.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(_id) }
            },
            {
                $unwind: '$contacts'
            }, {
                $project: {
                    item: '$contacts'
                }
            }, {
                $lookup: {
                    from: 'users',
                    localField: 'item',
                    foreignField: '_id',
                    as: 'room'
                },
            }, {
                $project: {
                    _id: 1, room: 1
                }
            },
            {
                $unwind: '$room'
            }, {
                $project: { _id: '$room._id', name: '$room.name', phoneNumber: '$room.phoneNumber',email:'$room.email',avatar:'$room.avatar' ,}
            }
        ])
        res.status(200).json({ list })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const updateProfile=async(req,res)=>{
    const {type,data,_id}=req.body;
    try {
        
        let result  
        switch(type){
            case 'name'         :result=await DbUsers.updateOne({_id:mongoose.Types.ObjectId(_id)},{$set:{name:data}})
                                  break;
            case 'email'        :result=await DbUsers.updateOne({_id:mongoose.Types.ObjectId(_id)},{$set:{email:data}})  
                                   break;   
            case 'phoneNumber'  :let existsPhoneNumber=await DbUsers.findOne({phoneNumber:data})
                                    console.log('exitnumber : ',existsPhoneNumber);
                                    if(existsPhoneNumber)  return res.status(400).json({message:'phoneNumber already used'}) 
                                    console.log('not existed user');
                                    result=await DbUsers.updateOne({_id:mongoose.Types.ObjectId(_id)},{$set:{phoneNumber:data}})
                                    break;  
           case 'avatar'        :result=await DbUsers.updateOne({_id:mongoose.Types.ObjectId(_id)},{$set:{avatar:data}})
                                    break;                                       
        }



        console.log('result : ',result);
         return res.status(200).json(result)
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
    
}
export const userDetails=async(req,res)=>{
    try {
        const {_id}=req.params;
        const user=await DbUsers.findById(_id)
    if(!user) return res.status(404).json({message:'user is not found'})
    const{name,phoneNumber,email,avatar}=user
    return res.status(200).json({name})
    } catch (error) {
        return res.status(404).json({message:error.message})
    }
}

                
