import jwt, { decode } from "jsonwebtoken";
export const reqAuth=(req,res,next)=>{
    try{
        const authorization = req.headers.authorization;
        if(!authorization){
            return res.status(401).json("Acess Denied")
        }
        const token = authorization.split(" ")[1];
        const decoded=jwt.verify(token,process.env.SECRET)
        console.log(decoded)
        req.user=decoded
        next()
    }
    catch(e){
        res.status(400).json({"error":e.message})
    }
}
