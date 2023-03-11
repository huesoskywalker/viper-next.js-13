import { ObjectId, Timestamp } from "mongodb"
import clientPromise from "./mongodb"

export interface EventInterface {
    readonly _id: ObjectId
    organizer: Organizer
    title: string
    content: string
    location: string
    address: string
    date: Date
    category: string
    creationDate: number
    image: string
    price: number
    entries: number
    participants: Participants[]
    editionDate: number
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
    timestamp: number
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

export async function getAllEvents(): Promise<EventInterface[]> {
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

export async function getEventById(id: string): Promise<EventInterface | null> {
    const client = await clientPromise
    const db = client
        .db("viperDb")
        .collection<EventInterface>("organized_events")

    const event = await db.findOne<EventInterface>({
        _id: new ObjectId(id),
    })
    if (!event) return null
    return event
}

export async function getEventsByCategory(
    category: string
): Promise<EventInterface[]> {
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
): Promise<EventInterface[]> {
    const event = await getEventsByCategory(category)
    event.sort(sortBy(property))
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

export async function getViperCreatedEvents(
    id: string
): Promise<EventInterface[]> {
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

export async function getEventComment(
    eventId: string,
    commentId: string
): Promise<Comments[]> {
    const client = await clientPromise
    const db = client
        .db("viperDb")
        .collection<EventInterface>("organized_events")

    const eventComment = await db
        .aggregate<Comments>([
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
                    _id: "$comments._id",
                    viperId: "$comments.viperId",
                    text: "$comments.text",
                    likes: "$comments.likes",
                    replies: "$comments.replies",
                    timestamp: "$comments.timestamp",
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
): Promise<Reply[]> {
    const client = await clientPromise
    const db = client
        .db("viperDb")
        .collection<EventInterface>("organized_events")

    const eventReplies = await db
        .aggregate<Reply>([
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
                    // _id: 0,
                    // replies: "$comments.replies",
                    _id: "$comments.replies._id",
                    viperId: "$comments.replies.viperId",
                    reply: "$comments.replies.reply",
                    likes: "$comments.replies.likes",
                    timestamp: "$comments.replies.timestamp",
                },
            },
        ])
        .toArray()

    return eventReplies
}

export async function isViperOnTheList(
    eventId: string,
    viperId: string
): Promise<boolean> {
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
