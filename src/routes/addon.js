import cors from 'cors';

export function register(app, addon) {

    app.get('/', function(req, res) {
        res.format({
            'text/html': () => res.redirect(addon.descriptor.links.homepage),
            'application/json': () => res.redirect('/atlassian-connect.json')
        });
    });

    app.get('/glance', cors(), addon.authenticate(), (req, res) => {
        let glancedata = {
            label: {
                type: 'html',
                value: 'My Sample Glance'
            }
        };
        res.send(glancedata);
    });

    app.get('/config', addon.authenticate(), (req, res) => {
        res.render('config', req.context);
    });

    addon.on('installed', (clientKey, clientInfo, req) => {
        // 1,2,3,4, we don't care about this no more!
    });

    addon.on('uninstalled', id => {
        addon.settings.client.keys(`${id}:*`, function(err, rep) {
            rep.forEach(function(k) {
                addon.logger.info('Removing key:', k);
                addon.settings.client.del(k);
            });
        });
    });

}
