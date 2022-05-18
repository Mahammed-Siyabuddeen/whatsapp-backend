import express from 'express'
import { sync,newMessage } from '../controllers/Messages.js'

const router=express.Router()

router.post('/sync',sync)
router.post('/new',newMessage)
export default router