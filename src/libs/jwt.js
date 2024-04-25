
import  Jwt  from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
export function createAccessToken(user){    
    const payload = { id: user._id, role: user.role };

return new Promise((resolve, reject) => {
    Jwt.sign(
        payload, 
    TOKEN_SECRET,
    {
        expiresIn:"2h"
    },
    (err, token)=>{
        if(err) reject(err)
        resolve(token)
      
    }
    );
});
}