import { Router, Request, Response } from 'express';
import { fourHundredAndFour, getTokenAndRemoteAddress } from '../helpers';
import { StatusController } from './status-controller';

function getStatus(req: Request, res: Response) {
    const { token, remoteAddress } = getTokenAndRemoteAddress(req);

    StatusController.status({ token, remoteAddress })
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
