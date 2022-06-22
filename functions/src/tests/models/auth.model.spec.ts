import { firstValueFrom } from 'rxjs';
import { Auth } from '../../session/models';
import { ACTIVE_TOKEN, AdminAuthMock, CORRECT_UID, REVOKED_TOKEN, WRONG_REMOTE_ADDRESS, WRONG_TOKEN } from '../_mocks/admin-auth.spec';

describe('Auth Model', () => {
    const adminAuthMock = new AdminAuthMock();
    const spyOnToken = adminAuthMock.spyOnVerifyToken();
    const spyOnSetClaims = adminAuthMock.spyOnSetCustomUserClaims();
    const spyOnRevokeToken = adminAuthMock.spyRevokeRefreshTokens();

    beforeEach(() => {
        jest.clearAllMocks();
        adminAuthMock.reset();
    });

    describe('setTokens', () => {
        const { token, remoteAddress } = adminAuthMock;

        it('should set tokens correctly for active tokens', async () => {
            const auth = new Auth({ token, remoteAddress });
            const result = await firstValueFrom(auth.setTokens());
            expect(result).toBe(ACTIVE_TOKEN);
            expect(spyOnToken).toHaveBeenCalledTimes(1);
            expect(spyOnSetClaims).toHaveBeenCalledTimes(1);
        });

        it('should still apply the claims, even when passing a different token', async () => {
            const auth = new Auth({ token: WRONG_TOKEN, remoteAddress });
            const result = await firstValueFrom(auth.setTokens());
            expect(result).toBe(WRONG_TOKEN);
            expect(spyOnToken).toHaveBeenCalledTimes(1);
            expect(spyOnSetClaims).toHaveBeenCalledTimes(1);
        });

        it('should error when revoked token is used', () => {
            const auth = new Auth({ token: REVOKED_TOKEN, remoteAddress})
            const expectFail = firstValueFrom(auth.setTokens());
            expect(expectFail).rejects.toThrowError('Unauthorized');
            expect(spyOnToken).toHaveBeenCalledTimes(1);
            expect(spyOnSetClaims).not.toHaveBeenCalled();
        });
    });

    describe('revokeTokens', () => {
        it('should invalidate token after usage', async () => {
            const auth = new Auth({ token: adminAuthMock.token, remoteAddress: adminAuthMock.remoteAddress });
            await firstValueFrom(auth.revokeTokens());
            expect(adminAuthMock.token).toBe(REVOKED_TOKEN);
            expect(spyOnToken).toHaveBeenCalledTimes(1);
            expect(spyOnRevokeToken).toHaveBeenCalledTimes(1);
        });
    });

    describe('checkStatus', () => {
        const { token, remoteAddress } = adminAuthMock;

        it('should return uid for active token', async () => {
            const auth = new Auth({ token, remoteAddress });
            const result = await firstValueFrom(auth.checkStatus());
            expect(result.uid).toBe(CORRECT_UID);
            expect(spyOnToken).toHaveBeenCalledTimes(1);
        });

        it('should 401 if active token comes from different address', () => {
            const auth = new Auth({ token, remoteAddress: WRONG_REMOTE_ADDRESS });
            const result = firstValueFrom(auth.checkStatus());
            expect(result).rejects.toThrowError('Unauthorized');
            expect(spyOnToken).toHaveBeenCalledTimes(1);
        });
    });
});
