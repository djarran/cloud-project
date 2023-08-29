import { ChangeEvent, useState } from "react";
import { getMetadata } from "./helpers/postUrl";
import { useMutation, useQuery } from "@tanstack/react-query";

function App() {

  const [inputValue, setInputValue] = useState("");

  const { data, refetch } = useQuery(['url', inputValue], getMetadata, {
    refetchOnWindowFocus: false,
    enabled: false
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    // Add your submit logic here
    console.log("Submitted!");
    console.log(inputValue);
    refetch()
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center mt-10">
      <div className="flex flex-row gap-4">
        <input
          type="text"
          className="border p-4 outline-none rounded-xl"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={handleSubmit} className="bg-green-200 rounded-xl border px-2 hover:bg-gray-50 transition-colors">Submit</button>
      </div>
      {data && <DataResponse response={data} />}
    </div>
  );
}

type YouTubeObject = {
  id: string;
  title: string;
  categoryName: string;
  description: string;
  keywords: string[];
  embed_url: string;
  channelName: string;
  image: string;
  url: string;
}

type DataResponseType = {
  response: {

    type: "reddit" | "youtube",
    data: YouTubeObject
  }
}

type statusString = "watched" | "unwatched" | "read" | "unread" | ''
export type UserInput = {
  status: statusString,
  reason: string
}

const DataResponse = ({ response }: DataResponseType) => {
  const { data, type } = response

  const [selectState, setSelectState] = useState<statusString>('')

  const [text, setText] = useState('');

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectState(event.target.value as statusString)
  }

  type MutationType = { userInput: UserInput, type: "reddit" | "youtube", data: YouTubeObject }

  const { mutate } = useMutation({
    mutationFn: ({ userInput, type, data }: MutationType) => {
      return fetch('http://localhost:4000/add/notion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput, type, data }),
      })
    }
  }
  )

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

  if (type === 'youtube') {
    return (
      <div className="flex flex-col">
        <img src={data.image} />
        <h1>{data.title}</h1>
        <div>{data.channelName}</div>
        <div className="flex flex-row gap-4">
          <div>Watch Status</div>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5" value={selectState} onChange={handleOptionChange} placeholder="Select status...">
            <option value="" disabled selected hidden>
              Select status...
            </option>
            <option value="watched">Watched</option>
            <option value="unwatched">Unwatched</option>
          </select>
        </div>
        <div>
          <h1>
            Why are you saving this video?
          </h1>
          <textarea className="border rounded-xl p-4 outline-none" value={text} onChange={handleTextChange} rows={4} cols={50}></textarea>
        </div>
        <div className="flex flex-row gap-4">
          <button className="p-2 rounded-xl border" onClick={handleSubmit}>Add to Notion</button>
          <button className="p-2 rounded-xl border">Cancel</button>
        </div>
      </div>
    )
  }

}

export default App;