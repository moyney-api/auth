import { Router } from 'express';
import { Changelog } from './changelog';
import { Help } from './help';
import { Login } from './login';
import { Logout } from './logout/logout';
import { Status } from './status';
import { TempLoginPage } from './temp-login-page';

function session() {
    const router = Router();

    Help('/', router);
    Changelog('/changelog', router);
    Status('/status', router);
    Login('/login', router);
    Logout('/logout', router);
    TempLoginPage('/login-page', router);

    return router;
}

export { session };
