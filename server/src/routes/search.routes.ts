import { Request, Response, Router } from "express";
import { bucketName, s3 } from "../server.ts";
import axios from "axios";
import { getFromRedis, storeInRedis } from "../helpers/redis.helper.ts";
import { getFromS3, storeInS3 } from "../helpers/s3.helper.ts";
import { getWikipediaResult } from "../helpers/wikipedia.helper.ts";

const router = Router();

/**
 * Get search result from either Redis or S3. If not available, fetch
 * from Wikipedia API
 */
router.get('/search', async (req: Request, res: Response) => {
    const searchQuery = req.query.query as string

    if (!searchQuery) {
        return res.json({
            message: 'Unable to parse search query. Please try again'
        })
    }

    const redisKey = `wikipedia:${searchQuery}`;
    const s3Key = `wikipedia-${searchQuery}`;

    // Check Redis Cache.
    const existsInRedis = await getFromRedis(redisKey)

    // Get from Redis Cache
    if (existsInRedis) {
        return res.json(existsInRedis)
    }

    // Check S3
    const existsInS3 = await getFromS3(s3Key)

    // Get from S3
    if (existsInS3) {
        return res.json(existsInS3)
    }

    // Get data from wikipedia
    const wikipediaData = await getWikipediaResult(searchQuery)

    // Store result
    await storeInRedis(redisKey, wikipediaData)
    await storeInS3(s3Key, wikipediaData)

    return res.json({ source: "Wikipedia API", ...wikipediaData })
})

/**
 * Store query in S3
 */
router.get('/store', async (req: Request, res: Response) => {
    //@ts-ignore
    const key = req.query.key;
    console.log(key)
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${key}`;
    const s3Key = `wikipedia-${key}`;

    // Check S3
    const params = { Bucket: bucketName, Key: s3Key };

    try {

        const s3Result = await s3.getObject(params).promise();

        // Serve from S3
        if (!s3Result.Body) {
            return
        }
        //@ts-ignore
        const s3JSON = JSON.parse(s3Result.Body);
        res.json(s3JSON);

    } catch (err: any) {

        if (err.statusCode === 404) {
            // Serve from Wikipedia API and store in S3
            const response = await axios.get(searchUrl);
            const responseJSON = response.data;
            const body = JSON.stringify({
                source: "S3 Bucket",
                ...responseJSON,
            });

            const objectParams = { Bucket: bucketName, Key: s3Key, Body: body };

            await s3.putObject(objectParams).promise();

            console.log(`Successfully uploaded data to ${bucketName}${s3Key}`);

            res.json({ source: "Wikipedia API", ...responseJSON });

        } else {
            // Something else went wrong when accessing S3
            res.json(err);
        }
    }

})

export { router as apiRouter }