import Jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "authorization denied" });
    }

    Jwt.verify(token, TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "invalid token" });
      }
      req.user = user;
      next();
    });
    
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
