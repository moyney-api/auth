import {Router, Request, Response } from 'express';
import { SessionController } from '../controller';
import { fourHundredAndFour, getTokenAndRemoteAddress } from '../helpers';

export function Logout(route: string, router: Router): void {
    function logout(req: Request, res: Response) {
        const { token } = getTokenAndRemoteAddress(req);

        SessionController.logout({ token })
            .subscribe({
                next: _ => res.status(200).send('Signed out'),
                error: err => res.status(403).json(err),
            })
    }

    router.get(route, logout);
    router.post(route, fourHundredAndFour);
    router.patch(route, fourHundredAndFour);
    router.delete(route, fourHundredAndFour);
}
