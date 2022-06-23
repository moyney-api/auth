import { concatMap, map, Observable, retry, tap } from 'rxjs';
import { User } from '../models';

export class UserController {
    private user: User;

    constructor(private uid: string) {
        this.user = new User(this.uid);
    }

    updateUid(newUid: string): Observable<boolean> {
        return this.asignUidToUser(newUid).pipe(tap(() => this.uid = newUid));
    }

    isUsernameFree(username: string): Observable<boolean> {
        return this.user.isUsernameFree(username);
    }

    private asignUidToUser(newUid: string): Observable<boolean> {
        return this.user.get().pipe(
            concatMap(user => this.user.delete().pipe(map(() => user))),
            concatMap(user => this.user.create(user, newUid).pipe(retry(3))),
        );
    }
}
