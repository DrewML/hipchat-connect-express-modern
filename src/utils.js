export function multiUse(app, middleware = []) {
    return middleware.forEach(fn => app.use(fn));
}
