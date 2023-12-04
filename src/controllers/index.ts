import express from 'express';
import files from './files';

export const routes = [
    {
        route: "/",
        router: files
    }
]

export function initRoutes(app: express.Application) {
    routes.forEach(({ route, router }) => {
        app.use(route, router);
    })
}

export default initRoutes;