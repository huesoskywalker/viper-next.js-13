import { getEventComments } from "@/lib/events"
import { Comments } from "@/types/event"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const eventId: string | string[] | undefined = req.query._id
    try {
        if (!Array.isArray(eventId) && eventId) {
            const eventComments: Comments[] | null = await getEventComments(eventId)

            return res.status(200).json(eventComments)
        }
    } catch (error) {
        return res.status(400).json(error)
    }
}
