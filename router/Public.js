import express, { Router } from 'express'
import { addTocontacts, allUsers } from '../controllers/contacts.js'

const router=express.Router()

router.get('/',(req,res)=>{
    res.send('this is from public route')
})
router.post('/allusers',allUsers)
router.post('/addcontacts',addTocontacts)


export default router;
