import { admin } from '../firebase';
import { concatMap, from, map, Observable, of } from 'rxjs';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

class SessionController {
    status({ token, remoteAddress }: { token: string; remoteAddress: string }): Observable<DecodedIdToken> {
        return this.verifyToken(token, true).pipe(
            concatMap(decodedToken => {
                const ipAddress = decodedToken.remoteAddress;
                
                if (ipAddress === remoteAddress) {
                    return of(decodedToken);
                }

                throw Error('Unauthorized');
            }),
        );
    }

    login({ token, remoteAddress }: { token: string; remoteAddress: string }): Observable<string> {
        return this.verifyToken(token, true)
            .pipe(
                map(decodedToken => {
                    admin.auth().setCustomUserClaims(decodedToken.uid, { remoteAddress });
                    return token;
                }),
            );
    }

    logout({ token }: { token: string }): Observable<void> {
        return this.verifyToken(token).pipe(
            concatMap(({ uid }) => from(admin.auth().revokeRefreshTokens(uid))),
        );
    }

    private verifyToken(token: string, checkRevoked = false): Observable<DecodedIdToken> {
        return from(admin.auth().verifyIdToken(token, checkRevoked));
    }
}
const controller = new SessionController;
export { controller as SessionController };
