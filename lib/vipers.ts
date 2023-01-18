import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"

export interface Viper {
    readonly _id: ObjectId
    name: string
    email: string
    image: string
    backgroundImage: string
    emailVerified: null
    biography: string
    participated: string[]
    location: string
    followers: string[]
    follows: string[]
    likes: string[]
    blog: Blog[]
}

export interface Blog {
    readonly _id: ObjectId
    content: string
}

export interface Chats {
    sender: string
    message: string
    time: Date
}

export async function getViperById(id: string) {
    const client = await clientPromise
    const db = await client.db("viperDb").collection<Viper>("users")

    const viper = await db.findOne<Viper>({
        _id: new ObjectId(id),
    })

    return viper
}

export async function getVipers() {
    const client = await clientPromise
    const db = await client.db("viperDb").collection<Viper>("users")
    const vipers = await db.find<Viper>({}).toArray()

    return vipers
}

export async function getViperParticipatedEvents(id: string) {
    const client = await clientPromise
    const db = await client.db("viperDb").collection<Viper>("users")
    const events = await db
        .aggregate<Viper>([
            {
                $match: { _id: new ObjectId(id) },
            },
            {
                $unwind: "$participated",
            },
            {
                $project: {
                    _id: 0,
                    participated: 1,
                },
            },
        ])
        .toArray()

    return events
}

export async function getViperLikedEvents(id: string) {
    const client = await clientPromise
    const db = await client.db("viperDb").collection<Viper>("users")
    const events = await db
        .aggregate<Viper>([
            {
                $match: { _id: new ObjectId(id) },
            },
            {
                $unwind: "$likes",
            },
            {
                $project: {
                    _id: 0,
                    likes: 1,
                },
            },
        ])
        .toArray()

    return events
}

export async function getViperFollows(id: string) {
    const client = await clientPromise
    const db = await client.db("viperDb").collection<Viper>("users")
    const viperFollows = await db
        .aggregate([
            {
                $match: { _id: new ObjectId(id) },
            },
            {
                $unwind: "$follows",
            },
            {
                $project: {
                    _id: 0,
                    follows: 1,
                },
            },
        ])
        .toArray()
    return viperFollows
}

export async function getVipersMessenger(id: string, viperId: string) {
    const client = await clientPromise
    const db = await client.db("viperDb").collection<Chats>("chats")
    const vipersMessenger = db
        .aggregate([
            {
                $match: {
                    $or: [
                        {
                            members: [id, viperId],
                        },
                        {
                            members: [viperId, id],
                        },
                    ],
                },
            },
            {
                $unwind: "$messages",
            },
            {
                $project: {
                    _id: 0,
                    messages: 1,
                },
            },
        ])
        .toArray()

    return vipersMessenger
}
