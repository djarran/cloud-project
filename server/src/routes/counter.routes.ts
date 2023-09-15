import { Request, Response, Router } from "express";
import { getCurrentCounter } from "../helpers/database.helper.ts";
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

export { router as counterRouter }