import { Router } from "express";
import { apiRouter } from "./search.routes.ts";

export const router: Router = Router();

const defaultRoutes = [
    {
        path: '/api',
        route: apiRouter
    },

]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
})