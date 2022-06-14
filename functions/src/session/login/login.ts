import { Router, Request, Response } from 'express';
import { SessionController } from '../controller';
import { fourHundredAndFour, getTokenAndRemoteAddress } from '../helpers';

export function Login(route: string, router: Router): void {
    function login(req: Request, res: Response) {
        const { token, remoteAddress } = getTokenAndRemoteAddress(req);

        SessionController.login({ token, remoteAddress })
            .subscribe({
                next: token => res.status(200).json({ token }),
                error: err => res.status(401).json(err),
            });
    }

    router.get(route, fourHundredAndFour);
    router.post(route, login);
    router.patch(route, fourHundredAndFour);
    router.delete(route, fourHundredAndFour);
}
