//import jwt from 'jsonwebtoken';
//import { TOKEN_SECRET } from './../config.js'

export const authRequired = (req, res, next) => {    
    //const token = req.headers.cookie;
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "No token, Authorization denied"});

    next();
}