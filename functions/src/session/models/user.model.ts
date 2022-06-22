import { UserRecord } from 'firebase-functions/v1/auth';
import { catchError, concatMap, from, map, Observable, of } from 'rxjs';
import { admin } from 'src/firebase';

export class User {
    constructor(private uid: string) {}

    get(uid = this.uid): Observable<UserRecord> {
        return from(admin.auth().getUser(uid));
    }

    create(userData: Partial<UserRecord>, newUid?: string): Observable<boolean> {
        const { uid, displayName, email, phoneNumber, emailVerified, photoURL, disabled } = userData;

        return from(admin.auth().createUser({
            uid: newUid || uid,
            displayName,
            email,
            phoneNumber,
            emailVerified,
            photoURL,
            disabled,
        })).pipe(map(() => true));
    }

    delete(uid = this.uid): Observable<boolean> {
        return from(admin.auth().deleteUser(uid)).pipe(map(() => true));
    }

    isUsernameFree(uid: string): Observable<boolean> {
        return this.get(uid).pipe(
            catchError(noUser => of(null)),
            concatMap(foundUsername => {
                if (foundUsername) {
                    throw new Error('Username taken');
                }

                return of(true);
            }),
        );
    }
}
