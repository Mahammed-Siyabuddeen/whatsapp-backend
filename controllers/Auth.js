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
        const { name, contacts, _id } = existUser

        res.status(200).json({ name, phoneNumber, contacts, _id, token })
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message })

    }

}

export const signUp = async (req, res) => {
    const { name, password, email, contacts, phoneNumber } = req.body
    console.log('hello this is sigup page')

    try {
        const oldUser = await DbUsers.findOne({ phoneNumber })
        if (oldUser)
            return res.status(400).json({ message: 'user already exists ' });

        const hashPassword = await bcrypt.hash(password, 12)
        const result = await DbUsers.create({ name, password: hashPassword, email, contacts, phoneNumber })

        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: '1h' })
        res.status(201).json({ _id: result?._id, name, contacts, phoneNumber, token })
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message })
    }
}

export const addTocontacts = async (req, res) => {

    try {
        const { phoneNumber, id } = req.body
        console.log(phoneNumber);
        const user = await DbUsers.findOne({ phoneNumber })
        if (!user) return res.status(400).json({ message: 'user is not whatsapp' })
        const myData = await DbUsers.findById(id)
        myData.contacts.push(user._id)
        const data = await DbUsers.findByIdAndUpdate(id, myData, { new: true })
        res.status(200).json({ data })
    } catch (error) {
        res.status(404).json({ message: error.message })

    }


}

export const fetchRooms = async(req, res) => {
    const { _id } = req.body;
    try {
        var list = await DbUsers.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(_id) }
            },
            {
                $unwind: '$contacts'
            },{
                $project:{
                    item:'$contacts'
                }
            },{
                $lookup:{
                    from:'users',
                    localField:'item',
                    foreignField:'_id',
                    as:'room'
                },
            },{
                $project:{
                 _id:1,    room:1
                }
            },
            {
                $unwind:'$room'
            },{
               $project:{ _id:'$room._id',name:'$room.name',phoneNumber:'$room.phoneNumber'}
            }
        ])
     res.status(200).json({list})
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
export const allUsers = async (req, res) => {
    try {

        const users = await DbUsers.find().sort({ _id: -1 })
        res.status(200).json({ users })
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message })

    }

}