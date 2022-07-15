import jwt from 'jsonwebtoken'
const secret='test'

export const auth=(req,res,next)=>{
    try {
        const token=req.headers.authorization.split(' ')[1]
        const decodedData=jwt.verify(token,secret)
        req.userId=decodedData.id
        next();

    } catch (error) {
        console.log(error);
        res.status(400).send(error.message)
    }
  
}