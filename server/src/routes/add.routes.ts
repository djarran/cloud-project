import { Request, Response, Router } from "express";
import { getYouTubeVideoData } from "../helpers/youtube.helper.ts";
import { getRedditPostData } from "../helpers/reddit.helper.ts";
import { updateRedditDatabase, updateYouTubeDatabase } from "../helpers/notion.helper.ts";
import { RedditObject } from "../types/redditType.ts";


const router = Router();

router.get('/metadata', async (req: Request, res: Response) => {
    // console.log(req.body)
    const { url } = req.query;
    console.log(url)
    try {

        const type = await getMetadata(url as string)
        res.status(200).json(type)
    }
    catch (err) {
        res.status(400).send(err)
    }

})


export type UserInput = {
    status: "watched" | "unwatched" | "read" | "unread",
    reason: string
}

type AwaitedYouTubeData = Awaited<YouTubeResponseObject>;

type AddToNotion = { type: 'youtube', data: AwaitedYouTubeData, userInput: UserInput } | { type: 'reddit', data: RedditObject, userInput: UserInput }

router.post('/notion', async (req: Request, res: Response) => {
    // console.log(req.body)
    const { type, data, userInput }: AddToNotion = req.body;
    console.log({ type, data, userInput })

    if (!type || !data) {
        return res.status(400).send("Missing request object")
    }

    if (type === 'youtube') {
        const { status, url } = await updateYouTubeDatabase(data, userInput)

        if (status === 'success') {
            return res.status(200).send("Success")
        } else {
            return res.status(400).send("Error")
        }
    }

    if (type === 'reddit') {
        const { status, url } = await updateRedditDatabase(data, userInput)

        if (status === 'success') {
            return res.status(200).send("Success")
        } else {
            return res.status(400).send("Error")
        }
    }
})

export type YouTubeResponseObject = ReturnType<typeof getYouTubeVideoData>

const getMetadata = async (url: string) => {

    if (url.includes('youtube')) {
        try {

            const youtubeData = await getYouTubeVideoData(url)
            // throw new Error("Shit's fucked")
            return {
                type: "youtube",
                data: youtubeData
            }
        }
        catch {
            throw new Error("Error with YouTube API")
        }
    }

    if (url.includes('reddit')) {
        try {
            const redditData = await getRedditPostData(url)
            console.log(redditData)
            return {
                type: "reddit",
                data: redditData
            }
        }
        catch {
            throw new Error("Error with Reddit API")
        }
    }

    return false
}


export { router as addRouter }