import express from 'express'
import { fetchRooms, signIn, signUp, updateProfile, userDetails } from '../controllers/Auth.js'
import { notification } from '../controllers/Messages.js'
import { auth } from '../middleware/Auth.js'

const router=express.Router()

router.post('/login',signIn)
router.post('/signup',signUp)
router.post('/updateprofile',auth,updateProfile)
router.get('/details/:_id',auth,userDetails)
router.post('/fetch',auth,fetchRooms)
router.post('/notification',auth,notification)

export default router