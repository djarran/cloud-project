import { Request, Response, Router } from "express";
import { getAccessToken } from "../helpers/reddit.helper.ts";


const router = Router();

/**
 * Get Reddit access token. Used for testing purposes
 */
router.get('/getToken', async (req: Request, res: Response) => {
    const accessToken = await getAccessToken()
})

export { router as redditRouter }