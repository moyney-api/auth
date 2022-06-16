import { firstValueFrom } from 'rxjs';
import { helpers } from '../mocks/admin-auth.spec';
import { verifyToken } from './helpers';

describe('Helpers', () => {
    const { mockToken, mockUid, spyOnVerifyIdToken } = helpers;

    const verifySpy = spyOnVerifyIdToken();

    beforeEach(() => {
        verifySpy.mockClear();
    });

    it('should return correct verification if correct token', async () => {
        const verify = firstValueFrom(verifyToken(mockToken));

        expect(verifySpy).toHaveBeenCalled();
        expect(verify).resolves.toEqual({ uid: mockUid });
    });

    it('should fail with wrong token', async () => {
        const verify = firstValueFrom(verifyToken('wrong-token'));

        expect(verifySpy).toHaveBeenCalled();
        expect(verify).rejects.toThrowError('Unauthorized');
    });
});
