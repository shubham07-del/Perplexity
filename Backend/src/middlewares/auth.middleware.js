import jwt from "jsonwebtoken"
export async function authMiddleware(req,res,next){
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"Invaid token",
            success:false,
            err:"Token not found"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }catch(err){
        console.log(err.message)
    }
}