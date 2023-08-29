import { Request, Response, Router } from "express";
import { getYouTubeVideoData } from "../helpers/youtube.helper.ts";
import { getRedditPostData } from "../helpers/reddit.helper.ts";


const router = Router();

router.post('/', async (req: Request, res: Response) => {
    // console.log(req.body)
    const { url } = req.body;

    const type = await getMetadata(url)

    console.log(type)
    return
})


type YouTubeResponseObject = ReturnType<typeof getYouTubeVideoData>

const getMetadata = async (url: string) => {

    if (url.includes('youtube')) {
        const youtubeData = await getYouTubeVideoData(url)
        return {
            type: "youtube",
            data: youtubeData
        }
    }

    if (url.includes('reddit')) {
        const redditData = await getRedditPostData(url)
        return {
            type: "reddit",
            data: redditData
        }
    }

    return false
}


export { router as addRouter }