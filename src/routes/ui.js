import qs from 'querystring';
import cors from 'cors';

export function register(app, addon) {
    const auth = addon.authenticate.bind(addon);

    app.get('/ui/panel', cors(), auth(), (req, res) => {
        res.render('panel/main');
    });
}
