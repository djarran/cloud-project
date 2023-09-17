import { Request, Response, Router } from "express";
import { getCurrentCounter, updateCounter } from "../helpers/database.helper.ts";
import { createMessage } from "../helpers/discord.helper.ts";
import { getRandomYouTubeVideo } from "../helpers/notion.helper.ts";


const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const currentCounter = await getCurrentCounter();
    // await createMessage('Hey');
    // await getRandomYouTubeVideo();

    console.log(currentCounter)
    res.json({
        counter: currentCounter
    })
})

router.post('/', async (req: Request, res: Response) => {
    const currentCount = updateCounter();
    res.json({
        message: 'hey'
    })
})

export { router as counterRouter }