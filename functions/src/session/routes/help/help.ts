import { Router } from 'express';
import { fourHundredAndFour } from '../helpers';

export const helpMessage = `
            ### Welcome to Moy Auth service! :) ###
            - status: to check current status of user.
            - login: to login the user, POST with firebase token.
            - logout: get out of the session.
        `;
export function Help(route: string, router: Router) {
    router.get(route, (_, res) => res.send(helpMessage));
    router.post(route, fourHundredAndFour);
    router.patch(route, fourHundredAndFour);
    router.delete(route, fourHundredAndFour);
}
