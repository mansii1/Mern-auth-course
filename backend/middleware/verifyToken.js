import jwt from 'jsonwebtoken'
export const verifyToken = (req, res, next) => {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!decodedToken){
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
        }
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};
