import { Router } from 'express';
import { Changelog, Help, Login, Logout, Signup, Status, TempLoginPage } from './routes';

function session() {
    const router = Router();

    Help('/', router);
    Changelog('/changelog', router);
    Status('/status', router);
    Signup('/signup', router);
    Login('/login', router);
    Logout('/logout', router);
    TempLoginPage('/login-page', router);

    return router;
}

export { session };
