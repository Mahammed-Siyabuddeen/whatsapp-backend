import jwt from 'jsonwebtoken'
const secret='test'

export const auth=(req,res,next)=>{
      console.log(req);

    try {
        const token=req.headers.authorization.splite(' ')[1]
        const decodedData=token.verfiy(token,secret)
        req.userId=decodedData?.id
        next()

    } catch (error) {
        console.log(error);
    }
  
}