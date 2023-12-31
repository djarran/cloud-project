import { Request, Response, Router } from "express";
import { getYouTubeVideoData } from "../helpers/youtube.helper.ts";
import { getRedditPostData } from "../helpers/reddit.helper.ts";
import { updateRedditDatabase, updateYouTubeDatabase } from "../helpers/notion.helper.ts";
import { RedditObject } from "../types/redditType.ts";
import { createTableIfNotExists, updateCounter } from "../helpers/database.helper.ts";


const router = Router();

/**
 * Get content metadata and return to frontend
 */
router.get('/metadata', async (req: Request, res: Response) => {
    // TODO: PAGE COUNTER
    createTableIfNotExists();
    // const currentCount = updateCounter();
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

/**
 * Post content metadata, watch/read status and reason for saving to Notion
 */
router.post('/notion', async (req: Request, res: Response) => {
    // console.log(req.body)
    const { type, data, userInput }: AddToNotion = req.body;
    console.log({ type, data, userInput })

    if (!userInput.reason && !userInput.status) {
        return res.status(400).json({
            message: 'No status or reason for saving given'
        })
    }

    if (!userInput.reason) {
        return res.status(400).json({
            message: 'No reason for saving given'
        })
    }

    if (!userInput.status) {
        return res.status(400).json({
            message: 'No status given'
        })
    }

    if (!type || !data) {
        return res.status(400).send("Missing request object")
    }

    if (type === 'youtube') {
        const { status, url, code, message } = await updateYouTubeDatabase(data, userInput)

        if (status === 'success') {
            return res.status(200).json({
                url: url
            })
        } else {
            return res.status(400).json({
                status,
                message
            })
        }
    }

    if (type === 'reddit') {
        const { status, url, code, message } = await updateRedditDatabase(data, userInput)

        if (status === 'success') {
            return res.status(200).json({
                url: url
            })
        } else {
            return res.status(400).json({
                status,
                message
            })
        }
    }
})

export type YouTubeResponseObject = ReturnType<typeof getYouTubeVideoData>

/**
 * Get metadata based on url type
 */
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