
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { RESPONSE } from './constants';
import AWS from 'aws-sdk';
import { appConfigs }  from '../config/config';

// to generate uuid for each user added
export const generateId = ()=>{
    return uuidv4();
};

// to encrypt password using salt
export const ecryptPass = async(pass)=>{
    let salt = 10;
    let result = await bcrypt.hash(pass,salt);
    return result;
};
// to match user's password
export const comparePass = async(pass,hash)=>{
    return await bcrypt.compare(pass,hash);
};

// to send response in format
export const respMsg = async(code=0,msg='',data) =>{
    let obj = JSON.parse(JSON.stringify(RESPONSE));
    if(code) obj.statusCode = code;
    if(msg) obj.message = msg;
    if(data) obj.data = data;
    return obj;
}

// to check validation of username(email)
export const checkValidEmail = (email) => {
  var filter = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (filter.test(email)) return true;
  return false;
}

export const getUserPassAuth = (authHeader) => {
    let auth = Buffer.from(authHeader.split(' ')[1],'base64').toString('ascii').split(':');
    let username = auth[0];
    let password = auth[1];
    return {username,password};
}

const generateRandomString = () => {
    return Array(5).fill(0).map(()=>"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.random()*62)).join("");
}

export const upload_s3 = async(file) => {

    try{
        let fileName = generateRandomString();
        
        let s3bucket = new AWS.S3({
            accessKeyId: `${appConfigs.s3.ACCESS_KEY}`,
            secretAccessKey: `${appConfigs.s3.SECRET_KEY}`
        });
        
        const params = {
            Bucket: `${appConfigs.s3.BUCKET_NAME}`,
            Key: `${fileName}.${file.mime.split('/')[1]}`,
            Body: new Buffer(file.data,'base64'),
            ContentEncoding: 'base64',
            ContentType: file.mime
        };

        try{
            console.log("************************before s3 upload**************************");
            return await s3bucket.upload(params).promise();
        }catch(err){
            console.log(err);
        }

    }catch(e){
        return await respMsg(500,'',[e]);
    }
     
}

export const delete_s3 = async(key) => {

    try{
        
        let s3bucket = new AWS.S3({
            accessKeyId: `${appConfigs.s3.ACCESS_KEY}`,
            secretAccessKey: `${appConfigs.s3.SECRET_KEY}`
        });
        
        const params = {
            Bucket: `${appConfigs.s3.BUCKET_NAME}`,
            Key: key
        };

        try{
            return await s3bucket.deleteObject(params).promise();
        }catch(err){
            console.log(err);
        }

    }catch(e){
        return await respMsg(500,'',[e]);
    }
     
}


export const add_dynamo_data = async(data) => {
    try{
        
        var docClient = new AWS.DynamoDB.DocumentClient({region:'us-east-1'});
        let table = "dynamo";

        const searchParams = {
            TableName:table,
            Key:{
                "email": data.username
            }
        };
        console.log("*******------********************");
        console.log(searchParams);
        const result = await docClient.get(searchParams);
        console.log("*******------********************");
        console.log(result);
        console.log("*******------********************");
        // docClient.get(searchParams, function(err, data) {
        //     if (err) {
        //         console.log("------------ get  data error -----------------")
        //         console.log(err);
        //         return false;
        //     }else{
        //         console.log("------------ get data -----------------")
        //         console.log(data);
                
        //     }
        // });


        const params = {
            TableName:table,
            Item:{
                "email": data.username,
                "token": data.token
            }
        };

        console.log("***************************");
        console.log(params);
        
        docClient.put(params, function(err, data) {
            if (err) {
              console.log("Error", err);
              return false;
            } else {
              console.log("Success", data);
              return true;
            }
          });
        
        // const result = await docClient.put(params);
        // console.log(result);
        // if(result) return true;
        // return false;

    }catch(e){
        return await respMsg(500,'',[e]);
    }
}

export const get_dynamo_data = async(data) => {
    try{
        
        var docClient = new AWS.DynamoDB.DocumentClient({region:'us-east-1'});
        let table = "dynamo";

        const params = {
            TableName:table,
            Key:{
                "email": data.username
            }
        };
        console.log("*******------********************");
        console.log(params);

        const result = await docClient.get(params);
        if(result){
            console.log(result, " kdkdk");
            
        }else{
            return await respMsg(500,'Data not exits in dynamo db',[]);
        }


    }catch(e){
        return await respMsg(500,'',[e]);
    }
}