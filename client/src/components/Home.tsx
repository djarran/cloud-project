import { ChangeEvent, useEffect } from "react"

type HomeType = {
    url: string,
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void,
    handleSubmit: () => void,
}

const Home = ({ url, handleInputChange, handleSubmit }: HomeType) => {

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/counter`, {
            method: 'POST',
        })
    }, [])

    return (
        <div className="flex flex-col gap-2">
            <p className="pl-1 font-bold">
                Enter YouTube or Reddit URL
            </p>
            <div className="flex flex-row gap-4">

                <input
                    type="text"
                    className="border p-4 outline-none rounded-xl"
                    value={url}
                    placeholder="https://"
                    onChange={handleInputChange}
                />
                <button onClick={handleSubmit} className="bg-black text-white rounded-xl border px-2 hover:bg-neutral-600 transition-colors">Submit</button>
            </div>
        </div>
    )
}

export default Home