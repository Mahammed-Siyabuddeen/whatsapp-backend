import express from 'express'
import { fetchRooms, signIn, signUp, updateProfile, userDetails } from '../controllers/Auth.js'

const router=express.Router()

router.post('/login',signIn)
router.post('/signup',signUp)
router.post('/updateprofile',updateProfile)
router.get('/details/:_id',userDetails)
router.post('/fetch',fetchRooms)
export default router