import { Router, Request, Response } from 'express';
import { UserController } from '~/session/controller';
import { fourHundredAndFour } from '../helpers';

function isUsernameFree(req: Request, res: Response) {
  const { username } = req.body;

  new UserController('any')
      .isUsernameFree(username)
      .subscribe({
          next: (isFree) => res.status(200).json({ username, isFree }),
          error: err => res.status(401).json(err),
      });
}

export function IsUsernameFree(route: string, router: Router): void {
    router.get(route, fourHundredAndFour);
    router.post(route, isUsernameFree);
    router.patch(route, fourHundredAndFour);
    router.delete(route, fourHundredAndFour);
}
