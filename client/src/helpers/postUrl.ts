import { toast } from "react-hot-toast";

type MetadataQueryKeyType = ["url", string]

type MetadataQueryObject = {
    queryKey: MetadataQueryKeyType
}

export const getMetadata = async ({ queryKey }: MetadataQueryObject) => {
    const [_, url] = queryKey;
    const toastId = toast.loading("Requesting metadata...")
    const response = await fetch(`http://localhost:4000/add/metadata?url=${url}`)
    if (!response.ok) {
        toast.error("Unable to process request", {
            id: toastId,
            duration: 10000
        })
        throw Error;
    };
    toast.success("Success", {
        id: toastId,
        duration: 10000,
    })
    const data = await response.json();
    return data
}

// type CounterQueryKeyType = ["counter", string]

// type CounterQueryObject = {
//     queryKey: CounterQueryKeyType
// }

export const getCounter = async () => {

    const response = await fetch(`http://localhost:4000/counter`)
    console.log(response)
    const data = await response.json();

    return data
}