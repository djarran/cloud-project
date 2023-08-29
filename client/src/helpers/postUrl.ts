
type QueryKeyType = ["url", string]

type QueryObject = {
    queryKey: QueryKeyType
}


export const getMetadata = async ({ queryKey }: QueryObject) => {
    const [_, url] = queryKey;
    const response = await fetch(`http://localhost:4000/add/metadata?url=${url}`)
    const data = await response.json();
    return data
}