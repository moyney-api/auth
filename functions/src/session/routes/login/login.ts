import { Router, Request, Response } from 'express';
import { SessionController } from '~/session/controller/session.controller';
import { fourHundredAndFour } from '../helpers';

function login(req: Request, res: Response) {
    new SessionController(req)
        .login()
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
