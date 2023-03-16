import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"
import {
    Viper,
    Collection,
    Follow,
    Blog,
    Likes,
    ExternalBlog,
    CommentBlog,
    Chats,
} from "../types/viper"
import { getCurrentViper } from "./session"

const client = await clientPromise
const viperCollection = client.db("viperDb").collection<Viper>("users")
const chatCollection = client.db("viperDb").collection<Chats>("chats")

export async function getViperById(id: string): Promise<Viper | null> {
    // if (id === undefined) return undefined

    try {
        const viper = await viperCollection.findOne<Viper>({
            _id: new ObjectId(id),
        })
        // if (!viper) return undefined
        return viper
    } catch (error) {
        throw new Error(`${error}`)
    }
}

export type ViperBasics = {
    readonly _id: ObjectId
    name: string
    image: string
    email: string
}
export async function getViperBasicsProps(
    viperId: string | null
): Promise<ViperBasics | null> {
    if (viperId === null) return null
    try {
        const viper = await viperCollection.findOne<Viper>(
            {
                _id: new ObjectId(viperId),
            },
            {
                projection: {
                    _id: 1,
                    name: 1,
                    image: 1,
                    email: 1,
                },
            }
        )
        return viper
    } catch (error) {
        throw new Error(`${error}`)
    }
}

export async function getVipers(): Promise<Viper[]> {
    const vipers = await viperCollection.find<Viper>({}).toArray()
    if (!vipers) throw new Error("No vipers")
    return vipers
}

export async function getViperCollection(id: string): Promise<Collection[]> {
    const events = await viperCollection
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
                    checkoutId: "$collection.checkoutId",
                },
            },
        ])
        .toArray()

    return events
}

export async function getViperLikedEvents(id: string): Promise<Likes[]> {
    const events = await viperCollection
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
    const viperFollows = await viperCollection
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
    const vipersMessenger = chatCollection
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
    const viperBlog = await viperCollection
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
    // this looks horrible
    const vId = bloggerId.slice(1, -1)
    const bId = blogId.slice(1, -1)
    try {
        const viperBlog = await viperCollection
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
    viperId: string
): Promise<boolean> {
    const currentViper = await getCurrentViper()
    if (!currentViper) return false
    // if (viperId === currentViper?.id) return false

    const viperFollower = await viperCollection.findOne({
        _id: new ObjectId(viperId),
        "followers._id": new ObjectId(currentViper.id),
    })
    if (!viperFollower) return false
    return true
}

export async function requestEventParticipation(
    viperId: string,
    eventId: string
): Promise<boolean> {
    try {
        const request = await viperCollection.findOne({
            _id: new ObjectId(viperId),
            "collection._id": new ObjectId(eventId),
        })

        if (!request) return false
        return true
    } catch (error) {
        throw new Error("Error en requestEventParticipation")
    }
}

export async function getViperBlogs(viperId: string): Promise<Blog[]> {
    try {
        const viperBlogs: Blog[] = await viperCollection
            .aggregate<Blog>([
                {
                    $match: {
                        _id: new ObjectId(viperId),
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
                        rePosts: "$blog.rePosts",
                        timestamp: "$blog.timestamp",
                    },
                },
                { $sort: { timestamp: -1 } },
            ])
            .toArray()
        return viperBlogs
    } catch (error) {
        throw new Error(`Error getViperBlogs`)
    }
}
