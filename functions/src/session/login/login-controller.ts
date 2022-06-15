import { concatMap, from, map, Observable } from 'rxjs';
import { admin } from '../../firebase';
import { verifyToken } from '../helpers';

export const LoginController = {
    login({ token, remoteAddress }: { token: string; remoteAddress: string }): Observable<string> {
        return verifyToken(token, true).pipe(
            concatMap(decodedToken =>
                from(admin.auth().setCustomUserClaims(decodedToken.uid, { remoteAddress }))
            ),
            map(_ => token),
        );
    }
};
