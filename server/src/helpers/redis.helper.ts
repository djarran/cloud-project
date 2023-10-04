import { redisClient } from "../server.ts"

export const getFromRedis = async (redisKey: string) => {
    const result = await redisClient.get(redisKey)
    if (result) return JSON.parse(result)
    return
}

export const storeInRedis = async (redisKey: string, wikipediaData: any) => {

    return await redisClient.setEx(
        redisKey,
        3600,
        JSON.stringify({ source: "Redis Cache", ...wikipediaData })
    )
}