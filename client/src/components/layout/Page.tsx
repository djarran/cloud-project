import { useQuery } from "@tanstack/react-query"
import { Main } from "../Main"
import { Header } from "./Header"
import { getCounter } from "../../helpers/postUrl"

export const Page = () => {
    const { data, refetch } = useQuery(['counter'], getCounter)

    return (
        <>
            <Header data={data} />
            <Main refetchCounter={refetch} />
        </>
    )
}