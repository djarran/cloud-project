import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { getMetadata } from "../helpers/postUrl";
import toast from "react-hot-toast";
import { YouTube, YouTubeObject } from "./YouTube";
import { RedditObject } from "../helpers/redditType";
import { Reddit } from "./Reddit";
import { UserInput } from "./UserInput";
import Home from "./Home";

export const Main = ({ refetchCounter }: { refetchCounter: any }) => {

    const [url, setUrl] = useState("");

    const { data, refetch } = useQuery(['url', url], getMetadata, {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        enabled: false
    })

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
    };

    const handleSubmit = () => {
        if (url.includes('https://www.reddit.com') || url.includes('https://www.youtube.com')) {
            refetch()
            refetchCounter()
        } else {
            toast.error("Invalid URL")
        }
    };

    return (
        <>
            <div className="flex flex-col gap-4 w-full items-center mt-10">
                {!data && <Home url={url} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />}
                {data ? <DataResponse response={data} /> : ''}
            </div>
        </>
    );
}

export type DataResponseType = {
    response: {
        type: "youtube",
        data: YouTubeObject
    } | {
        type: "reddit",
        data: RedditObject
    }
}

export const DataResponse = ({ response }: DataResponseType) => {
    const { type } = response

    return (
        <div className="w-full px-32 flex flex-row gap-8">
            <div className="w-3/5">
                {type === 'reddit' && <Reddit response={response} />}
                {type === 'youtube' && <YouTube response={response} />}
            </div>
            <div className="w-2/5">
                <UserInput response={response} />
            </div>
        </div>
    )
}