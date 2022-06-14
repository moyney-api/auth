import { Request, Response } from 'express';

function fourHundredAndFour(req: Request, res: Response) {
    req.method, req.path
    res.status(404).send(`route: ${req.path} has no implemented method: ${req.method}`);
}

function getTokenAndRemoteAddress(req: Request): { token: string; remoteAddress: string } {
    const token = req.body?.token ||
        (req.headers.authorization?.split('Bearer ') || [])[1];

    return { token, remoteAddress: req.socket.remoteAddress! };
}

export { fourHundredAndFour, getTokenAndRemoteAddress };
