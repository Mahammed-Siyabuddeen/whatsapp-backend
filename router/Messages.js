import express from 'express'
import { sync,newMessage ,FindMessage} from '../controllers/Messages.js'
import { auth } from '../middleware/Auth.js'

const router=express.Router()

router.post('/sync',auth,sync)
router.post('/new',auth,newMessage)
router.get('/videofile/:_id',auth,FindMessage)
export default router