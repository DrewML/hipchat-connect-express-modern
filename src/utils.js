export function multiUse(app, middleware = []) {
    return middleware.map(fn => {
        if (Array.isArray(fn)) app.use(...fn);
        else app.use(fn);
    });
}
