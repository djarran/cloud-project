import { CreatePageResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { UserInput } from "../routes/add.routes.ts";
import { notion } from "../utilities/notionClient.ts";
import { getYouTubeVideoData } from "./youtube.helper.ts";
import { RedditObject } from "../types/redditType.ts";

export const updateYouTubeDatabase = async (youtubeObject: Awaited<ReturnType<typeof getYouTubeVideoData>>, userInput: UserInput) => {

    try {

        if (!youtubeObject) {
            throw new Error("YouTube data object missing or empty")
        }

        const { title, categoryName, channelName, image, url } = youtubeObject;
        const { status, reason } = userInput

        const notionCreatePageResponse = await notion.pages.create({
            parent: {
                database_id: "0e6182e1-5116-445a-bcf0-a066ae1de1a8"
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
        const { status, reason } = userInput

        const notionCreatePageResponse = await notion.pages.create({
            parent: {
                database_id: "14b70f9d-2791-488e-9332-e4c69f4ba99e"
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
                }
            },
            // children: [
            //     {
            //         object: "block",
            //         video: {
            //             external: {
            //                 url: url
            //             }
            //         }
            //     }
            // ]
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

function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


