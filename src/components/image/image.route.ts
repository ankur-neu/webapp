import express, { Request, Response } from 'express';
import * as ImageService from './image.service';
import { respMsg, getUserPassAuth } from '../../utils/helper';
import { MESSAGES } from '../../utils/constants';
import { auth } from '../../utils/auth';
import {logger} from '../../../config/winston';
export const imageRouter = express.Router();
// import StatsD from 'node-statsd';
// var sdc = new StatsD();
import SDC from 'statsd-client';
const sdc = new SDC({host: 'localhost', port: 8125});

imageRouter.get('/',auth, async ( req: Request, res: Response,next) => {
  try {
    sdc.increment('image_get');
    let startTime = new Date().valueOf();
    if (req.body.file_name || req.body.id || req.body.url || req.body.upload_date || req.body.user_id) {
        logger.info('Image get Bad Request  ' + req.ip);
        const msg = await respMsg(400, MESSAGES.BAD_REQUEST, []);
        let endTime = new Date().valueOf();
        sdc.timing('image_get_timer', endTime-startTime);
        res.status(msg.statusCode).send(msg);
    }else{
      logger.info('Get Image details  ' + req.ip);
      let authHeader = req.headers.authorization;
      let {username} = await getUserPassAuth(authHeader);
      
      let obj = {
        username: username
      };
      
      const result = await ImageService.getUserImage(obj);
      let endTime = new Date().valueOf();
      sdc.timing('image_get_timer', endTime-startTime);
      res.status(200).send(result);
    
    }
  }
  catch (e) {
    logger.error('Error Getting Image details  ' + req.ip);
    res.status(500).send(e);
  }
});

imageRouter.post('/',auth, async (req: Request, res: Response) => {
  try {
    sdc.increment('image_add');
    let startTime = new Date().valueOf();
    if (req.body.file_name || req.body.id || req.body.url || req.body.upload_date || req.body.user_id) {
        logger.info('Post Image details bad request  ' + req.ip);
        const msg = await respMsg(400, MESSAGES.BAD_REQUEST, []);
        let endTime = new Date().valueOf();
        sdc.timing('image_add_timer', endTime-startTime);
        res.status(msg.statusCode).send(msg);
    }else{
        logger.info('Post Image details  ' + req.ip);
        let authHeader = req.headers.authorization;
      
        let {username} = await getUserPassAuth(authHeader);
    
        let obj = {
            username: username,
            file:req.body.image
        };
    
        const result = await ImageService.uploadUserImage(obj);
        // result['upload_date'] = getDateFormat(result['upload_date']);
        let endTime = new Date().valueOf();
        sdc.timing('image_add_timer', endTime-startTime);
        res.status(result.statusCode).send(result);
    } 
  }
  catch (e) {
    logger.error('Error Post Image details  ' + req.ip);
    res.status(500).send(e);
  }
});

imageRouter.delete('/', auth, async (req: Request, res: Response) => {
  
  try {
    sdc.increment('image_delete');
    let startTime = new Date().valueOf();
    if (req.body.file_name || req.body.id || req.body.url || req.body.upload_date || req.body.user_id) {
        logger.info('Delete Image details bad request  ' + req.ip);
        const msg = await respMsg(400, MESSAGES.BAD_REQUEST, []);
        let endTime = new Date().valueOf();
        sdc.timing('image_delete_timer', endTime-startTime);
        res.status(msg.statusCode).send(msg);
    }else{
        logger.info('Delete Image details  ' + req.ip);
        let authHeader = req.headers.authorization;
        let {username} = await getUserPassAuth(authHeader);

        let obj = {
            username: username
        };

        const result = await ImageService.deleteImage(obj);
        let endTime = new Date().valueOf();
        sdc.timing('image_delete_timer', endTime-startTime);
        res.status(result.statusCode).send(result);
    }
  }
  catch (e) {
    logger.error('Error Delete Image details  ' + req.ip);
    res.status(500).send(e);
  }
});

imageRouter.patch('/', auth, async (req: Request, res: Response) => {
    try {
      sdc.increment('image_update');
      let startTime = new Date().valueOf();
        if (req.body.file_name || req.body.id || req.body.url || req.body.upload_date || req.body.user_id) {
            logger.info('Update Image details bad request  ' + req.ip);
            const msg = await respMsg(400, MESSAGES.BAD_REQUEST, []);
            
            res.status(msg.statusCode).send(msg);
        }else{
            logger.info('Update Image details  ' + req.ip);
            let authHeader = req.headers.authorization;
            let {username} = await getUserPassAuth(authHeader);

            let obj = {
                username: username,
                file:req.body.image
            };
        
            const result = await ImageService.updateImage(obj);
            let endTime = new Date().valueOf();
            sdc.timing('image_update_timer', endTime-startTime);
            res.status(result.statusCode).send(result);
        }
    }
    catch (e) {
      logger.error('Error Update Image details  ' + req.ip);
      res.status(500).send(e);
    }
  });


const getDateFormat = (date) => {
    date = new Date(date);
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}
