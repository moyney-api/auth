import {Router, Request, Response } from 'express';
import * as path from 'path';
import { fourHundredAndFour } from '../helpers';

export function TempLoginPage(route: string, router: Router): void {
    const tempPage = (_: Request, res: Response) => {
        res.sendFile(path.join(__dirname, '../../../_temp/test-login.html'));
    }

    router.get(route, tempPage);
    router.post(route, fourHundredAndFour);
    router.patch(route, fourHundredAndFour);
    router.delete(route, fourHundredAndFour);
}
