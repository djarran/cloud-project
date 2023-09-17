import { Client } from "@notionhq/client";

import 'dotenv/config'

/**
 * Initialise Notion client
 */
export const notion = new Client({
    auth: process.env.NOTION_SECRET
})