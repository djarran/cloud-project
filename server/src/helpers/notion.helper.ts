import { AppendBlockChildrenParameters, BlockObjectRequest, CreatePageResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { UserInput } from "../routes/add.routes.ts";
import { notion } from "../utilities/notionClient.ts";
import { getYouTubeVideoData } from "./youtube.helper.ts";
import { RedditObject } from "../types/redditType.ts";
import 'dotenv/config'
import { text } from "express";


const getChildren = (redditObject: RedditObject): BlockObjectRequest[] => {
    const { typeData, postType } = redditObject;



    if (postType === 'image') {
        return [
            {
                object: "block",
                toggle: {
                    rich_text: [
                        {
                            text: {
                                content: 'Image'
                            }
                        }
                    ],
                    children: [
                        {
                            object: "block",
                            image: {
                                external: {
                                    url: typeData.imageLink
                                }
                            }
                        }
                    ]
                }
            }
        ]
    }

    if (postType === 'galleryImage') {
        return [
            {
                object: "block",
                toggle: {
                    rich_text: [
                        {
                            text: {
                                content: 'Image'
                            }
                        }
                    ],
                    children: [
                        {
                            object: "block",
                            image: {
                                external: {
                                    url: typeData.mediaArray[0]
                                }
                            }
                        }
                    ]
                }
            }
        ]
    }

    return [
        {
            object: "block",
            toggle: {
                rich_text: [
                    {
                        text: {
                            content: 'Post text'
                        }
                    }
                ],
                children: [
                    {
                        object: "block",
                        paragraph: {
                            rich_text: [
                                {
                                    text: {
                                        content: postType === 'text' ? typeData.selftext : ''
                                    }
                                }
                            ]
                        }
                    },
                ]
            }
        }
    ]
}

export const updateYouTubeDatabase = async (youtubeObject: Awaited<ReturnType<typeof getYouTubeVideoData>>, userInput: UserInput) => {

    try {

        if (!youtubeObject) {
            throw new Error("YouTube data object missing or empty")
        }

        const { title, categoryName, channelName, image, url } = youtubeObject;
        const { status, reason } = userInput

        const notionCreatePageResponse = await notion.pages.create({
            parent: {
                database_id: process.env.NOTION_YOUTUBE_DB as string
            },
            cover: {
                type: "external",
                external: {
                    url: image
                }
            },
            properties: {
                "Title": {
                    title: [
                        {
                            text: {
                                content: title
                            }
                        }
                    ]
                },
                "Reason": {
                    rich_text: [
                        {
                            text: {
                                content: reason
                            }
                        }
                    ]
                },
                "Category": {
                    rich_text: [
                        {
                            text: {
                                content: categoryName ?? ''
                            }
                        }
                    ]
                },
                "Channel": {
                    rich_text: [
                        {
                            text: {
                                content: channelName
                            }
                        }
                    ]
                },
                "Link": {
                    rich_text: [
                        {
                            text: {
                                content: url
                            }
                        }
                    ]
                },
                "Date": {
                    date: {
                        "start": `${new Date().toISOString()}`,
                        "time_zone": "Australia/Brisbane"
                    }
                },
                "Watch Status": {
                    select: {
                        name: capitalizeFirstLetter(status)
                    }
                }
            },
            children: [
                {
                    object: "block",
                    video: {
                        external: {
                            url: url
                        }
                    }
                }
            ]
        }) as PageObjectResponse
        console.log(notionCreatePageResponse)
        if (notionCreatePageResponse.object === 'page') {
            return {
                status: 'success',
                url: notionCreatePageResponse.url
            }
        }

        throw new Error("Unable to create Notion page")
    }


    catch (err) {
        return {
            status: 'error'
        }
    }
}

export const updateRedditDatabase = async (redditObject: RedditObject, userInput: UserInput) => {
    try {
        if (!redditObject) {
            throw new Error("Reddit data object missing or empty")
        }

        const { typeData, postType } = redditObject;
        const childrenObject = getChildren(redditObject)
        const { status, reason } = userInput

        // if (postType === 'text')

        const notionCreatePageResponse = await notion.pages.create({
            parent: {
                database_id: process.env.NOTION_REDDIT_DB as string
            },
            properties: {
                "Title": {
                    title: [
                        {
                            text: {
                                content: typeData.title
                            }
                        }
                    ]
                },
                "Reason": {
                    rich_text: [
                        {
                            text: {
                                content: reason
                            }
                        }
                    ]
                },
                "Subreddit": {
                    rich_text: [
                        {
                            text: {
                                content: typeData.subreddit ?? ''
                            }
                        }
                    ]
                },
                "Link": {
                    rich_text: [
                        {
                            text: {
                                content: typeData.post_url
                            }
                        }
                    ]
                },
                "Date": {
                    date: {
                        "start": `${new Date().toISOString()}`,
                        "time_zone": "Australia/Brisbane"
                    }
                },
                "Read Status": {
                    select: {
                        name: capitalizeFirstLetter(status) || ''
                    }
                },
                "Post Type": {
                    select: {
                        name: postType === 'galleryImage' ? 'Image' : capitalizeFirstLetter(postType)
                    }
                }
            },
            children: childrenObject

        }) as PageObjectResponse

        if (notionCreatePageResponse.object === 'page') {
            return {
                status: 'success',
                url: notionCreatePageResponse.url
            }
        }
        console.log(notionCreatePageResponse)
        throw new Error("Unable to create Notion page")
    }
    catch (err) {
        return {
            status: 'error'
        }
    }
}

export const getRandomYouTubeVideo = async () => {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_YOUTUBE_DB as string,
    })


    const randomNumber = getRandomNumber(0, response.results.length - 1)
    console.log(randomNumber)

    const exampleResult = response.results[randomNumber] as any

    const url = exampleResult.properties.Link.rich_text[0].text.content
    console.log(url)

    return url

}

function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// function getRandomNumber(min: number, max: number): number {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

function getRandomNumber(min: number, max: number): number {
    const length = max - min + 1;
    const numbers = Array.from({ length }, (_, i) => i + min);

    for (let i = length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return numbers[0];
}



