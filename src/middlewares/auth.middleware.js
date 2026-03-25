let jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

const authUser = (req,res,next) =>{
    const token = req.cookies.token;

    if(!token){
        return res.redirect("/login")
    }

    jwt.verify(token, secretKey, async (error, credentials) => {
        if (error) {
            return res.redirect("/login")
        }
        req.user = {
            id: credentials.id,
            email: credentials.email,
            username: credentials.username
        };
        next();
    });

}

module.exports = {
    authUser
}