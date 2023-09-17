import { toast } from "react-hot-toast";

type MetadataQueryKeyType = ["url", string]

type MetadataQueryObject = {
    queryKey: MetadataQueryKeyType
}

/**
 * Get the metadata from the content URL
 */
export const getMetadata = async ({ queryKey }: MetadataQueryObject) => {
    const [_, url] = queryKey;
    const toastId = toast.loading("Requesting metadata...")
    const getMetadataResponse = await fetch(`${import.meta.env.VITE_API_URL}/add/metadata?url=${url}`)

    if (!getMetadataResponse.ok) { // If error response
        toast.error("Unable to process request", {
            id: toastId,
        })
        throw Error; // Throw error to be handled via React Query.
    };

    toast.success("Success", {
        id: toastId,
    })

    const data = await getMetadataResponse.json();
    return data
}


/**
 * Update the counter and return the new value of the counter
 */
export const updateCounter = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/counter`, {
        method: 'POST',
    })

    const data = await response.json()
    return data
}