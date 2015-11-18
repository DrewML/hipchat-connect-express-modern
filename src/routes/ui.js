import qs from 'querystring';
import cors from 'cors';
import {Router} from 'express';

export function register(app, addon) {
    const router = Router();
    [cors(), addon.authenticate()].forEach(fn => router.use(fn));

    router.get('/panel', (req, res) => {
        res.render('panel/main');
    });

    app.use('/ui', router);
}
