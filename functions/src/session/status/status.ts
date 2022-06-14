import { Router, Request, Response } from 'express';
import { SessionController } from '../controller';
import { fourHundredAndFour, getTokenAndRemoteAddress } from '../helpers';

export function Status(route: string, router: Router): void {
    function getStatus(req: Request, res: Response) {
        const { token, remoteAddress } = getTokenAndRemoteAddress(req);

        SessionController.status({ token, remoteAddress })
            .subscribe({
                next: ({ uid }) => res.status(200).json({ uid }),
                error: err => res.status(401).json(err),
            });
    }

    router.get(route, getStatus);
    router.post(route, fourHundredAndFour);
    router.patch(route, fourHundredAndFour);
    router.delete(route, fourHundredAndFour);
}
