import { getRandomRedditPost, getRandomYouTubeVideo } from "./notion.helper.ts"

/**
 * Create message in Discord Channel
 */
export const createMessage = async (message: string) => {

    const youtubeUrl = await getRandomYouTubeVideo()
    const redditUrl = await getRandomRedditPost()

    const endpoint = 'https://discord.com/api/channels/1146268615809708155/messages'

    const youtubeBody = {
        "content": youtubeUrl,
        "components": [
            {
                "type": 1,
                "components": [
                    {
                        "type": 2, // Button type: https://discord.com/developers/docs/interactions/message-components
                        "label": "Click me!",
                        "style": 5,
                        "url": youtubeUrl
                    }
                ]
            }
        ]
    }
    const redditBody = {
        "content": redditUrl,
        "components": [
            {
                "type": 1,
                "components": [
                    {
                        "type": 2,
                        "label": "Click me!",
                        "style": 5,
                        "url": redditUrl
                    }
                ]
            }
        ]
    }

    const youtubeRequestOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Bot MTE0NjI2NDY4MzE5MjUyNDg1MQ.GhqfVz.pqwW1wCNxHAd01vL3tLkFpY5LFe3s00HWXK_0s',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(youtubeBody)
    }

    const redditRequestOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Bot MTE0NjI2NDY4MzE5MjUyNDg1MQ.GhqfVz.pqwW1wCNxHAd01vL3tLkFpY5LFe3s00HWXK_0s',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(redditBody)
    }
    await fetch(endpoint, youtubeRequestOptions)
    await fetch(endpoint, redditRequestOptions)
}