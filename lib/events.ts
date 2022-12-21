import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"

interface Session {
    id: string
    name: string
    email: string
    image: string
    userRole: string
}

interface EventInterface {
    readonly _id: ObjectId
    organizer: Session
    title: string
    content: string
    location: string
    date: Date
    category: string
}

export async function getEvents() {
    const client = await clientPromise
    // try {
    const db = await client.db("viperDb").collection<EventInterface>("organized_events")

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
    const db = await client.db("viperDb").collection<EventInterface>("organized_events")

    const event = db.findOne<EventInterface>({
        _id: new ObjectId(noteId),
    })
    console.log(`-----------event-----------`)
    console.log(event)
    // .aggregate([
    //     {
    //     },
    // ])
    return event
    // } finally {
    //     await client.close()
    // }
}
