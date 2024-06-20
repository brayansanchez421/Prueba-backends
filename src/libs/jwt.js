
import  Jwt  from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
export function createAccessToken(user){    
    const payload = { email: user.email, id: user._id, role: user.role, courses: user.courses,
    };
    console.log(user);
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