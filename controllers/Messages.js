import Message from '../models/dbMessage.js'
export const sync = async(req, res) => {
     const{userId,friendId}=req.body
    try {
    const totalDocuments=await Message.countDocuments( {   $or:[{$and:[{"author":userId},{"to":friendId}]},{$and:[{"author":friendId},{"to":userId}]}]})
    console.log('count is : ',totalDocuments);
    
        const data= await Message.find(
            {
            $or:[
                {
                    $and:[
                        {"author":userId},
                        {"to":friendId}
                    ]
                },
                {
                    $and:[
                        {"author":friendId},
                        {"to":userId}
                    ]
                }
            ]
        }
        ).skip(totalDocuments>=40&&  totalDocuments-20)

        res.status(200).json({data})
    } catch (error) {

        
    }
}
export const newMessage = async (req, res) => {
    const { dbMessage, author, to } = req.body;
    const sms = await Message.create(dbMessage, (err, data) => {
        if (err) res.status(500).send(err)
        else res.status(201).send(data)
    })


}