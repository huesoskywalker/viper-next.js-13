import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"

interface Session {
    id: string
    name: string
    email: string
    image: string
    userRole: string
}

export interface EventInterface {
    readonly _id: ObjectId
    organizer: Session
    title: string
    content: string
    location: string
    date: string
    category: string
}

export async function getEvents() {
    const client = await clientPromise
    // try {
    const db = await client
        .db("viperDb")
        .collection<EventInterface>("organized_events")

    const events = await db.find<EventInterface[]>({}).toArray()

    return events
    // }
    // finally {
    //     await client.close()
    // }
}

//leave me here
// export const revalidate = 3600

export async function getEvent(noteId: string) {
    const client = await clientPromise
    // try {
    const db = await client
        .db("viperDb")
        .collection<EventInterface>("organized_events")

    const event = await db.findOne<EventInterface>({
        _id: new ObjectId(noteId),
    })
    // .aggregate([
    //     {
    //     },
    // ])
    return event
    // } finally {
    //     await client.close()
    // }
}

export async function getEventsByCategory(category: string) {
    const client = await clientPromise

    const db = await client
        .db("viperDb")
        .collection<EventInterface>("organized_events")

    const event = await db
        .aggregate<EventInterface>([
            {
                $match: { category: category },
            },
            {
                $project: {
                    _id: 1,
                    organizer: 1,
                    title: 1,
                    content: 1,
                    location: 1,
                    date: 1,
                    category: 1,
                },
            },
        ])
        .toArray()

    return event
}
