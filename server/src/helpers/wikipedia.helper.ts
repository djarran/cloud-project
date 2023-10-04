import axios from "axios";

export const getWikipediaResult = async (query: string) => {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${query}`;
    const result = await axios.get(searchUrl).then(data => data.data)
    return result
}