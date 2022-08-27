import { Request } from 'express';
import { concatMap, Observable } from 'rxjs';
import { Auth } from '../models';
import { UserController } from './user.controller';

export class SessionController {
    private auth: Auth;

    constructor(req: Request) {
        this.auth = new Auth(this.getTokenAndRemoteAddress(req));
    }

    signup(newUid: string): Observable<boolean> {
        return this.status().pipe(
            concatMap(({ uid }) => new UserController(uid).updateUid(newUid)),
        );
    }

    login(): Observable<string> {
        return this.auth.setTokens();
    }

    logout(): Observable<void> {
        return this.auth.revokeTokens();
    }

    status(): Observable<{ uid: string }> {
        return this.auth.checkStatus();
    }

    private getTokenAndRemoteAddress(req: Request): { token: string; remoteAddress: string } {
        const token = req.body?.token ||
            (req.headers.authorization?.split('Bearer ') || [])[1];

        return { token, remoteAddress: req.socket.remoteAddress || '' };
    }
}
