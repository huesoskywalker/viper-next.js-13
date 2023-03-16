import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"
import {
    EventInterface,
    Organizer,
    Participants,
    Likes,
    Comments,
    Reply,
} from "../types/event"

const client = await clientPromise
const eventCollection = client
    .db("viperDb")
    .collection<EventInterface>("organized_events")

export async function getAllEvents(): Promise<EventInterface[]> {
    const events = await eventCollection
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
    const event = await eventCollection.findOne<EventInterface>({
        _id: new ObjectId(id),
    })
    if (!event) return null
    return event
}

export async function getEventsByCategory(
    category: string
): Promise<EventInterface[]> {
    const event = await eventCollection
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
    const events = await eventCollection
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
                    // organizer: 1,
                    title: 1,
                    content: 1,
                    location: 1,
                    // address: 1,
                    date: 1,
                    category: 1,
                    // creationDate: 1,
                    // price: 1,
                    image: 1,
                    // participants: 1,
                    // likes: 1,
                    // comments: 1,
                },
            },
        ])
        .toArray()
    return events
}

export async function getViperLatestCreatedEvent(
    viperId: string
): Promise<EventInterface> {
    const events: EventInterface[] = await getViperCreatedEvents(viperId)
    const lastEvent: EventInterface = events[0]
    return lastEvent
}

export async function getEventComments(
    eventId: string
): Promise<Comments[] | null> {
    const eventComments = await eventCollection
        .aggregate<Comments>([
            {
                $match: { _id: new ObjectId(eventId) },
            },
            {
                $unwind: "$comments",
            },
            {
                $project: {
                    _id: "$comments._id",
                    eventTitle: "$title",
                    viperId: "$comments.viperId",
                    text: "$comments.text",
                    likes: "$comments.likes",
                    replies: "$comments.replies",
                    timestamp: "$comments.timestamp",
                },
            },
        ])
        .toArray()

    return eventComments
}

export async function getEventCommentById(
    eventId: string,
    commentId: string
): Promise<Comments[] | null> {
    const eventComment = await eventCollection
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
                    eventTitle: "$title",
                    viperId: "$comments.viperId",
                    text: "$comments.text",
                    likes: "$comments.likes",
                    replies: "$comments.replies",
                    timestamp: "$comments.timestamp",
                },
            },
        ])
        .toArray()
    if (!eventComment) return null
    return eventComment
}

export async function getEventCommentReplies(
    eventId: string,
    commentId: string,
    viperId: string
): Promise<Reply[]> {
    const eventReplies = await eventCollection
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
    const isParticipant = await eventCollection.findOne({
        _id: new ObjectId(eventId),
        "participants._id": new ObjectId(viperId),
    })

    if (!isParticipant) return false

    return true
}
