import 'dotenv/config'
export async function getAccessToken() {
    const clientId = process.env.REDDIT_CLIENT_ID as string;
    const clientSecret = process.env.REDDIT_CLIENT_SECRET as string;
    const username = process.env.REDDIT_USERNAME as string;
    const password = process.env.REDDIT_PASSWORD as string;

    const tokenEndpoint: string = 'https://www.reddit.com/api/v1/access_token';
    const body: URLSearchParams = new URLSearchParams({
        grant_type: 'password',
        username,
        password
    });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
        },
        body: body.toString()
    };

    try {
        const response = await fetch(tokenEndpoint, options);
        if (!response.ok) {
            throw new Error('Failed to get access token');
        }
        const data: { access_token: string } = await response.json();
        const accessToken: string = data.access_token;
        return accessToken;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const processRedditPost = (redditPostData: any) => {
    let {
        title,
        selftext,
        subreddit,
        selftext_html,
        media,
        is_video,
        url_overridden_by_dest,
        permalink,
        is_gallery,
        post_hint,
        body,
        created,
    } = redditPostData;

    let post_type,
        returnObject: any = "";
    let post_url = redditPostData.url;

    // Check if post is a comment
    if (body) {
        title = redditPostData.link_title;
        post_type = "comment";
        post_url = redditPostData.link_permalink;

        returnObject = { title, post_type, body, subreddit, post_url };
    }

    // Check if post is a selftext
    if (selftext) {
        post_type = "text";

        returnObject = {
            title,
            post_type,
            selftext,
            subreddit,
            selftext_html,
            post_url,
        };
    }

    // Check if post links to an external source
    if (post_hint !== "image" && !selftext && !is_gallery) {
        post_type = "external";

        returnObject = {
            title,
            post_type,
            post_url,
            subreddit,
            externalLink: url_overridden_by_dest,
        };
    }

    // Check if post is an image
    if (post_hint === "image") {
        post_type = "image";
        const imageLink = url_overridden_by_dest;

        returnObject = { title, post_type, post_url, imageLink, subreddit };
    }

    // Check if post has multiple images
    let mediaArray = [];
    if (is_gallery) {
        post_type = "galleryImage";
        const mediaObject = redditPostData.media_metadata;
        // // console.log(mediaArray)
        // const newArray = mediaArray.map((data, index) => {
        //     return data.id
        // })
        // console.log(mediaArray.getOwnPropertyNames)
        mediaArray = Object.keys(mediaObject).map((key, index) => {
            return `https://i.redd.it/${key}.jpg`;
        });

        returnObject = { title, post_type, post_url, mediaArray, subreddit };
    }

    return { typeData: returnObject, postDate: created };
};

const processRedditUrl = (url: string) => {

    const partialString = "https://oauth.reddit.com/r/"

    const splitUrlString = url.split('/r/')

    const oauthString = `${partialString}${splitUrlString[1]}`

    return oauthString;

}

export async function getRedditPostData(url: string) {

    const queryUrl = processRedditUrl(url)
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.REDDIT_BEARER_TOKEN}`
        },
    };

    try {
        const response: any = await fetch(queryUrl, options);
        if (!response.ok) {
            throw new Error('Failed to get access token');
        }
        const data: any = await response.json();
        // console.log(data[0].data.children[0].data)
        // console.log(processRedditPost(data[0].data.children[0].data))
        const postRawData = data[0].data.children[0].data
        return processRedditPost(postRawData);
    } catch (error) {
        console.error(error);
        throw error;
    }
}