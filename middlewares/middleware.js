const jwt = require("jsonwebtoken");

async function checkToken(req,res,next){
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

    if(typeof token !== 'undefined'){
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
        // req.token = token;
        jwt.verify(token, config.secretString, (err, decoded) => {
            if (err) {                
                return res.json({statusCode:0, message:'Token is not valid or expired !', todo:'Please login !'});
            } else {
                req.decoded=decoded;
                next();
                //return res.send({text:"protected router !", data:decoded, time:Date.now()})
            }
        });
        // next();       
    }
    else return res.send({statusCode:0, message:'Auth token is not supplied', todo:'Please login !'});
    
}

module.exports = {
    checkToken
}