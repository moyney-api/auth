import * as express from 'express';
import { onRequest } from 'firebase-functions/v1/https';

const moyAuth = express();

moyAuth.get('/status', (request, response, next)=>{
  if (request.headers?.authorization?.startsWith('Bearer ')) {
    // const token = request.headers?.authorization.split(' ')[1];
    // check token validity
    // next();
    return response.json({ message: 'hola mundo' });
  }

  return response.status(403).send('You aren\'t logged in!');
});

export const auth = onRequest(moyAuth);
