import { Request, Response } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { from, Observable } from 'rxjs';
import { admin } from '../firebase';

function fourHundredAndFour(req: Request, res: Response) {
    res.status(404).send(`route: ${req.path} has no implemented method: ${req.method}`);
}

function getTokenAndRemoteAddress(req: Request): { token: string; remoteAddress: string } {
    const token = req.body?.token ||
        (req.headers.authorization?.split('Bearer ') || [])[1];

    return { token, remoteAddress: req.socket.remoteAddress! };
}

function verifyToken(token: string, checkRevoked = false): Observable<DecodedIdToken> {
    return from(admin.auth().verifyIdToken(token, checkRevoked));
}

export { fourHundredAndFour, getTokenAndRemoteAddress, verifyToken };
