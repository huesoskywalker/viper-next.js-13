import "server-only"

import { ObjectId } from "mongodb"
import { EventInterface } from "@/types/event"
import clientPromise from "@/lib/mongodb"

export const isEventCardAvailable = async (eventId: string, viperId: string): Promise<boolean> => {
    const client = await clientPromise
    const db = client.db("viperDb")

    const eventCardAvailability = await db.collection<EventInterface>("events").findOne({
        _id: new ObjectId(eventId),
        "participants._id": new ObjectId(viperId),
    })

    if (!eventCardAvailability) return false
    return true
}
