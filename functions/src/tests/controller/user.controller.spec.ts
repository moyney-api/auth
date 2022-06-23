import { lastValueFrom } from 'rxjs';
import { UserController } from '~/session/controller';
import { AdminAuthMock, CORRECT_UID, NON_EXISTENT_UID } from '../_mocks/admin-auth.spec';

describe('User Controller', () => {
    const adminAuthMock = new AdminAuthMock();
    const spyOnUserCreate = adminAuthMock.spyOnCreateUser();
    const spyOnUserDelete = adminAuthMock.spyOnDeleteUser();
    const spyOnUserGet = adminAuthMock.spyOnGetUser();

    beforeEach(() => {
        jest.clearAllMocks();
        adminAuthMock.reset();
    });

    describe('update uid', () => {

        it('should call delete and create on uid change', async () => {
            const userController = new UserController(CORRECT_UID);
            const result = lastValueFrom(userController.updateUid(NON_EXISTENT_UID));

            await expect(result).resolves.toBe(true);
            expect(spyOnUserGet).toHaveBeenCalledTimes(1);
            expect(spyOnUserGet.mock.calls[0][0]).toBe(CORRECT_UID);
            expect(spyOnUserCreate).toHaveBeenCalledTimes(1);
            expect(spyOnUserDelete).toHaveBeenCalledTimes(1);
        });

        it('should error on existing uid', async () => {
            const userController = new UserController('some-uid');
            const expectedError = lastValueFrom(userController.updateUid(CORRECT_UID));
            
            await expect(expectedError).rejects.toThrowError('Username taken');
            expect(spyOnUserCreate).toHaveBeenCalledTimes(1);
            expect(spyOnUserDelete).toHaveBeenCalledTimes(1);
        });
    });

    describe('is username free', () => {
        it('should return true for non-existing username', async () => {
            const userController = new UserController('any-uid');
            const result = lastValueFrom(userController.isUsernameFree(NON_EXISTENT_UID));
    
            await expect(result).resolves.toBe(true);
            expect(spyOnUserGet).toHaveBeenCalledTimes(1);
        });

        it('should return false if username exists', async () => {
            const userController = new UserController('any-uid');
            const result = lastValueFrom(userController.isUsernameFree(CORRECT_UID));

            await expect(result).resolves.toBe(false);
            expect(spyOnUserGet).toHaveBeenCalledTimes(1);
        });
    });
});
