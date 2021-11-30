import express, { Request, Response } from 'express';
import * as UserService from './users.service';
import { respMsg, getUserPassAuth, checkValidEmail } from '../../utils/helper';
import { MESSAGES } from '../../utils/constants';
import { auth } from '../../utils/auth';
export const userRouter = express.Router();
import {logger} from '../../../config/winston';
// import StatsD from 'node-statsd';
import SDC from 'statsd-client';
const sdc = new SDC({host: 'localhost', port: 8125});
// var sdc = new StatsD();


userRouter.get('/',auth, async ( req: Request, res: Response,next) => {
  try {
      sdc.increment('user_get');
      let startTime = new Date().valueOf();
      logger.info('Get user details  ' + req.ip);
      let authHeader = req.headers.authorization;
      let {username} = await getUserPassAuth(authHeader);
      
      let obj = {
        username: username
      };
      
      const result = await UserService.getUser(obj);
      let endTime = new Date().valueOf();
      sdc.timing('user_get_timer', endTime-startTime);
      res.status(200).send(result);
  }
  catch (e) {
    logger.error('Error get user details  ' + req.ip);
    res.status(500).send(e);
  }
});

userRouter.post('/', async (req: Request, res: Response) => {
  
  try {
    sdc.increment('user_add');
    let startTime = new Date().valueOf();
    logger.info('Add new user details  ' + req.ip);
    if (!req.body.first_name || !req.body.last_name || !req.body.password || !req.body.username || !checkValidEmail(req.body.username)) {

      const msg = await respMsg(400, MESSAGES.BAD_REQUEST, []);
      let endTime = new Date().valueOf();
      sdc.timing('user_add_timer', endTime-startTime);
      res.status(400).send(msg);

    } else {
      
      let { first_name, last_name, password, username } = req.body;

      const result = await UserService.saveUser({ first_name, last_name, password, username })
      let endTime = new Date().valueOf();
      sdc.timing('user_add_timer', endTime-startTime);
      res.status(result.statusCode).send(result);
    }
  }
  catch (e) {
    logger.error('Error add new user details  ' + req.ip);
    res.status(500).send(e);
  }
});

userRouter.patch('/', auth, async (req: Request, res: Response) => {
  try {
    sdc.increment('user_update');
    let startTime = new Date().valueOf();
    logger.info('Update user details  ' + req.ip);
    if (req.body.id || req.body.account_updated || req.body.account_created) {
      
      const msg = await respMsg(400, MESSAGES.BAD_REQUEST, []);
      let endTime = new Date().valueOf();  
      sdc.timing('user_update_timer', endTime-startTime);
      res.status(msg.statusCode).send(msg);
    } else {
      let authHeader = req.headers.authorization;
      let {username} = await getUserPassAuth(authHeader);

      let obj = {
        username: username,
        first_name:'',
        last_name:'',
        password:''
      };
      
      if (req.body.first_name) obj.first_name = req.body.first_name;
      if (req.body.last_name) obj.last_name = req.body.last_name;
      if (req.body.password) obj.password = req.body.password;
      // let resObj =  Object.entries(obj).reduce((a,[k,v]) => (v == null ? a : (a[k]=v, a)), {});
      for (var prop in obj) {
        if (obj[prop] == '' || obj[prop] === null || obj[prop] === undefined) {
            delete obj[prop];
        }
    }
      const result = await UserService.updateUser(obj);
      let endTime = new Date().valueOf();
      sdc.timing('user_update_timer', endTime-startTime);
      res.status(result.statusCode).send(result);
    }
  }
  catch (e) {
    logger.error('Error Updating user details  ' + req.ip);
    res.status(500).send(e);
  }
});

userRouter.get('/verifyUserEmail', async ( req: Request, res: Response,next) => {
  try {
      if(!req.query.email){
        res.status(500).send(MESSAGES.INVALID_USER);
      }
    
      let obj = {
        username: req.query.email,
        token: req.query.token
      };
      
      const result = await UserService.verifyUserEmail(obj);
      res.status(200).send(result.message);
  }
  catch (e) {
    logger.error('Error get user details  ' + req.ip);
    res.status(500).send(e);
  }
});

