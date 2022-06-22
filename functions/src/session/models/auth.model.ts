import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { concatMap, from, map, Observable } from 'rxjs';
import { admin } from 'src/firebase';

export class Auth {
    private token: string;
    private remoteAddress: string;

    constructor({ token, remoteAddress }: { token: string; remoteAddress: string }) {
        this.token = token;
        this.remoteAddress = remoteAddress;
    }

    setTokens(): Observable<string> {
        return this.setClaims({ remoteAddress: this.remoteAddress });
    }

    revokeTokens(): Observable<void> {
        return this.verifyToken(false).pipe(
            concatMap(({ uid }) => from(admin.auth().revokeRefreshTokens(uid))),
        );
    }

    checkStatus(): Observable<{ uid: string }> {
        return this.verifyToken().pipe(
            map(decodedToken => {
                if (decodedToken.remoteAddress !== this.remoteAddress) {
                    throw Error('Unauthorized');
                }
                return decodedToken;
            }),
        );
    }

    private verifyToken(checkRevoked = true): Observable<DecodedIdToken> {
        return from(admin.auth().verifyIdToken(this.token, checkRevoked));
    }
    
    private setClaims(claims: { [claim: string]: string }): Observable<string> {
        return this.verifyToken(false).pipe(
            concatMap(decodedToken =>
                from(admin.auth().setCustomUserClaims(decodedToken.uid, claims)).pipe(
                    map(() => this.token),
                )
            ),
        )
    }
}
