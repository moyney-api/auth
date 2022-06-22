import { lastValueFrom } from 'rxjs';
import { UserController } from 'src/session/controller';
import { AdminAuthMock, CORRECT_UID } from '../_mocks/admin-auth.spec';

describe('User Controller', () => {
    const adminAuthMock = new AdminAuthMock();
    const spyOnUserCreate = adminAuthMock.spyOnCreateUser();
    const spyOnUserDelete = adminAuthMock.spyOnDeleteUser();
    const spyOnUserGet = adminAuthMock.spyOnGetUser();

    describe('update uid', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            adminAuthMock.reset();
        });

        it('should call delete and create on uid change', async () => {
            const userController = new UserController(CORRECT_UID);
            const result = lastValueFrom(userController.updateUid('another-uid'));

            await expect(result).resolves.toBe(true);
            expect(spyOnUserGet).toHaveBeenCalledTimes(2);
            expect(spyOnUserGet.mock.calls[0][0]).toBe('another-uid');
            expect(spyOnUserGet.mock.calls[1][0]).toBe(CORRECT_UID);
            expect(spyOnUserCreate).toHaveBeenCalledTimes(1);
            expect(spyOnUserDelete).toHaveBeenCalledTimes(1);
        });

        it('should error on existing uid', async () => {
            const userController = new UserController('some-uid');
            const expectedError = lastValueFrom(userController.updateUid(CORRECT_UID));
            
            await expect(expectedError).rejects.toThrowError('Username taken');
            expect(spyOnUserGet).toHaveBeenCalledTimes(1);
            expect(spyOnUserCreate).not.toHaveBeenCalled();
            expect(spyOnUserDelete).not.toHaveBeenCalled();
        });
    });
});
