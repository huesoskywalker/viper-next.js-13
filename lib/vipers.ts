import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"

export interface Viper {
    readonly _id: ObjectId
    name: string
    email: string
    image: string
    emailVerified: null
    backgroundImage: string
    biography: string
    location: string
    address: Address
    customerAccessToken: string
    collection: Collection[]
    followers: Follow[]
    follows: Follow[]
    likes: Likes[]
    blog: Blog[]
    blogLikes: ExternalBlog[]
    blogCommented: CommentBlog[]
    blogRePosts: ExternalBlog[]
}
export interface Follow {
    readonly _id: ObjectId
}
export interface Address {
    phone: number
    address: string
    province: string
    country: string
    zip: number
    city: string
}
export interface Collection {
    readonly _id: ObjectId
    readonly checkoutId: string
}
export interface Likes {
    readonly _id: ObjectId
}
export interface Blog {
    readonly _id: ObjectId
    content: string
    likes: string[]
    comments: string[]
    rePosts: string[]
    timestamp: number
}

export interface ExternalBlog {
    readonly bloggerId: Object
    readonly blogId: Object
    readonly viperId: Object
    timestamp: number
}
export interface CommentBlog {
    readonly bloggerId: Object
    readonly blogId: Object
    readonly viperId: Object
    comment: string
    timestamp: number
}

export interface Chats {
    readonly _id: ObjectId
    sender: string
    message: string
    timestamp: number
}

export async function getViperById(id: string): Promise<Viper | undefined> {
    if (id === undefined) return undefined

    try {
        const client = await clientPromise
        const db = client.db("viperDb").collection<Viper>("users")
        const viper = await db.findOne<Viper>({
            _id: new ObjectId(id),
        })
        if (!viper) return undefined
        return viper
    } catch (error) {
        console.error(error)
    }
}

export async function getVipers(): Promise<Viper[]> {
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")
    const vipers = await db.find<Viper>({}).toArray()

    return vipers
}

export async function getViperCollection(id: string): Promise<Collection[]> {
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")
    const events = await db
        .aggregate<Collection>([
            {
                $match: { _id: new ObjectId(id) },
            },
            {
                $unwind: "$collection",
            },
            {
                $project: {
                    _id: "$collection._id",
                },
            },
        ])
        .toArray()

    return events
}

export async function getViperLikedEvents(id: string): Promise<Likes[]> {
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")
    const events = await db
        .aggregate<Likes>([
            {
                $match: { _id: new ObjectId(id) },
            },
            {
                $unwind: "$likes",
            },
            {
                $project: {
                    _id: "$likes._id",
                },
            },
        ])
        .toArray()

    return events
}

export async function getViperFollows(id: string): Promise<Follow[]> {
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")
    const viperFollows = await db
        .aggregate<Follow>([
            {
                $match: { _id: new ObjectId(id) },
            },
            {
                $unwind: "$follows",
            },
            {
                $project: {
                    _id: "$follows._id",
                },
            },
        ])
        .toArray()
    return viperFollows
}

export async function getVipersMessenger(
    id: string,
    viperId: string
): Promise<Chats[]> {
    const client = await clientPromise
    const db = client.db("viperDb").collection<Chats>("chats")
    const vipersMessenger = db
        .aggregate<Chats>([
            {
                $match: {
                    $or: [
                        {
                            members: [new ObjectId(id), new ObjectId(viperId)],
                        },
                        {
                            members: [new ObjectId(viperId), new ObjectId(id)],
                        },
                    ],
                },
            },
            {
                $unwind: "$messages",
            },
            {
                $project: {
                    _id: "$messages._id",
                    sender: "$messages.sender",
                    message: "$messages.message",
                    timestamp: "$messages.timestamp",
                },
            },
        ])
        .toArray()

    return vipersMessenger
}

export async function getBlogLikesAndRePosts(
    id: string
): Promise<CommentBlog[] & ExternalBlog[]> {
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")

    const viperBlog = await db
        .aggregate<CommentBlog & ExternalBlog>([
            {
                $match: {
                    _id: new ObjectId(id),
                },
            },
            {
                $project: {
                    _id: 0,
                    blogLikesAndRePosts: {
                        $concatArrays: [
                            "$blogLikes",
                            "$blogRePosts",
                            "$blogCommented",
                        ],
                    },
                },
            },
            {
                $unwind: "$blogLikesAndRePosts",
            },
            {
                $project: {
                    bloggerId: "$blogLikesAndRePosts.bloggerId",
                    blogId: "$blogLikesAndRePosts.blogId",
                    timestamp: "$blogLikesAndRePosts.timestamp",
                    viperId: "$blogLikesAndRePosts.viperId",
                    comment: "$blogLikesAndRePosts.comment",
                },
            },
            {
                $sort: { timestamp: -1 },
            },
        ])
        .toArray()
    return viperBlog
}

export async function getBlog(
    bloggerId: string,
    blogId: string
): Promise<Blog[] | undefined> {
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")
    const vId = bloggerId.slice(1, -1)
    const bId = blogId.slice(1, -1)
    try {
        const viperBlog = db
            .aggregate<Blog>([
                {
                    $match: {
                        _id: new ObjectId(vId),
                        "blog._id": new ObjectId(bId),
                    },
                },
                {
                    $project: {
                        blog: {
                            $filter: {
                                input: "$blog",
                                as: "b",
                                cond: { $eq: ["$$b._id", new ObjectId(bId)] },
                            },
                        },
                    },
                },
                {
                    $unwind: "$blog",
                },
                {
                    $project: {
                        _id: "$blog._id",
                        content: "$blog.content",
                        likes: "$blog.likes",
                        comments: "$blog.comments",
                        timestamp: "$blog.timestamp",
                        rePosts: "$blog.rePosts",
                    },
                },
            ])
            .toArray()

        return viperBlog
    } catch (error) {
        console.error(error)
    }
}

export default async function getViperFollowById(
    viperId: string,
    currentViper: string
): Promise<boolean> {
    if (viperId === currentViper) return false
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")

    const viperFollower = await db.findOne({
        _id: new ObjectId(viperId),
        "followers._id": new ObjectId(currentViper),
    })
    if (!viperFollower) return false
    return true
}

export async function requestEventParticipation(
    viperId: string,
    eventId: string
): Promise<boolean> {
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")

    const request = await db.findOne({
        _id: new ObjectId(viperId),
        "collection._id": new ObjectId(eventId),
    })

    if (!request) return false
    return true
}
