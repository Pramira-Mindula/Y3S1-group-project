import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // දැන් ඕනෑම තැනක req.user.id ලෙස user තොරතුරු ගත හැක
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
    if (!token) res.status(401).json({ message: "No token, authorization denied" });
};