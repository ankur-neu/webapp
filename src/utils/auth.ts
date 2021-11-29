import { comparePass, respMsg, getUserPassAuth} from './helper';
import { MESSAGES } from './constants';
import * as dotenv from 'dotenv';

// import * as model  from '../models';
import User from '../components/users/users.model';
dotenv.config();

export const auth = async(req,res,next) => {
    let authHeader = req.headers.authorization;
    // check if authorization token is present
    
     if(!authHeader){
            let result = await respMsg(401,MESSAGES.UNAUTHORIZED,[]);
            res.statusCode = 401;
            res.setHeader('WWW-Authenticate', 'Basic realm="bad token request"');
            res.json(result);

    }else{
        let {username,password} = getUserPassAuth(authHeader);

        // match if username and password are same
        let search = {
            where:{
                username:username
            }
        }
        
        let user = await User.findOne(search);
        if(user){
            if(!user.verified){
                let result = await respMsg(401,MESSAGES.UNVERIFIED,[]);
                res.statusCode = 401;
                res.setHeader('WWW-Authenticate', 'Basic realm="unverified request"');
                res.json(result);
            }else{
                let isValidPass = await comparePass(password,user.password);
                if(isValidPass) next();
                else{
                    let result = await respMsg(401,MESSAGES.UNAUTHORIZED,[]);
                    res.statusCode = 401;
                    res.setHeader('WWW-Authenticate', 'Basic realm="bad token request"');
                    res.json(result);
                }
            }
        }else{
            let result = await respMsg(401,MESSAGES.UNAUTHORIZED,[]);
            res.statusCode = 401;
            res.setHeader('WWW-Authenticate', 'Basic realm="bad token request"');
            res.json(result);
        }
    }
}


