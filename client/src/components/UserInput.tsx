import { ChangeEvent, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { YouTubeObject } from "./YouTube"
import { RedditObject } from "../helpers/redditType"
import { queryClient } from "../main"
import { DataResponseType } from "./Main"

type statusString = "watched" | "unwatched" | "read" | "unread" | ''
export type UserInput = {
    status: statusString,
    reason: string
}

export const UserInput = ({ response }: DataResponseType) => {

    const { data, type } = response
    const [selectState, setSelectState] = useState<statusString>('')

    const [text, setText] = useState('');

    const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectState(event.target.value as statusString)
    }

    type MutationType = { userInput: UserInput, type: "reddit" | "youtube", data: YouTubeObject | RedditObject }

    const { mutate, isSuccess } = useMutation({
        mutationFn: ({ userInput, type, data }: MutationType) => {
            const toastId = toast.loading("Creating Notion page...")
            return fetch('http://localhost:3001/add/notion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userInput, type, data }),
            }).then(response => {
                if (!response.ok) {
                    toast.error("Unable to add to Notion", {
                        id: toastId
                    })
                    throw Error
                } else {
                    const data = response.json().then(data => {
                        toast.success(() => (
                            <a href={data.url} target="_blank" className="text-lime-700">
                                Successfully added to Notion. Click on this notification to visit it
                            </a>
                        ), {
                            id: toastId,
                            duration: 10000
                        })
                    });
                    console.log(data, 'json')

                    queryClient.resetQueries({ queryKey: ['url'], exact: false })
                    return response.json()
                }
            })
        }
    })

    const handleSubmit = () => {
        const userInput: UserInput = {
            status: selectState,
            reason: text
        }


        mutate({
            userInput,
            type,
            data
        })
    }
    console.log(isSuccess)

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold pt-2 border-b pb-1">User Input</h1>
            <div className="flex flex-row gap-4 items-center">
                <div className="font-bold">{type === 'youtube' ? 'Watch' : 'Read'} Status:</div>
                <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5" value={selectState} onChange={handleOptionChange} placeholder="Select status...">
                    <option value="" disabled selected hidden>
                        Select status...
                    </option>
                    {type === 'youtube' && (
                        <>
                            <option value="watched">Watched</option>
                            <option value="unwatched">Unwatched</option>
                        </>
                    )}
                    {type === 'reddit' && (
                        <>
                            <option value="read">Read</option>
                            <option value="unread">Unread</option>
                        </>
                    )}
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <h1 className="font-bold">
                    Reason for Saving:
                </h1>
                <textarea className="resize-none border rounded-xl p-4 outline-none" value={text} onChange={handleTextChange}></textarea>
            </div>
            <div className="flex flex-row gap-4">
                <button className="p-3 bg-lime-500 text-white rounded-xl border" onClick={handleSubmit}>Add to Notion</button>
                <button className="p-3 bg-red-500 text-white rounded-xl border">Cancel</button>
            </div>
        </div>
    )
}