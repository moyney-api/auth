import {Router, Request, Response } from 'express';
import { fourHundredAndFour, getTokenAndRemoteAddress } from '../helpers';
import { LogoutController } from './logout-controller';

function logout(req: Request, res: Response) {
    const { token } = getTokenAndRemoteAddress(req);

    LogoutController.logout({ token })
        .subscribe({
            next: _ => res.status(200).send('Signed out'),
            error: err => res.status(403).json(err),
        });
}

export function Logout(route: string, router: Router): void {
    router.get(route, logout);
    router.post(route, fourHundredAndFour);
    router.patch(route, fourHundredAndFour);
    router.delete(route, fourHundredAndFour);
}
