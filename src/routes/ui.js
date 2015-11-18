import qs from 'querystring';
import cors from 'cors';

export function register(app, addon) {
    const middleware = [cors(), addon.authenticate()];

    app.get('/ui/panel', ...middleware, (req, res) => {
        res.render('panel/main');
    });
}
