import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { map, Observable } from 'rxjs';
import { verifyToken } from '../helpers';

export const StatusController = {
    status({ token, remoteAddress }: { token: string; remoteAddress: string }): Observable<DecodedIdToken> {
        return verifyToken(token, true).pipe(
            map(decodedToken => {
                if (decodedToken.remoteAddress !== remoteAddress) {
                    throw Error('Unauthorized');
                }
                return decodedToken;
            }),
        );
    }
}
