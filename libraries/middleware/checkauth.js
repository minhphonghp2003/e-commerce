import jwt from 'jsonwebtoken'
import fs from 'fs'

const checkAuth = async (req, res,next) => {
    let token = req.headers.token
    
    var cert = fs.readFileSync('public.pem'); 
    jwt.verify(token, cert, function (err, decoded) {
        if(err){
            next(err)
        }
        req.data = decoded
        next()
    });

}


export default {checkAuth}