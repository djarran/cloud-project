import { getRandomYouTubeVideo } from "./notion.helper.ts"

export const createMessage = async (message: string) => {

    const youtubeUrl = await getRandomYouTubeVideo()

    const endpoint = 'https://discord.com/api/channels/1146268615809708155/messages'

    const body = {
        "content": youtubeUrl,
        "components": [
            {
                "type": 1,
                "components": [
                    {
                        "type": 2,
                        "label": "Click me!",
                        "style": 5,
                        "url": youtubeUrl
                    }
                ]

            }
        ]
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Bot MTE0NjI2NDY4MzE5MjUyNDg1MQ.GhqfVz.pqwW1wCNxHAd01vL3tLkFpY5LFe3s00HWXK_0s',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }

    const response = await fetch(endpoint, requestOptions)
    console.log(await response.json())
}