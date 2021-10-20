import { IUser } from './users.model';
import User from './users.model';
import { generateId, ecryptPass, respMsg} from '../../utils/helper';
import { MESSAGES } from '../../utils/constants';

// to fetch user details based on username
export const getUser  = async(data) => {
    try{
        let search = {
            where:{
                username:data.username
            }
        }

        let user = await User.findOne(search);
        // to check if user exist with provied username
        if(user){
            let userData = await formatUser(user['dataValues']);
            return respMsg(200,MESSAGES.SUCCESS,[userData]);
        }else{
            return respMsg(200,MESSAGES.USER_NOT_EXIST,[]);
        }
        
    }catch(e){
        return await respMsg(500,'',[e]);
    }
 
}

// to save a new user in the database
export const saveUser = async(data) =>{
    try{
        let search = {
            where:{
                username:data.username
            }
        }
        let userExist = await User.findOne(search);
        // to check if user already exist
        if(userExist){
            return await respMsg(400,MESSAGES.USER_EXIST,[]);
        }else{
            data['id'] = await generateId();
            data['password'] = await ecryptPass(data['password']);
            const user = new User(data);
            const result =  await user.save();
            let userData = await formatUser(result['dataValues']);
        
            return await respMsg(201,MESSAGES.USER_ADD_SUCCESS,[userData]);
        }
    }catch(e){
        return await respMsg(500,'',[e]);
    }
}

// to update the user details based on username
export const updateUser = async(data:IUser) =>{
    try{

        let search = {
            where:{
                username:data.username
            }
        }
        const user = await User.findOne(search);
        // to check if user exits then update user details
        if(user){
            if(data.first_name)user.first_name = data.first_name;
            if(data.last_name)user.last_name = data.last_name;
            if(data.password)user.password = await ecryptPass(data.password);
            
            const result =  await user.save();
            const userData = await formatUser(result['dataValues']);

            return respMsg(200,MESSAGES.USER_UPDATED_SUCCESS,[userData]);
        }else{
            return respMsg(401,MESSAGES.USER_NOT_EXIST,[]);
        }
        
    }catch(e){
        return await respMsg(500,'',[e]);
    }
 
}

// to format user data, excluding password
export const formatUser = async(data)=>{
    try{
        if(data['password']) delete data['password'];
        return data;
    }catch(e){
        return await respMsg(500,'',[e]);
    }
}
