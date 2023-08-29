import { Request, Response, Router } from "express";
import { getAccessToken } from "../helpers/reddit.helper.ts";


const router = Router();

router.get('/getToken', async (req: Request, res: Response) => {
    const wow = await getAccessToken()
    console.log(wow)
})

export { router as redditRouter }