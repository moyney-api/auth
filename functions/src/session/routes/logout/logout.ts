import {Router, Request, Response } from 'express';
import { SessionController } from '~/session/controller/session.controller';
import { fourHundredAndFour } from '../helpers';

function logout(req: Request, res: Response) {
    new SessionController(req)
        .logout()
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
