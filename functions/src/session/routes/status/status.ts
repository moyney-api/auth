import { Router, Request, Response } from 'express';
import { SessionController } from '~/session/controller/session.controller';
import { fourHundredAndFour } from '../helpers';

function getStatus(req: Request, res: Response) {
    new SessionController(req)
        .status()
        .subscribe({
            next: ({ uid }) => res.status(200).json({ uid }),
            error: err => res.status(401).json(err),
        });
}

export function Status(route: string, router: Router): void {
    router.get(route, getStatus);
    router.post(route, fourHundredAndFour);
    router.patch(route, fourHundredAndFour);
    router.delete(route, fourHundredAndFour);
}
