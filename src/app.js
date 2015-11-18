import os from 'os';
import ac from 'atlassian-connect-express';
import hbs from 'express-hbs';
import path from 'path';
import expiry from 'static-expiry';
import morgan from 'morgan';
import express from 'express';
import acHipchat from 'atlassian-connect-express-hipchat';
import requireDir from 'require-dir';
import bodyParser from 'body-parser';
import addonEvents from './addon-events';
import compression from 'compression';
import errorHandler from 'errorhandler';

const redisAddonName = 'atlassian-connect-express-redis';
try {
    ac.store.register('redis', require(redisAddonName));
} catch(e) {
    console.warn([
        `Optional dep '${redisAddonName}' not found.`,
        `You must configure an alternative store in 'config.js'.`
    ].join(' '));
}

// Setup Application
const app = express();
const addon = ac(app);
const hipchat = acHipchat(addon, app);

// Listen/respond to HipChat addon events
addonEvents(addon);

// Register Views
const viewsDir = path.join(__dirname, '../views');

app.engine('hbs', hbs.express4({
    partialsDir: path.join(__dirname, '../views'),
    defaultLayout: path.join(__dirname, '../views/base.hbs')
}));
app.set('view engine', 'hbs');
app.set('views', viewsDir);
hbs.registerHelper('furl', url => app.locals.furl(url));

// Register 3rd party middleware
const devEnv = app.get('env') === 'development';
if (devEnv) app.use(errorHandler());

app.use(morgan(devEnv ? 'dev' : 'common'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(addon.middleware());

// Custom middleware
const middleware = requireDir('./middleware');
Object.keys(middleware).forEach(key => app.use(middleware[key].default));

const staticDir = path.join(__dirname, '../public');

if (!process.env.PWD) process.env.PWD = process.cwd(); // Fix expiry on Windows
app.use(expiry(app, {
    dir: staticDir,
    debug: devEnv
}));
app.use(express.static(staticDir));

// Routing
const routes = requireDir('./routes');
Object.keys(routes).forEach(key => routes[key].register(app, addon));

const server = app.listen(addon.config.port(), () => {
    const port = server.address().port;
    const uri = addon.config.localBaseUrl() || `http://${os.hostname()}:${port}`
    console.log(`Addon server running at: ${uri}`.green);
});
