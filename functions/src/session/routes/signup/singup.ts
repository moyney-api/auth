import { Router, Request, Response } from 'express';
import { SessionController } from 'src/session/controller/session.controller';
import { fourHundredAndFour } from '../helpers';

function signup(req: Request, res: Response) {
    const { newUsername } = req.body;

    new SessionController(req)
        .signup(newUsername)
        .subscribe({
            next: created => res.status(201).json({ created }),
            error: err => res.status(403).json(err),
        });
}

export function Signup(route: string, router: Router): void {
    router.get(route, fourHundredAndFour);
    router.post(route, signup);
    router.patch(route, fourHundredAndFour);
    router.delete(route, fourHundredAndFour);
}
