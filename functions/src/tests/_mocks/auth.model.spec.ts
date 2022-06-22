import { of } from 'rxjs';
import { Auth } from 'src/session/models';
import { CORRECT_UID } from './admin-auth.spec';

export function spyOnCheckStatus() {
    jest.spyOn(Auth.prototype, 'checkStatus').mockImplementation(() => {
        return of({ uid: CORRECT_UID });
    });
}
