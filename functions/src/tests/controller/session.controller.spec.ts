import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { SessionController } from '~/session/controller';
import { ACTIVE_TOKEN, AdminAuthMock, CORRECT_REMOTE_ADDRESS, CORRECT_UID, NON_EXISTENT_UID } from '../_mocks/admin-auth.spec';

describe('Session Controller', () => {
    const adminAuthMock = new AdminAuthMock();
    const { spyOnVerifyToken, spyOnGetUser, spyOnCreateUser, spyOnDeleteUser, spyOnSetCustomUserClaims, spyRevokeRefreshTokens } = adminAuthMock;
    const request = {
        body: { token: ACTIVE_TOKEN },
        socket: { remoteAddress: CORRECT_REMOTE_ADDRESS },
    } as Request;
    const sessionController = new SessionController(request);
    const verifyTokenSpy = spyOnVerifyToken();
    const getUserSpy = spyOnGetUser();
    const createUserSpy = spyOnCreateUser();
    const deleteUserSpy = spyOnDeleteUser();
    const customClaimsSpy = spyOnSetCustomUserClaims();
    const revokeTokenSpy = spyRevokeRefreshTokens();

    beforeEach(() => {
        jest.clearAllMocks();
        adminAuthMock.reset();
    });

    describe('signup', () => {
        it('should call verifyToken, get, create and delete user from auth', async () => {
            const result = lastValueFrom(sessionController.signup(NON_EXISTENT_UID));

            await expect(result).resolves.toBe(true);
            expect(verifyTokenSpy).toHaveBeenCalledTimes(1);
            // check new uid and then get old uid user
            expect(getUserSpy).toHaveBeenCalledTimes(1);
            expect(createUserSpy).toHaveBeenCalledTimes(1);
            expect(deleteUserSpy).toHaveBeenCalledTimes(1);
        });

        it('should call verifyToken, get and error with used token', async () => {
            const result = lastValueFrom(sessionController.signup(CORRECT_UID));

            await expect(result).rejects.toThrowError('Username taken');
            expect(verifyTokenSpy).toHaveBeenCalledTimes(1);
            expect(getUserSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('login', () => {
        it('should call verifyToken and setCustomClaims', async () => {
            const result = lastValueFrom(sessionController.login());

            await expect(result).resolves.toBe(ACTIVE_TOKEN);
            expect(verifyTokenSpy).toHaveBeenCalledTimes(1);
            expect(customClaimsSpy).toHaveBeenCalledTimes(1);
        })
    });

    describe('logout', () => {
        it('should call verifyToken and revokeTokens', async () => {
            const result = lastValueFrom(sessionController.logout());

            await expect(result).resolves.toBeUndefined();
            expect(verifyTokenSpy).toHaveBeenCalledTimes(1);
            expect(revokeTokenSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('status', () => {
        it('should call verifyToken and return and object with uid', async () => {
            const result = lastValueFrom(sessionController.status());

            await expect(result).resolves.toEqual({ uid: CORRECT_UID, remoteAddress: CORRECT_REMOTE_ADDRESS });
            expect(verifyTokenSpy).toHaveBeenCalledTimes(1);
        });
    });
});
