import { youtubeCategories } from "../test/category.ts";
import 'dotenv/config'

export const getYouTubeVideoData = async (url: string) => {
    const id: string | undefined = url.split("=").pop();

    if (!id) {
        return
    }

    const params: URLSearchParams = new URLSearchParams();
    params.append('part', 'snippet,contentDetails,statistics,topicDetails');
    params.append('id', id);
    params.append('key', process.env.YOUTUBE_KEY as string);


    const endpoint: string = `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Failed to fetch YouTube video: ${response.status} ${response.statusText}`);
        }
        const data: any = await response.json();
        // console.log(data.items[0].snippet)
        const { kind, snippet: metadata, statistics, topicDetails } = data.items[0];

        const { title, description, channelTitle, tags, categoryId, thumbnails, channelId } = metadata;
        console.log(categoryId)
        const imageUrl: string = thumbnails?.maxres?.url || thumbnails.standard.url;

        const categoryName = getYouTubeCategory(categoryId)
        return { id, title, categoryName, description, keywords: tags, embed_url: `https://www.youtube.com/embed/${id}?feature=oembed`, channelName: channelTitle, image: imageUrl, url };
    } catch (error) {
        console.error(error);
        // Handle the error appropriately
    }
};

const getYouTubeCategory = (id: string) => {
    const [damn] = youtubeCategories.items.filter(item => item.id === id)
    if (damn) {
        return damn.snippet.title
    }
}