import express from  'express'
import mongoose from 'mongoose'
import Message from './models/dbMessage.js';
import cors from 'cors'
import AuthRouter from './router/Auth.js'
import messagesRouter from './router/Messages.js'
import {Server} from 'socket.io'
const app=express()
const port=process.env.PORT||9000;



const server=app.listen(port,()=>console.log(`Listening on Localhost:${port}`))

const io=new Server(server,{
    cors:{
        origin:'*',
        methods:["POST","GET"]
    }
})

let users={}


const addUsers=(userId,socketId)=>{

          users[userId]=socketId
        console.log(users);
}

const removeuser=(socketId)=>{
    delete users[socketId];

}

io.on('connection',(socket)=>{
    console.log('socketio connected');
    

    socket.on('join',({userId,socketId})=>{
        if(userId===undefined ||userId===null)
                    return;
        addUsers(userId,socket.id)
    })

    socket.on('sendMessage',async({data,receiverId})=>{
        const {message,author,audioFile}=data
        console.log(receiverId);
        io.to(users[receiverId]).emit('newMessage',data)
        Message.create({
            message,
            author,
            audioFile,
            to:data.to
        })
    })

    socket.on('callUser',({userId,userName,friendId,signalData})=>{
        socket.emit('me',{socketId:socket.id})
    
        io.to(users[friendId]).emit('callUser',{from:userId,userName,signal:signalData})
    })

    socket.on('answerCall',({signal,to})=>{
        console.log('answer the call:',to);
        io.to(users[to]).emit('answerCall',{signal})
    })
   
     socket.on('demosever',(data)=>{
         socket.emit('democlient',{sms:'hi man'})
     })
   
    socket.on('disconnect',()=>{
        console.log('user is left!!!');
        removeuser(socket.id)
        console.log(users);
    })
    socket.on('hangUp',({friendId})=>{
        console.log('hangUp')
        io.to(users[friendId]).emit('hangUp')
    })



}) 



app.use(express.json())
app.use(cors())
app.use('/auth',AuthRouter)
app.use('/messages',messagesRouter)
app.get('/',(req,res)=>{
    res.status(200).send("hello world")
})



const CONNECTION_url='mongodb+srv://mohdshihab:el7HatUpxbzRvxP6@cluster0.5a7zn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(CONNECTION_url,{
    useNewUrlParser:true,
})

