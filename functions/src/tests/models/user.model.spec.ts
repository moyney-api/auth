import { lastValueFrom } from 'rxjs';
import { User } from '~/session/models';
import { AdminAuthMock, CORRECT_UID, MOCK_USER, NON_EXISTENT_UID } from '../_mocks/admin-auth.spec';

describe('User Model', () => {
    const adminAuthMock = new AdminAuthMock();
    const spyOnGetUser = adminAuthMock.spyOnGetUser();
    const spyOnCreateUser = adminAuthMock.spyOnCreateUser();
    const spyOnDeleteUser = adminAuthMock.spyOnDeleteUser();

    beforeEach(() => {
        jest.clearAllMocks();
        adminAuthMock.reset();
    });

    describe('get', () => {
        it('should return the mock user', async () => {
            const userModel = new User(CORRECT_UID);
            const user = await lastValueFrom(userModel.get());

            expect(user).toEqual(adminAuthMock.mockUser);
            expect(spyOnGetUser).toHaveBeenCalledTimes(1);
        });

        it('should error if uid is wrong', () => {
            const userModel = new User(NON_EXISTENT_UID);
            const user = lastValueFrom(userModel.get());

            expect(user).rejects.toThrowError('User not found');
            expect(spyOnGetUser).toHaveBeenCalledTimes(1);
        });
    });

    describe('create', () => {
        it('should create same user if uid is not changed', async () => {
            const userModel = new User(CORRECT_UID);
            const user = MOCK_USER;
            await lastValueFrom(userModel.create({ ...user }));

            expect(adminAuthMock.mockUser?.uid).toBe(user?.uid);
            expect(spyOnCreateUser).toHaveBeenCalledTimes(1);
        });

        it('should create the same user with a different uid', async () => {
            const userModel = new User(CORRECT_UID);
            const user = MOCK_USER;
            await lastValueFrom(userModel.create({ ...user, uid: NON_EXISTENT_UID }));

            expect(adminAuthMock.mockUser?.uid).toBe(NON_EXISTENT_UID);
            expect(spyOnCreateUser).toHaveBeenCalledTimes(1);
        });

        it('should create new user even without params', async () => {
            const userModel = new User('test');
            await lastValueFrom(userModel.create({}));

            expect(adminAuthMock.mockUser).toEqual(MOCK_USER);
            expect(spyOnCreateUser).toHaveBeenCalledTimes(1);
        });
    });

    describe('delete', () => {
        it('should delete the user', async () => {
            const userModel = new User(adminAuthMock.mockUser!.uid);
            await lastValueFrom(userModel.delete(CORRECT_UID));

            expect(adminAuthMock.mockUser).toBeUndefined();
            expect(spyOnDeleteUser).toHaveBeenCalledTimes(1);
        });

        it('should not delete the user if it doesnt exist', () => {
            const userModel = new User(adminAuthMock.mockUser!.uid);
            const expectedError = lastValueFrom(userModel.delete(NON_EXISTENT_UID));

            expect(expectedError).rejects.toThrowError('User does not exist');
            expect(spyOnDeleteUser).toHaveBeenCalledTimes(1);
        });
    });

    describe('isUsernameTaken', () => {
        it('should return false when username exists', async () => {
            const userModel = new User(CORRECT_UID);
            const result = lastValueFrom(userModel.isUsernameFree(CORRECT_UID));

            expect(result).resolves.toBe(false);
            expect(spyOnGetUser).toHaveBeenCalledTimes(1);
        });

        it('should return true when username is not used', async () => {
            const userModel = new User(NON_EXISTENT_UID);
            const result = await lastValueFrom(userModel.isUsernameFree(NON_EXISTENT_UID));

            expect(result).toBe(true);
            expect(spyOnGetUser).toHaveBeenCalledTimes(1);
        });
    });
});
