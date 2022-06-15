import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { concatMap, Observable, of } from 'rxjs';
import { verifyToken } from '../helpers';

export const StatusController = {
    status({ token, remoteAddress }: { token: string; remoteAddress: string }): Observable<DecodedIdToken> {
        return verifyToken(token, true).pipe(
            concatMap(decodedToken => {
                if (decodedToken.remoteAddress === remoteAddress) {
                    return of(decodedToken);
                }

                throw Error('Unauthorized');
            }),
        );
    }
}
