import { firstValueFrom } from 'rxjs';
import { adminAuthMock } from './_mocks/admin-auth.spec';
import { verifyToken } from '../session/helpers';

describe('Helpers', () => {
    const { mockToken, mockUid, mockRemoteAddress, spyOnVerifyIdToken } = adminAuthMock;

    const verifySpy = spyOnVerifyIdToken();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return correct verification if correct token', async () => {
        const verify = firstValueFrom(verifyToken(mockToken));

        expect(verifySpy).toHaveBeenCalled();
        expect(verify).resolves.toEqual({ uid: mockUid, remoteAddress: mockRemoteAddress });
    });

    it('should fail with wrong token', async () => {
        const verify = firstValueFrom(verifyToken('wrong-token'));

        expect(verifySpy).toHaveBeenCalled();
        expect(verify).rejects.toThrowError('Unauthorized');
    });
});
