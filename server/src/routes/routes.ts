import { Router } from "express";
import { redditRouter } from "./reddit.routes.ts";
import { addRouter } from "./add.routes.ts";
import { counterRouter } from "./counter.routes.ts";

export const router: Router = Router();

const defaultRoutes = [
    {
        path: '/reddit',
        route: redditRouter
    },
    {
        path: '/add',
        route: addRouter
    },
    {
        path: '/counter',
        route: counterRouter
    },
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
})