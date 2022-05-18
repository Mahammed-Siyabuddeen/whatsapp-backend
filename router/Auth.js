import express from 'express'
import { addTocontacts, allUsers, fetchRooms, signIn, signUp } from '../controllers/Auth.js'

const router=express.Router()

router.post('/login',signIn)
router.post('/signup',signUp)
router.get('/allusers',allUsers)
router.get('/adduser',addTocontacts)
router.post('/fetch',fetchRooms)
export default router