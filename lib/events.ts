import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"
import { Session } from "next-auth"

export interface EventInterface {
    readonly _id: ObjectId
    organizer: Organizer
    title: string
    content: string
    location: string
    address: string
    date: Date
    category: string
    creationDate: Date
    image: string
    price: number
    entries: number
    participants: Participants[]
    editionDate: Date
    likes: Likes[]
    comments: Comments[]
    productId: string
}

export type Organizer = {
    readonly id: string
    name: string
    email: string
    image: string
}
export interface Participants {
    readonly _id: ObjectId
}
export interface Likes {
    readonly _id: ObjectId
}
export interface Comments {
    readonly _id: ObjectId
    viperId: ObjectId
    text: string
    likes: string[]
    replies: Reply[]
    timestamp: number
}

export interface Reply {
    readonly _id: Object
    viperId: string
    reply: string
    likes: string[]
}

export interface EditEvent {
    title: string
    content: string
    location: string
    date: string
    category: string
    price: string
    image: string
}

export async function getAllEvents() {
    const client = await clientPromise
    const db = client
        .db("viperDb")
        .collection<EventInterface>("organized_events")

    const events = await db
        .aggregate<EventInterface>([
            {
                $sort: { date: 1 },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    location: 1,
                    date: 1,
                    category: 1,
                    image: 1,
                },
            },
        ])
        .toArray()

    return events
}

//leave me here
// export const revalidate = 3600

export async function getEventById(id: string) {
    const client = await clientPromise
    const db = client
        .db("viperDb")
        .collection<EventInterface>("organized_events")

    const event = await db.findOne({
        _id: new ObjectId(id),
    })

    return event
}

export async function getEventsByCategory(category: string) {
    const client = await clientPromise

    const db = client
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
                    title: 1,
                    content: 1,
                    location: 1,
                    date: 1,
                    category: 1,
                    image: 1,
                    likes: 1,
                },
            },
        ])
        .toArray()

    return event
}

export async function sortEventByCategoryAndSlug(
    category: string,
    property: string
) {
    const event = await getEventsByCategory(category)
    await event.sort(sortBy(property))
    return event
}

function sortBy(field: string) {
    return function (a: any, b: any) {
        if (field === "likes") {
            if (a[field] < b[field].length) {
                return 1
            } else if (a[field].length > b[field].length) {
                return -1
            }
            return 0
        } else if (a[field] > b[field]) {
            return 1
        } else if (a[field] < b[field]) {
            return -1
        }
        return 0
    }
}

export async function getViperCreatedEvents(id: string) {
    const client = await clientPromise

    const db = client
        .db("viperDb")
        .collection<EventInterface>("organized_events")

    const events = await db
        .aggregate<EventInterface>([
            {
                $match: { "organizer.id": id },
            },
            {
                $sort: { creationDate: -1 },
            },
            {
                $project: {
                    _id: 1,
                    organizer: 1,
                    title: 1,
                    content: 1,
                    location: 1,
                    address: 1,
                    date: 1,
                    category: 1,
                    creationDate: 1,
                    price: 1,
                    image: 1,
                    participants: 1,
                    likes: 1,
                    comments: 1,
                },
            },
        ])
        .toArray()
    return events
}

export async function getEventComment(eventId: string, commentId: string) {
    const client = await clientPromise
    const db = client
        .db("viperDb")
        .collection<EventInterface>("organized_events")

    const eventComment = await db
        .aggregate([
            {
                $match: {
                    _id: new ObjectId(eventId),
                },
            },
            {
                $unwind: "$comments",
            },

            {
                $match: {
                    "comments._id": new ObjectId(commentId),
                },
            },

            {
                $project: {
                    _id: 0,
                    comments: 1,
                },
            },
        ])
        .toArray()
    return eventComment
}

export async function getEventReplies(
    eventId: string,
    commentId: string,
    viperId: string
) {
    const client = await clientPromise
    const db = client
        .db("viperDb")
        .collection<EventInterface>("organized_events")

    const eventReplies = await db
        .aggregate([
            {
                $match: {
                    _id: new ObjectId(eventId),
                },
            },
            {
                $unwind: "$comments",
            },
            {
                $match: {
                    "comments._id": new ObjectId(commentId),
                    "comments.viperId": new ObjectId(viperId),
                },
            },
            {
                $unwind: "$comments.replies",
            },
            {
                $project: {
                    _id: 0,
                    replies: "$comments.replies",
                },
            },
        ])
        .toArray()

    return eventReplies
}

export async function isViperOnTheList(eventId: string, viperId: string) {
    const client = await clientPromise
    const db = client
        .db("viperDb")
        .collection<EventInterface>("organized_events")
    const isParticipant = await db.findOne({
        _id: new ObjectId(eventId),
        "participants._id": new ObjectId(viperId),
    })

    if (!isParticipant) return false

    return true
}
