import 'dotenv/config'
/**
 * Get access token using username and password to use in subsequent requests to
 * the Reddit API
 */
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

type RedditObject = TextType | CommentType | ExternalType | ImageType | GalleryImageType

type TextType = {
    title: string,
    post_type: string,
    selftext: string,
    subreddit: string,
    selftext_html: string,
    post_url: string,
}

type CommentType = {
    title: string,
    post_type: string,
    body: string,
    subreddit: string,
    post_url: string
}

type ExternalType = {
    title: string,
    post_type: string,
    post_url: string,
    subreddit: string,
    externalLink: string,
}

type ImageType = {
    title: string, post_type: string, post_url: string, imageLink: string, subreddit: string
}

type GalleryImageType = {
    title: string, post_type: string, post_url: string, mediaArray: string[], subreddit: string
}

/**
 * Process response from the Reddit API and return objects according to types
 */
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

    let post_type = ""
    let returnObject: RedditObject = {} as RedditObject;
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

    return { typeData: returnObject, postType: post_type };
};

/**
 * Transform standard Reddit URL to Oauth for requests to the API
 */
const processRedditUrl = (url: string) => {

    const partialString = "https://oauth.reddit.com/r/"

    const splitUrlString = url.split('/r/')

    const oauthString = `${partialString}${splitUrlString[1]}`

    return oauthString;

}

/**
 * Request post data from the Reddit API
 */
export async function getRedditPostData(url: string) {

    const accessToken = await getAccessToken()

    const queryUrl = processRedditUrl(url)
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    };

    try {
        const response: any = await fetch(queryUrl, options);
        if (!response.ok) {
            throw new Error('Failed to get Reddit post data');
        }
        const data: any = await response.json();
        const postRawData = data[0].data.children[0].data

        return processRedditPost(postRawData);
    } catch (error) {
        console.error(error);
        throw error;
    }
}