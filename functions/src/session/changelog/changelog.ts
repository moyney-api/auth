import { Request, Response, Router } from 'express';
import { changelog } from '../../changelog';
import { fourHundredAndFour } from '../helpers';

export function Changelog(route: string, router: Router) {
    router.get(route, (_: Request, res: Response) => {
        const changes = changelog.slice(0, 10);
        res.json(changes);
    });
    router.post(route, fourHundredAndFour);
    router.patch(route, fourHundredAndFour);
    router.delete(route, fourHundredAndFour);
}
