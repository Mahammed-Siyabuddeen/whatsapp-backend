import express from  'express'
import mongoose from 'mongoose'
import Message from './models/dbMessage.js';
import cors from 'cors'
import bodyParser from 'body-parser'
import AuthRouter from './router/Auth.js'
import messagesRouter from './router/Messages.js'
import PublicRouter from './router/Public.js'
import {Server} from 'socket.io'
import DbUsers from './models/DbUsers.js';
import { notification } from './controllers/Messages.js';
import env from 'dotenv'
const app=express()
env.config()
const port=process.env.PORT||9000;
const server=app.listen(port,()=>console.log(`Listening on Localhost:${port}`))

const io=new Server(server,{
    cors:{
        origin:'*',
        methods:["POST","GET"]
    },
    maxHttpBufferSize:'100mb'
})

let users={}


const addUsers=(userId,socketId)=>{
          users[userId]=socketId
}

const removeuser=(socketId)=>{
    delete users[socketId];

}

io.on('connection',(socket)=>{

    socket.on('join',async({userId,socketId})=>{
        socket.handshake.auth={userId}
        if(userId===undefined ||userId===null)
                    return;
        addUsers(userId,socket.id)
        var {contacts}= await DbUsers.findByIdAndUpdate(userId,{status:'online'},{new:true})
        for(var i=0;i<contacts.length;i++){
            socket.to(users[contacts[i]?._id]).emit('status',{_id:userId,status:'online'})
        }
    })

    socket.on('sendMessage',async({data,receiverId})=>{
        const {message,author,audioFile,imageFile,videoFile}=data
        io.to(users[receiverId]).emit('newMessage',data)
        Message.create({
            message,
            author,
            audioFile,
            imageFile,
            videoFile,  
            to:data.to,
        })
        if(!users[receiverId]){
           var req={body:{friendId:receiverId,_id:author,smsStatus:'unread'}}
            notification(req)
        }
    })

    socket.on('callUser',({userId,userName,friendId,signalData})=>{
        socket.emit('me',{socketId:socket.id})
        io.to(users[friendId]).emit('callUser',{from:userId,userName,signal:signalData})
    })
    socket.on('audioCall',({userId,userName,friendId,signalData})=>{
        io.to(users[friendId]).emit('audioCall',{from:userId,userName,signal:signalData})
    })

    socket.on('answerCall',({signal,to})=>{
        io.to(users[to]).emit('answerCall',{signal})
    })
   
     socket.on('demosever',(data)=>{
         socket.emit('democlient',{sms:'hi man'})
     })
   
    socket.on('disconnect',async()=>{
        removeuser(socket.handshake.auth.userId,)
        var _id=socket.handshake.auth.userId
        var date=new Date().toISOString()

        if(!_id) return;
        var {contacts}=await DbUsers.findByIdAndUpdate(_id,{status:date},{new:true})
        for(var i=0;i<contacts.length;i++){
        socket.to(users[contacts[i]?._id]).emit('status',{_id,status:date})
       }
    })


    socket.on('hangUp',({friendId})=>{
        io.to(users[friendId]).emit('hangUp')
    })


}) 



app.use(bodyParser.json({limit:'50mb',extended:true}))
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
app.use(cors())
app.use('/auth',AuthRouter)
app.use('/messages',messagesRouter)
app.use('/',PublicRouter)



// const CONNECTION_url='mongodb+srv://mohdshihab:el7HatUpxbzRvxP6@cluster0.5a7zn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(process.env.CONNECTION_URL,{
    useNewUrlParser:true,
})

