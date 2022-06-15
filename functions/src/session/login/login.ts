import { Router, Request, Response } from 'express';
import { fourHundredAndFour, getTokenAndRemoteAddress } from '../helpers';
import { LoginController } from './login-controller';

function login(req: Request, res: Response) {
    const { token, remoteAddress } = getTokenAndRemoteAddress(req);

    LoginController.login({ token, remoteAddress })
        .subscribe({
            next: token => res.status(200).json({ token }),
            error: err => res.status(401).json(err),
        });
}

export function Login(route: string, router: Router): void {
    router.get(route, fourHundredAndFour);
    router.post(route, login);
    router.patch(route, fourHundredAndFour);
    router.delete(route, fourHundredAndFour);
}
