import * as express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { session } from './session';

const moyAuth = express();
moyAuth.use(express.json());
moyAuth.use(session());

export const auth = onRequest(moyAuth);
