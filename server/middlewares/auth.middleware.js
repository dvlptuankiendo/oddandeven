import jwt from 'jsonwebtoken'

export default (req, res, next) => {

    let token = req.headers.authorization?.split(' ')[1]
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

        const userInfo = jwt.decode(token);

        req.userId = userInfo.userId;
        req.account = userInfo.account;
        req.displayName = userInfo.displayName;

        next();
    } catch (err) {
        res.status(401).send(err.message);
    }
}