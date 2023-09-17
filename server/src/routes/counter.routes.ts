import { Request, Response, Router } from "express";
import { getCurrentCounter, updateCounter } from "../helpers/database.helper.ts";
import { createMessage } from "../helpers/discord.helper.ts";
import { getRandomYouTubeVideo } from "../helpers/notion.helper.ts";


const router = Router();

/**
 * Get current counter
 */
router.get('/', async (req: Request, res: Response) => {
    const currentCounter = await getCurrentCounter();
    // await createMessage('Hey');
    // await getRandomYouTubeVideo();

    console.log(currentCounter)
    res.json({
        counter: currentCounter
    })
})

/**
 * Update counter
 */
router.post('/', async (req: Request, res: Response) => {
    const currentCount = await updateCounter();
    return res.status(200).json({
        currentCount: currentCount
    })
})

export { router as counterRouter }