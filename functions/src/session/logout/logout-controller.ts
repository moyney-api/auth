import { concatMap, from, Observable } from 'rxjs';
import { admin } from '../../firebase';
import { verifyToken } from '../helpers';

export const LogoutController = {
    logout({ token }: { token: string }): Observable<void> {
        return verifyToken(token).pipe(
            concatMap(({ uid }) => from(admin.auth().revokeRefreshTokens(uid))),
        );
    }
};
