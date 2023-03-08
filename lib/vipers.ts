import { ObjectId } from "mongodb"
import runTest from "../graphql/query/node"
import { NODE_CHECKOUT_QUERY } from "../graphql/query/nodeCheckout"
import { shopifyAdmin } from "./adminApi"
import clientPromise from "./mongodb"
import { storefrontClient } from "./storefrontApi"

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
    followers: ObjectId[]
    follows: ObjectId[]
    likes: Likes[]
    blog: Blog[]
    blogLikes: ExternalBlog[]
    blogCommented: CommentBlog[]
    blogRePosts: ExternalBlog[]
}
type Address = {
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
    sender: string
    message: string
    time: Date
}

export async function getViperById(id: string) {
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")

    try {
        const viper = await db.findOne({
            _id: new ObjectId(id),
        })

        return viper
    } catch (error) {
        console.error(error)
    }
}

export async function getVipers() {
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")
    const vipers = await db.find<Viper>({}).toArray()

    return vipers
}

export async function getViperParticipatedEvents(id: string) {
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")
    const events = await db
        .aggregate<Viper>([
            {
                $match: { _id: new ObjectId(id) },
            },
            {
                $unwind: "$collection",
            },
            {
                $project: {
                    _id: "$collection._id",
                    // participated: ,
                },
            },
        ])
        .toArray()

    return events
}

export async function getViperLikedEvents(id: string) {
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")
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
                    // _id: 0,
                    // likes: 1,
                    _id: "$likes._id",
                },
            },
        ])
        .toArray()

    return events
}

export async function getViperFollows(id: string) {
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")
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
    const db = client.db("viperDb").collection<Chats>("chats")
    const vipersMessenger = db
        .aggregate([
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
                    _id: 0,
                    message_id: "$messages._id",
                    sender: "$messages.sender",
                    message: "$messages.message",
                    timestamp: "$messages.timestamp",
                },
            },
        ])
        .toArray()

    return vipersMessenger
}

export async function getBlogLikesAndRePosts(id: string) {
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")

    const viperBlog = await db
        .aggregate([
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
            // {
            //     $addFields: {
            //         merged: {
            //             $mergeObjects: ["$blogRePosts", "$blogLikes"],
            //         },
            //     },
            // },
            // {
            //     $project: {
            //         merged: 1,
            //     },
            // },
        ])
        .toArray()
    return viperBlog
}

export async function getBlog(bloggerId: string, blogId: string) {
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")
    const vId = bloggerId.slice(1, -1)
    const bId = blogId.slice(1, -1)
    try {
        const viperBlog = db
            .aggregate([
                {
                    $match: {
                        _id: new ObjectId(vId),
                        "blog._id": new ObjectId(bId),
                    },
                },
                // {
                //     $unwind: "$blog",
                // },

                // {
                //     $project: {
                //         _id: "$blog._id",
                //         content: "$blog.content",
                //         likes: "$blog.likes",
                //         timestamp: "$blog.timestamp",
                //         rePosts: "$blog.rePosts",
                //     },
                // },
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
) {
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")

    const viperFollower = db.findOne({
        _id: new ObjectId(viperId),
        followers: new ObjectId(currentViper),
    })
    return viperFollower
}

export async function requestEventParticipation(
    viperId: string,
    eventId: string
) {
    const client = await clientPromise
    const db = client.db("viperDb").collection<Viper>("users")

    const request = await db.findOne({
        _id: new ObjectId(viperId),
        "collection._id": new ObjectId(eventId),
    })

    if (!request) return false
    return true
}
