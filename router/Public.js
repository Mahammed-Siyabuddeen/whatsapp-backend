import express, { Router } from 'express'
import { addTocontacts, allUsers } from '../controllers/contacts.js'
import { auth } from '../middleware/Auth.js'

const router=express.Router()

router.get('/',(req,res)=>{
    res.send('this is from public route')
})
router.post('/allusers',auth,allUsers)
router.post('/addcontacts',auth,addTocontacts)


export default router;
